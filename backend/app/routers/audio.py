"""
Audio upload and processing router.
Handles file upload, format conversion, and denoising.
"""
import os
import uuid
import aiofiles
from fastapi import APIRouter, UploadFile, File, HTTPException, Request
from fastapi.responses import FileResponse

from app.models.schemas import AudioUploadResponse

router = APIRouter()

UPLOADS_DIR = "uploads"
ALLOWED_EXTENSIONS = {".wav", ".mp3", ".m4a", ".webm", ".ogg", ".flac"}


@router.post("/upload", response_model=AudioUploadResponse)
async def upload_audio(request: Request, file: UploadFile = File(...)):
    """
    Upload audio file for voice cloning.
    Automatically converts format, resamples, and denoises.
    Minimum 30 seconds required for accurate cloning.
    """
    # Validate file extension
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    # Generate unique ID
    audio_id = str(uuid.uuid4())[:12]
    
    # Ensure uploads dir exists
    os.makedirs(UPLOADS_DIR, exist_ok=True)
    
    # Save uploaded file
    raw_path = os.path.join(UPLOADS_DIR, f"{audio_id}_raw{ext}")
    processed_path = os.path.join(UPLOADS_DIR, f"{audio_id}.wav")
    
    async with aiofiles.open(raw_path, "wb") as f:
        content = await file.read()
        await f.write(content)
    
    # Process audio (convert, resample, denoise)
    denoiser = request.app.state.denoiser
    result = await denoiser.process_audio(raw_path, processed_path)
    
    # Clean up raw file
    if os.path.exists(raw_path):
        os.remove(raw_path)
    
    return AudioUploadResponse(
        id=audio_id,
        filename=file.filename,
        duration_seconds=result["duration_seconds"],
        sample_rate=result["sample_rate"],
        is_valid=result["is_valid"],
        message=result["message"]
    )


@router.get("/{audio_id}")
async def get_audio(audio_id: str):
    """Stream or download processed audio file."""
    audio_path = os.path.join(UPLOADS_DIR, f"{audio_id}.wav")
    
    if not os.path.exists(audio_path):
        raise HTTPException(status_code=404, detail="Audio not found")
    
    return FileResponse(
        audio_path,
        media_type="audio/wav",
        filename=f"{audio_id}.wav"
    )


@router.get("/{audio_id}/info")
async def get_audio_info(request: Request, audio_id: str):
    """Get information about an uploaded audio file."""
    audio_path = os.path.join(UPLOADS_DIR, f"{audio_id}.wav")
    
    if not os.path.exists(audio_path):
        raise HTTPException(status_code=404, detail="Audio not found")
    
    denoiser = request.app.state.denoiser
    # await the async method
    return await denoiser.get_audio_info(audio_path)


@router.delete("/{audio_id}")
async def delete_audio(audio_id: str):
    """Delete an uploaded audio file."""
    audio_path = os.path.join(UPLOADS_DIR, f"{audio_id}.wav")
    
    if os.path.exists(audio_path):
        os.remove(audio_path)
        return {"deleted": True}
    
    raise HTTPException(status_code=404, detail="Audio not found")
