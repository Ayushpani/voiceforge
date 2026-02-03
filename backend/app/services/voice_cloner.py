"""
Voice Cloner Service - Uses Pocket-TTS for voice cloning
The core USP of VoiceForge

Reference: https://huggingface.co/kyutai/pocket-tts
"""

import torch
import json
import uuid
import os
import asyncio
import copy
from pathlib import Path
from datetime import datetime
import soundfile as sf
import numpy as np
import scipy.io.wavfile

from pocket_tts import TTSModel


import librosa

class VoiceClonerService:
    """Voice cloning service using Pocket-TTS."""
    
    def __init__(self, voice_models_dir: str = "voice_models"):
        self.voice_models_dir = Path(voice_models_dir)
        self.voice_models_dir.mkdir(parents=True, exist_ok=True)
        
        # Initialize Pocket-TTS from HuggingFace
        print("Loading Pocket-TTS model...")
        # Using the variant we found in config
        self.tts_model = TTSModel.load_model("b6369a24") 
        print(f"Pocket-TTS loaded! Sample rate: {self.tts_model.sample_rate}")

    
    def _apply_effects(self, audio: np.ndarray, sr: int, speed: float, pitch: float) -> np.ndarray:
        """Apply speed and pitch effects using librosa."""
        y = audio.astype(np.float32)
        
        # Apply pitch shift (semitones)
        if pitch != 0:
            # Shift pitch without changing speed
            y = librosa.effects.pitch_shift(y, sr=sr, n_steps=pitch)

        # Apply time stretch (speed)
        if speed != 1.0 and speed > 0:
            # Stretch time without changing pitch
            y = librosa.effects.time_stretch(y, rate=speed)
            
        return y
    
    async def save_voice_model(
        self,
        audio_path: str,
        name: str,
        tags: list[str] | None = None
    ) -> dict:
        """
        Clone a voice from source audio and save as a model.
        Run CPU-heavy operations in a thread pool to avoid blocking the event loop.
        """
        model_id = str(uuid.uuid4())
        model_dir = self.voice_models_dir / model_id
        model_dir.mkdir(parents=True, exist_ok=True)
        
        # Load audio for duration calculation
        try:
            audio, sr = sf.read(audio_path)
            if len(audio.shape) > 1:
                audio = audio.mean(axis=1)  # Convert to mono
            duration = len(audio) / sr
        except Exception as e:
            print(f"Error reading audio file: {e}")
            raise ValueError(f"Invalid audio file: {e}")
        
        # Create voice state using Pocket-TTS (Heavy CPU op)
        print(f"Creating voice state for {model_id} from {audio_path}...")
        voice_state = await asyncio.to_thread(
            self.tts_model.get_state_for_audio_prompt, 
            audio_path
        )
        print(f"Voice state created for {model_id}")
        
        # Save voice state
        await asyncio.to_thread(torch.save, voice_state, model_dir / "voice_state.pt")
        
        # Copy original audio as reference
        sf.write(model_dir / "original.wav", audio, sr)
        
        # Create a preview (first 10 seconds)
        preview_samples = min(int(sr * 10), len(audio))
        preview = audio[:preview_samples]
        sf.write(model_dir / "preview.wav", preview, sr)
        
        # Save metadata
        metadata = {
            "id": model_id,
            "name": name,
            "created_at": datetime.now().isoformat(),
            "duration_seconds": float(duration),
            "sample_rate": int(sr),
            "tags": tags or []
        }
        
        with open(model_dir / "metadata.json", "w") as f:
            json.dump(metadata, f, indent=2)
        
        return metadata
    
    def load_voice_model(self, model_id: str) -> tuple:
        """Load a voice model by ID - regenerates state from original audio."""
        model_dir = self.voice_models_dir / model_id
        
        if not model_dir.exists():
             raise FileNotFoundError(f"Model {model_id} not found")

        # Load metadata
        with open(model_dir / "metadata.json") as f:
            metadata = json.load(f)
        
        # IMPORTANT: Regenerate voice_state from original audio each time
        # The .pt cache can become corrupted and is not reliable
        original_audio_path = model_dir / "original.wav"
        if not original_audio_path.exists():
            raise FileNotFoundError(f"Original audio for model {model_id} not found")
        
        print(f"Regenerating voice state from {original_audio_path}...")
        voice_state = self.tts_model.get_state_for_audio_prompt(str(original_audio_path))
        
        return voice_state, metadata
    
    async def generate_speech(
        self,
        text: str,
        voice_model_id: str | None = None,
        audio_path: str | None = None,
        speed: float = 1.0,
        pitch: float = 0.0
    ) -> dict:
        """
        Generate speech from text using Pocket-TTS.
        Run CPU-heavy operations in a thread pool.
        """
        output_id = str(uuid.uuid4())
        output_dir = Path("uploads") / "outputs"
        output_dir.mkdir(parents=True, exist_ok=True)
        output_path = output_dir / f"{output_id}.wav"
        
        # Get voice state (might involve loading file or processing audio)
        print(f"Preparing generation for {output_id}...")
        if voice_model_id:
            voice_state, _ = await asyncio.to_thread(self.load_voice_model, voice_model_id)
        elif audio_path:
             print(f"Encoding voice from audio path: {audio_path}")
             voice_state = await asyncio.to_thread(
                 self.tts_model.get_state_for_audio_prompt, 
                 audio_path
             )
        else:
            # Use a default voice
            print("Using default voice")
            voice_state = await asyncio.to_thread(
                self.tts_model.get_state_for_audio_prompt,
                "hf://kyutai/tts-voices/alba-mackenna/casual.wav"
            )
        
        # Generate audio using Pocket-TTS (Heavy CPU op)
        # IMPORTANT: Deep copy voice_state as Pocket-TTS mutates it during generation
        print(f"Generating audio for '{text}'...")
        voice_state_copy = copy.deepcopy(voice_state)
        audio = await asyncio.to_thread(
            self.tts_model.generate_audio,
            voice_state_copy, 
            text
        )
        print(f"Generation complete for {output_id}")
        
        # Audio is a 1D torch tensor containing PCM data
        audio_np = audio.numpy()
        
        # Apply effects if needed
        if speed != 1.0 or pitch != 0.0:
            print(f"Applying effects: speed={speed}, pitch={pitch}")
            audio_np = await asyncio.to_thread(
                self._apply_effects,
                audio_np, 
                self.tts_model.sample_rate, 
                speed, 
                pitch
            )
        
        # Save output
        await asyncio.to_thread(
            scipy.io.wavfile.write,
            str(output_path), 
            self.tts_model.sample_rate, 
            audio_np
        )
        
        duration = len(audio_np) / self.tts_model.sample_rate
        
        return {
            "output_id": output_id,
            "output_path": str(output_path),
            "duration_seconds": duration,
            "sample_rate": self.tts_model.sample_rate
        }
    
    def list_voice_models(self) -> list[dict]:
        """List all saved voice models."""
        models = []
        
        if not self.voice_models_dir.exists():
            return []

        for model_dir in self.voice_models_dir.iterdir():
            if model_dir.is_dir():
                metadata_path = model_dir / "metadata.json"
                if metadata_path.exists():
                    try:
                        with open(metadata_path) as f:
                            metadata = json.load(f)
                            models.append(metadata)
                    except Exception as e:
                        print(f"Error reading metadata for {model_dir}: {e}")
        
        # Sort by creation date, newest first
        models.sort(key=lambda x: x.get("created_at", ""), reverse=True)
        return models
    
    def get_voice_model(self, model_id: str) -> dict | None:
        """Get a specific voice model metadata."""
        model_dir = self.voice_models_dir / model_id
        metadata_path = model_dir / "metadata.json"
        
        if metadata_path.exists():
            with open(metadata_path) as f:
                return json.load(f)
        return None
    
    def delete_voice_model(self, model_id: str) -> bool:
        """Delete a voice model."""
        import shutil
        model_dir = self.voice_models_dir / model_id
        
        if model_dir.exists():
            shutil.rmtree(model_dir)
            return True
        return False
    
    def get_preview_path(self, model_id: str) -> str | None:
        """Get the preview audio path for a voice model."""
        preview_path = self.voice_models_dir / model_id / "preview.wav"
        if preview_path.exists():
            return str(preview_path)
        return None


# Global instance
voice_cloner_service = VoiceClonerService()
