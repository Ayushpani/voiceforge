"""
Pydantic models for API requests and responses.
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class AudioUploadResponse(BaseModel):
    """Response after uploading audio."""
    id: str
    filename: str
    duration_seconds: float
    sample_rate: int
    is_valid: bool
    message: str


class VoiceModelCreate(BaseModel):
    """Request to create a voice model from audio."""
    audio_id: str
    name: str = Field(..., min_length=1, max_length=100)
    tags: List[str] = []


class VoiceModel(BaseModel):
    """Voice model metadata."""
    id: str
    name: str
    created_at: datetime
    duration_seconds: float
    tags: List[str]
    preview_url: str


class VoiceModelList(BaseModel):
    """List of voice models."""
    models: List[VoiceModel]
    count: int


class GenerationRequest(BaseModel):
    """Request to generate speech."""
    voice_model_id: Optional[str] = None
    audio_id: Optional[str] = None  # For one-shot cloning without saving
    text: str = Field(..., min_length=1, max_length=50000)
    speed: float = Field(default=1.0, ge=0.5, le=2.0)
    pitch: float = Field(default=0.0, ge=-12.0, le=12.0)
    save_voice: bool = False
    voice_name: Optional[str] = None


class GenerationResponse(BaseModel):
    """Response with generated audio."""
    audio_url: str
    duration_seconds: float
    voice_model_id: Optional[str] = None


class AudioProcessingStatus(BaseModel):
    """Status update during processing."""
    stage: str
    progress: float  # 0-100
    message: str
