import re
import asyncio
import uuid
import logging
import os
from pathlib import Path
from typing import List, Dict, Optional
from datetime import datetime
import json

import soundfile as sf
import numpy as np
import librosa
from pydub import AudioSegment

from app.services.voice_cloner import VoiceClonerService
from app.services.denoiser import DenoiserService

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PodcastService:
    def __init__(self, voice_cloner: VoiceClonerService):
        self.voice_cloner = voice_cloner
        self.output_dir = Path("uploads/podcast_outputs")
        self.output_dir.mkdir(parents=True, exist_ok=True)
        # Limit concurrent generations to avoid CPU choking
        self.generation_semaphore = asyncio.Semaphore(2)
        
        # Ensure FFMPEG is in path (Shared logic with Denoiser)
        FFMPEG_PATH = Path(__file__).parent.parent.parent / "ffmpeg-master-latest-win64-gpl" / "bin"
        if FFMPEG_PATH.exists():
            os.environ["PATH"] = str(FFMPEG_PATH) + os.pathsep + os.environ.get("PATH", "") 

    def parse_script(self, script_text: str) -> List[Dict[str, str]]:
        """
        Parse script into segments.
        Format: "SpeakerName: Text content..."
        """
        lines = script_text.strip().split('\n')
        segments = []
        
        current_speaker = None
        current_text = []
        
        # Regex to find "Name:" pattern at start of line
        speaker_pattern = re.compile(r'^([^:]+):\s*(.*)')
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
                
            match = speaker_pattern.match(line)
            if match:
                # If we have a previous segment accumulating, save it
                if current_speaker and current_text:
                    segments.append({
                        "speaker": current_speaker,
                        "text": " ".join(current_text)
                    })
                    current_text = []
                
                # Start new segment
                current_speaker = match.group(1).strip()
                text_content = match.group(2).strip()
                if text_content:
                    current_text.append(text_content)
            else:
                # Continuation of previous speaker's line
                if current_speaker:
                    current_text.append(line)
        
        # Add the final segment
        if current_speaker and current_text:
            segments.append({
                "speaker": current_speaker,
                "text": " ".join(current_text)
            })
            
        return segments

    async def generate_podcast(self, script: str, speaker_map: Dict[str, str], title: str = "Podcast") -> dict:
        """
        Generate a full podcast from script.
        speaker_map: {"SpeakerName": "voice_model_id"}
        """
        podcast_id = str(uuid.uuid4())
        segments = self.parse_script(script)
        
        logger.info(f"Starting podcast generation {podcast_id} with {len(segments)} segments")
        
        # Validate speakers
        for segment in segments:
            if segment["speaker"] not in speaker_map:
                raise ValueError(f"Speaker '{segment['speaker']}' not defined in cast.")

        # Generate segments SEQUENTIALLY (Pocket-TTS model state is not thread-safe)
        segment_files = []
        for i, segment in enumerate(segments):
            voice_id = speaker_map[segment["speaker"]]
            logger.info(f"Generating segment {i+1}/{len(segments)} for {segment['speaker']}")
            file_path = await self._generate_segment(i, segment["text"], voice_id, podcast_id)
            segment_files.append(file_path)
        
        # Stitch them together
        output_path = self.output_dir / f"{podcast_id}.wav"
        
        logger.info(f"Stitching {len(segment_files)} segments...")
        duration = await asyncio.to_thread(
            self._stitch_audio, 
            segment_files, 
            output_path
        )
        
        # Clean up temp files
        for f in segment_files:
            try:
                Path(f).unlink(missing_ok=True)
            except Exception as e:
                logger.warning(f"Failed to delete temp file {f}: {e}")

        return {
            "id": podcast_id,
            "title": title,
            "url": f"/api/podcast/audio/{podcast_id}",
            "duration": duration,
            "segments": segments # Return parsed script for UI sync
        }

    async def _generate_segment_safe(self, index: int, text: str, voice_id: str, podcast_id: str) -> str:
        """Wrapper to limit concurrency."""
        async with self.generation_semaphore:
            return await self._generate_segment(index, text, voice_id, podcast_id)

    async def _generate_segment(self, index: int, text: str, voice_id: str, podcast_id: str) -> str:
        """Generate single audio segment."""
        # Use existing cloner service
        # Note: speed/pitch support could be added here by extending arguments
        result = await self.voice_cloner.generate_speech(
            text=text,
            voice_model_id=voice_id
        )
        
        # Move to temp location with index to ensure order
        src_path = Path(result["output_path"])
        dest_path = self.output_dir / f"{podcast_id}_seg_{index:03d}.wav"
        src_path.rename(dest_path)
        
        return str(dest_path)

    def _stitch_audio(self, file_paths: List[str], output_path: Path) -> float:
        """Concatenate audio files using pydub."""
        combined = AudioSegment.empty()
        silence = AudioSegment.silent(duration=300) # 300ms gap
        
        for i, fp in enumerate(file_paths):
            try:
                seg = AudioSegment.from_wav(fp)
                combined += seg
                # Add silence between speakers
                if i < len(file_paths) - 1:
                    combined += silence
            except Exception as e:
                logger.error(f"Error processing segment {fp}: {e}")
        
        combined.export(str(output_path), format="wav")
        return combined.duration_seconds
