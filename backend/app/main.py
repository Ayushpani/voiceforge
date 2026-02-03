"""
VoiceForge Backend - FastAPI Application
CPU-based voice cloning with intelligent auto-processing
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
import os

from app.routers import audio, voice, generation, podcast
from app.services.voice_cloner import VoiceClonerService
from app.services.denoiser import DenoiserService
from app.services.podcast_engine import PodcastService

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Ensure directories exist
os.makedirs("voice_models", exist_ok=True)
os.makedirs("uploads", exist_ok=True)
os.makedirs("uploads/outputs", exist_ok=True)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load services at startup, cleanup on shutdown."""
    logger.info("Initializing VoiceForge services...")
    
    logger.info("Loading denoiser service...")
    app.state.denoiser = DenoiserService()
    logger.info("Denoiser loaded successfully")
    
    logger.info("Loading voice cloner service (may take a moment)...")
    app.state.voice_cloner = VoiceClonerService()
    logger.info("Voice cloner loaded successfully")

    logger.info("Loading podcast service...")
    app.state.podcast_service = PodcastService(app.state.voice_cloner)
    logger.info("Podcast service loaded successfully")
    
    yield
    
    logger.info("Shutting down VoiceForge backend...")


app = FastAPI(
    title="VoiceForge API",
    description="CPU-based voice cloning with intelligent auto-processing",
    version="1.0.0",
    lifespan=lifespan
)

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(audio.router, prefix="/api/audio", tags=["Audio"])
app.include_router(voice.router, prefix="/api/voice", tags=["Voice"])
app.include_router(generation.router, prefix="/api/generate", tags=["Generation"])
app.include_router(podcast.router, prefix="/api/podcast", tags=["Podcast"])


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "models_loaded": hasattr(app.state, "voice_cloner") and hasattr(app.state, "denoiser")
    }


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "name": "VoiceForge API",
        "version": "1.0.0",
        "docs": "/docs"
    }
