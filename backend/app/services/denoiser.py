"""
Denoiser Service - Simplified version using librosa for noise reduction
Since DeepFilterNet doesn't support Python 3.14 yet
"""

import librosa
import soundfile as sf
import numpy as np
from pathlib import Path
import tempfile
import os
import asyncio

# Configure ffmpeg for pydub (use bundled version)
FFMPEG_PATH = Path(__file__).parent.parent.parent / "ffmpeg-master-latest-win64-gpl" / "bin"
if FFMPEG_PATH.exists():
    os.environ["PATH"] = str(FFMPEG_PATH) + os.pathsep + os.environ.get("PATH", "")

from pydub import AudioSegment


class DenoiserService:
    """Audio processing service for denoising and format conversion."""
    
    MIN_DURATION_SECONDS = 30  # Minimum required for voice cloning
    TARGET_SAMPLE_RATE = 48000
    
    def __init__(self):
        self.temp_dir = Path(tempfile.gettempdir()) / "voiceforge" / "processed"
        self.temp_dir.mkdir(parents=True, exist_ok=True)
    
    def _convert_to_wav(self, input_path: str, output_path: str) -> str:
        """Convert any supported audio format to WAV using pydub."""
        ext = Path(input_path).suffix.lower().lstrip('.')
        if ext == 'wav':
            return input_path
        
        try:
            audio = AudioSegment.from_file(input_path, format=ext)
            audio = audio.set_frame_rate(self.TARGET_SAMPLE_RATE).set_channels(1)
            audio.export(output_path, format='wav')
            return output_path
        except Exception as e:
            raise ValueError(f"Failed to convert {ext} to WAV: {str(e)}")
    
    async def process_audio(
        self,
        input_path: str,
        output_path: str | None = None
    ) -> dict:
        """
        Process audio file: load, resample, apply basic noise reduction.
        """
        try:
            # Run blocking operations in thread
            return await asyncio.to_thread(self._process_sync, input_path, output_path)
        except Exception as e:
            return {
                "output_path": "",
                "duration_seconds": 0,
                "sample_rate": 0,
                "is_valid": False,
                "message": f"Failed to process audio: {str(e)}"
            }
            
    def _process_sync(self, input_path: str, output_path: str | None) -> dict:
        """Synchronous implementation of processing."""
        temp_wav = None
        try:
            # Pre-convert non-WAV formats to WAV using pydub (requires ffmpeg)
            ext = Path(input_path).suffix.lower()
            if ext != '.wav':
                temp_wav = str(self.temp_dir / f"temp_{Path(input_path).stem}.wav")
                input_path = self._convert_to_wav(input_path, temp_wav)
            
            # Load audio with librosa
            audio, sr = librosa.load(input_path, sr=self.TARGET_SAMPLE_RATE, mono=True)
            
            # Calculate duration
            duration = len(audio) / sr
            
            # Apply basic noise reduction using spectral gating
            audio_denoised = self._reduce_noise(audio, sr)
            
            # Normalize audio
            audio_normalized = librosa.util.normalize(audio_denoised)
            
            # Generate output path if not provided
            if output_path is None:
                input_name = Path(input_path).stem
                output_path = str(self.temp_dir / f"{input_name}_processed.wav")
            
            # Save as WAV
            sf.write(output_path, audio_normalized, sr)
            
            # Validate duration
            is_valid = duration >= self.MIN_DURATION_SECONDS
            if is_valid:
                message = f"Audio processed successfully ({duration:.1f}s)"
            else:
                message = f"Audio too short ({duration:.1f}s). Need at least {self.MIN_DURATION_SECONDS}s for accurate cloning."
            
            return {
                "output_path": output_path,
                "duration_seconds": duration,
                "sample_rate": sr,
                "is_valid": is_valid,
                "message": message
            }
        except Exception as e:
             raise e

    async def get_audio_info(self, audio_path: str) -> dict:
        """Get information about an audio file without processing."""
        try:
            return await asyncio.to_thread(self._get_info_sync, audio_path)
        except Exception as e:
            return {
                "duration_seconds": 0,
                "sample_rate": 0,
                "is_valid": False,
                "message": f"Error: {str(e)}"
            }
    
    def _get_info_sync(self, audio_path: str) -> dict:
        """Synchronous get info."""
        try:
            # Just read metadata if possible, or load fast
            info = sf.info(audio_path)
            duration = info.duration
            sr = info.samplerate
            
            is_valid = duration >= self.MIN_DURATION_SECONDS
            
            return {
                "duration_seconds": duration,
                "sample_rate": sr,
                "is_valid": is_valid,
                "message": "Valid" if is_valid else "Too short"
            }
        except Exception:
             # Fallback to librosa load if sf fails
             y, sr = librosa.load(audio_path, sr=None)
             duration = librosa.get_duration(y=y, sr=sr)
             is_valid = duration >= self.MIN_DURATION_SECONDS
             return {
                "duration_seconds": duration,
                "sample_rate": sr,
                "is_valid": is_valid,
                "message": "Valid" if is_valid else "Too short"
            }
    
    def _reduce_noise(self, audio: np.ndarray, sr: int) -> np.ndarray:
        """Apply simple spectral noise reduction."""
        try:
            # Compute STFT
            stft = librosa.stft(audio)
            
            # Estimate noise from first 0.5 seconds (assuming it contains less speech)
            noise_frames = int(0.5 * sr / 512)  # 512 is default hop length
            noise_frames = min(noise_frames, stft.shape[1] // 4)
            
            if noise_frames > 0:
                # Estimate noise spectrum
                noise_spectrum = np.mean(np.abs(stft[:, :noise_frames]), axis=1, keepdims=True)
                
                # Spectral subtraction
                magnitude = np.abs(stft)
                phase = np.angle(stft)
                
                # Subtract noise floor with some margin
                magnitude_cleaned = np.maximum(magnitude - 1.5 * noise_spectrum, 0.01 * magnitude)
                
                # Reconstruct
                stft_cleaned = magnitude_cleaned * np.exp(1j * phase)
                audio_denoised = librosa.istft(stft_cleaned)
                
                return audio_denoised
            else:
                return audio
                
        except Exception:
            # If noise reduction fails, return original
            return audio
