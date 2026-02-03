"""
Text processing service for intelligent auto-chunking.
Handles long text by splitting into natural segments for stable CPU processing.
"""
import re
import logging
from typing import List, Generator

logger = logging.getLogger(__name__)

# Chunking thresholds
MAX_CHARS_PER_CHUNK = 500
OVERLAP_CHARS = 0  # No overlap for TTS


class TextProcessor:
    """
    Intelligent text chunking for TTS generation.
    Splits long text at natural boundaries (sentences, paragraphs).
    """
    
    @staticmethod
    def should_chunk(text: str) -> bool:
        """Determine if text needs chunking."""
        return len(text) > MAX_CHARS_PER_CHUNK
    
    @staticmethod
    def chunk_text(text: str) -> List[str]:
        """
        Split text into natural chunks for TTS processing.
        
        Strategy:
        1. Split by paragraphs if they exist
        2. Then split by sentences
        3. Merge small chunks to reduce API calls
        """
        text = text.strip()
        
        if len(text) <= MAX_CHARS_PER_CHUNK:
            return [text]
        
        # First, split by paragraphs
        paragraphs = re.split(r'\n\s*\n', text)
        
        chunks = []
        for para in paragraphs:
            para = para.strip()
            if not para:
                continue
            
            if len(para) <= MAX_CHARS_PER_CHUNK:
                chunks.append(para)
            else:
                # Split paragraph by sentences
                sentences = TextProcessor._split_sentences(para)
                chunks.extend(TextProcessor._merge_sentences(sentences))
        
        logger.info(f"Split text into {len(chunks)} chunks")
        return chunks
    
    @staticmethod
    def _split_sentences(text: str) -> List[str]:
        """Split text into sentences."""
        # Handle common sentence endings
        sentence_pattern = r'(?<=[.!?])\s+(?=[A-Z])'
        sentences = re.split(sentence_pattern, text)
        return [s.strip() for s in sentences if s.strip()]
    
    @staticmethod
    def _merge_sentences(sentences: List[str]) -> List[str]:
        """Merge small sentences into larger chunks."""
        chunks = []
        current_chunk = ""
        
        for sentence in sentences:
            # If adding this sentence would exceed limit
            if len(current_chunk) + len(sentence) + 1 > MAX_CHARS_PER_CHUNK:
                if current_chunk:
                    chunks.append(current_chunk.strip())
                
                # If single sentence is too long, split it
                if len(sentence) > MAX_CHARS_PER_CHUNK:
                    chunks.extend(TextProcessor._split_long_sentence(sentence))
                    current_chunk = ""
                else:
                    current_chunk = sentence
            else:
                current_chunk = f"{current_chunk} {sentence}".strip()
        
        if current_chunk:
            chunks.append(current_chunk.strip())
        
        return chunks
    
    @staticmethod
    def _split_long_sentence(sentence: str) -> List[str]:
        """Split a very long sentence at natural break points."""
        # Split at commas, semicolons, or conjunctions
        parts = re.split(r'(?<=[,;])\s+|(?<=\band\b)\s+|(?<=\bor\b)\s+', sentence)
        
        chunks = []
        current = ""
        
        for part in parts:
            if len(current) + len(part) + 1 > MAX_CHARS_PER_CHUNK:
                if current:
                    chunks.append(current.strip())
                current = part
            else:
                current = f"{current} {part}".strip()
        
        if current:
            chunks.append(current.strip())
        
        return chunks
    
    @staticmethod
    def stream_chunks(text: str) -> Generator[tuple[int, int, str], None, None]:
        """
        Generator that yields chunks with progress info.
        
        Yields:
            (chunk_index, total_chunks, chunk_text)
        """
        chunks = TextProcessor.chunk_text(text)
        total = len(chunks)
        
        for idx, chunk in enumerate(chunks):
            yield (idx, total, chunk)
    
    @staticmethod
    def estimate_duration(text: str, words_per_minute: int = 150) -> float:
        """Estimate audio duration in seconds."""
        words = len(text.split())
        return (words / words_per_minute) * 60
    
    @staticmethod
    def clean_text(text: str) -> str:
        """Clean text for TTS processing."""
        # Remove excessive whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Remove unsupported characters (keep basic punctuation)
        text = re.sub(r'[^\w\s.,!?;:\'\"-]', '', text)
        
        return text.strip()
