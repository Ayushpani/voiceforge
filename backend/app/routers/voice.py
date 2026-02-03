"""
Voice model management router.
Handles voice cloning, model storage, and library management.
"""
import os
import traceback
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import FileResponse

from app.models.schemas import VoiceModelCreate, VoiceModel, VoiceModelList

router = APIRouter()

UPLOADS_DIR = "uploads"


@router.post("/clone", response_model=VoiceModel)
async def clone_voice(request: Request, data: VoiceModelCreate):
    """
    Create a voice model from processed audio.
    Extracts voice embedding and saves to library.
    """
    try:
        # Verify audio exists
        audio_path = os.path.join(UPLOADS_DIR, f"{data.audio_id}.wav")
        if not os.path.exists(audio_path):
            raise HTTPException(status_code=404, detail="Audio not found. Upload audio first.")
        
        # Get audio info for duration
        denoiser = request.app.state.denoiser
        # Use await for async method
        print(f"Calling get_audio_info for {audio_path}")
        audio_info = await denoiser.get_audio_info(audio_path)
        print(f"Audio info: {audio_info}")
        
        if not audio_info.get("is_valid", False):
            raise HTTPException(
                status_code=400,
                detail="Audio must be at least 30 seconds for accurate voice cloning"
            )
        
        # Create voice model using voice cloner
        voice_cloner = request.app.state.voice_cloner
        print("Calling save_voice_model")
        metadata = await voice_cloner.save_voice_model(
            audio_path=audio_path,
            name=data.name,
            tags=data.tags
        )
        print("Model saved")
        
        return VoiceModel(
            id=metadata["id"],
            name=metadata["name"],
            created_at=metadata["created_at"],
            duration_seconds=metadata["duration_seconds"],
            tags=metadata.get("tags", []),
            preview_url=f"/api/voice/models/{metadata['id']}/preview"
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in clone_voice: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Clone failed: {str(e)}")


@router.get("/models", response_model=VoiceModelList)
async def list_voice_models(request: Request):
    """List all saved voice models."""
    try:
        voice_cloner = request.app.state.voice_cloner
        # Use await if needed (currently synchronous but good to be careful)
        # voice_cloner.list_voice_models is sync, so no await needed
        models = voice_cloner.list_voice_models()
        
        return VoiceModelList(
            models=[
                VoiceModel(
                    id=m["id"],
                    name=m["name"],
                    created_at=m["created_at"],
                    duration_seconds=m["duration_seconds"],
                    tags=m.get("tags", []),
                    preview_url=f"/api/voice/models/{m['id']}/preview"
                )
                for m in models
            ],
            count=len(models)
        )
    except Exception as e:
        print(f"Error in list_models: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/models/{model_id}")
async def get_voice_model(request: Request, model_id: str):
    """Get details of a specific voice model."""
    voice_cloner = request.app.state.voice_cloner
    
    metadata = voice_cloner.get_voice_model(model_id)
    if not metadata:
        raise HTTPException(status_code=404, detail="Voice model not found")
    
    return VoiceModel(
        id=metadata["id"],
        name=metadata["name"],
        created_at=metadata["created_at"],
        duration_seconds=metadata["duration_seconds"],
        tags=metadata.get("tags", []),
        preview_url=f"/api/voice/models/{model_id}/preview"
    )


@router.get("/models/{model_id}/preview")
async def get_voice_preview(request: Request, model_id: str):
    """Stream preview audio for a voice model."""
    voice_cloner = request.app.state.voice_cloner
    preview_path = voice_cloner.get_preview_path(model_id)
    
    if not preview_path:
        raise HTTPException(status_code=404, detail="Preview not found")
    
    return FileResponse(
        preview_path,
        media_type="audio/wav",
        filename=f"{model_id}_preview.wav"
    )


@router.delete("/models/{model_id}")
async def delete_voice_model(request: Request, model_id: str):
    """Delete a voice model."""
    voice_cloner = request.app.state.voice_cloner
    
    if voice_cloner.delete_voice_model(model_id):
        return {"deleted": True}
    
    raise HTTPException(status_code=404, detail="Voice model not found")
