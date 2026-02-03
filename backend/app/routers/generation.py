"""
Speech generation router.
Handles text-to-speech with cloned voices.
"""
import os
import asyncio
import json
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import FileResponse
from pydantic import BaseModel
from sse_starlette.sse import EventSourceResponse

router = APIRouter()


class GenerateRequest(BaseModel):
    """Request model for speech generation."""
    text: str
    voice_model_id: str | None = None
    audio_id: str | None = None
    speed: float = 1.0
    pitch: float = 0.0


class GenerateResponse(BaseModel):
    """Response model for speech generation."""
    output_id: str
    output_path: str
    duration_seconds: float
    audio_url: str


@router.post("/", response_model=GenerateResponse)
async def generate_speech(request: Request, data: GenerateRequest):
    """
    Generate speech from text using a cloned voice.
    
    If neither voice_model_id nor audio_id is provided, uses a default voice.
    """
    # if not data.voice_model_id and not data.audio_id:
    #     raise HTTPException(
    #         status_code=400,
    #         detail="Either voice_model_id or audio_id must be provided"
    #     )
    
    if not data.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    # Get audio path if using audio_id
    audio_path = None
    if data.audio_id:
        audio_path = os.path.join("uploads", f"{data.audio_id}.wav")
        if not os.path.exists(audio_path):
            raise HTTPException(status_code=404, detail="Audio not found")
    
    # Generate speech
    voice_cloner = request.app.state.voice_cloner
    result = await voice_cloner.generate_speech(
        text=data.text,
        voice_model_id=data.voice_model_id,
        audio_path=audio_path,
        speed=data.speed,
        pitch=data.pitch
    )
    
    return GenerateResponse(
        output_id=result["output_id"],
        output_path=result["output_path"],
        duration_seconds=result["duration_seconds"],
        audio_url=f"/api/generate/{result['output_id']}"
    )


@router.post("/stream")
async def generate_speech_stream(request: Request, data: GenerateRequest):
    """
    Generate speech with Server-Sent Events for progress updates.
    """
    if not data.voice_model_id and not data.audio_id:
        raise HTTPException(
            status_code=400,
            detail="Either voice_model_id or audio_id must be provided"
        )
    
    if not data.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    async def event_generator():
        try:
            # Send start event
            yield {
                "data": json.dumps({
                    "stage": "starting",
                    "progress": 0,
                    "message": "Starting generation..."
                })
            }
            await asyncio.sleep(0.1)
            
            # Get audio path if using audio_id
            audio_path = None
            if data.audio_id:
                audio_path = os.path.join("uploads", f"{data.audio_id}.wav")
                if not os.path.exists(audio_path):
                    yield {
                        "data": json.dumps({
                            "stage": "error",
                            "progress": 0,
                            "message": "Audio not found"
                        })
                    }
                    return
            
            # Progress: loading voice
            yield {
                "data": json.dumps({
                    "stage": "loading",
                    "progress": 20,
                    "message": "Loading voice model..."
                })
            }
            await asyncio.sleep(0.1)
            
            # Progress: generating
            yield {
                "data": json.dumps({
                    "stage": "generating",
                    "progress": 50,
                    "message": "Generating speech..."
                })
            }
            
            # Generate speech
            voice_cloner = request.app.state.voice_cloner
            result = await voice_cloner.generate_speech(
                text=data.text,
                voice_model_id=data.voice_model_id,
                audio_path=audio_path,
                speed=data.speed,
                pitch=data.pitch
            )
            
            # Progress: complete
            yield {
                "data": json.dumps({
                    "stage": "complete",
                    "progress": 100,
                    "message": "Generation complete!",
                    "audio_url": f"/api/generate/{result['output_id']}",
                    "duration_seconds": result["duration_seconds"]
                })
            }
            
        except Exception as e:
            yield {
                "data": json.dumps({
                    "stage": "error",
                    "progress": 0,
                    "message": str(e)
                })
            }
    
    return EventSourceResponse(event_generator())


@router.get("/{output_id}")
async def download_generated_audio(output_id: str):
    """Download generated audio file."""
    output_path = os.path.join("uploads", "outputs", f"{output_id}.wav")
    
    if not os.path.exists(output_path):
        raise HTTPException(status_code=404, detail="Generated audio not found")
    
    return FileResponse(
        output_path,
        media_type="audio/wav",
        filename=f"voiceforge_{output_id}.wav"
    )
