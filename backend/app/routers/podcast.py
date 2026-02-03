from fastapi import APIRouter, HTTPException, Request, BackgroundTasks
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Dict
from pathlib import Path
import logging
import traceback

router = APIRouter()
logger = logging.getLogger(__name__)

class PodcastRequest(BaseModel):
    script: str
    speaker_map: Dict[str, str]
    title: str = "New Podcast"

@router.post("/generate")
async def generate_podcast(request: Request, data: PodcastRequest):
    """
    Generate a multi-speaker podcast from script using mapped voice models.
    """
    if not hasattr(request.app.state, "podcast_service"):
        raise HTTPException(status_code=503, detail="Podcast service not initialized")
    
    try:
        service = request.app.state.podcast_service
        result = await service.generate_podcast(
            script=data.script,
            speaker_map=data.speaker_map,
            title=data.title
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except FileNotFoundError as e:
        logger.error(f"Voice model not found: {e}")
        raise HTTPException(status_code=404, detail=f"Voice model not found: {str(e)}")
    except Exception as e:
        logger.error(f"Podcast generation failed: {e}\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Generation error: {str(e)}")

@router.get("/audio/{podcast_id}")
async def get_podcast_audio(request: Request, podcast_id: str):
    """
    Stream/Download the generated podcast audio.
    """
    # Look in the podcast outputs directory
    # Note: Hardcoding path here matching the service... ideally config shared
    file_path = Path("uploads/podcast_outputs") / f"{podcast_id}.wav"
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Podcast audio not found")
        
    return FileResponse(
        path=file_path,
        media_type="audio/wav",
        filename=f"podcast_{podcast_id}.wav"
    )
