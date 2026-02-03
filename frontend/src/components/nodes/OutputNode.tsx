'use client';

import { memo, useRef, useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Volume2, Play, Pause, Download, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePipelineStore } from '@/stores/pipeline';
import { cn } from '@/lib/utils';

function OutputNode() {
    const cardRef = useRef<HTMLDivElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const {
        voiceModelId,
        uploadedAudioValid,
        scriptText,
        generatedAudioUrl,
        isProcessing,
        processingNodeId,
        progress,
        progressMessage,
        generateSpeech,
    } = usePipelineStore();

    const isNodeProcessing = isProcessing && processingNodeId === 'output';
    const canGenerate = (voiceModelId || uploadedAudioValid) && scriptText.trim().length > 0;

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = cardRef.current?.getBoundingClientRect();
        if (rect) {
            setMousePos({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
        }
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        const handleDurationChange = () => setDuration(audio.duration);
        const handleEnded = () => setIsPlaying(false);

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('durationchange', handleDurationChange);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('durationchange', handleDurationChange);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [generatedAudioUrl]);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.currentTime = parseFloat(e.target.value);
    };

    const handleGenerate = async () => {
        try {
            await generateSpeech();
        } catch (error) {
            console.error('Generation failed:', error);
        }
    };

    const handleDownload = () => {
        if (generatedAudioUrl) {
            const a = document.createElement('a');
            a.href = generatedAudioUrl;
            a.download = 'voiceforge-output.wav';
            a.click();
        }
    };

    const formatTime = (time: number) => {
        if (!isFinite(time)) return '0:00';
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={cn(
                "w-72 rounded-xl relative",
                "bg-zinc-900",
                "shadow-2xl shadow-black/50",
                isNodeProcessing && "ring-2 ring-emerald-500/50"
            )}
            style={{
                border: '1px solid',
                borderColor: isHovered
                    ? 'rgba(16, 185, 129, 0.5)'
                    : 'rgba(63, 63, 70, 1)',
                transition: 'border-color 0.3s ease',
            }}
        >
            {/* Glow overlay - simple radial gradient */}
            <div
                className="absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-300"
                style={{
                    opacity: isHovered ? 1 : 0,
                    background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(16, 185, 129, 0.1), transparent 40%)`,
                }}
            />

            {/* Header */}
            <div className="px-4 py-3 border-b border-zinc-800 flex items-center gap-2 relative z-10">
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-zinc-100">Output</h3>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4 relative z-10">
                {/* Generate button */}
                <button
                    onClick={handleGenerate}
                    disabled={!canGenerate || isProcessing}
                    className={cn(
                        "w-full py-3 rounded-lg text-sm font-semibold transition-all",
                        "bg-gradient-to-r from-emerald-500 to-teal-500 text-white",
                        "hover:from-emerald-400 hover:to-teal-400",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        "shadow-lg shadow-emerald-500/25"
                    )}
                >
                    {isNodeProcessing ? (
                        <span className="flex items-center justify-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Generating...
                        </span>
                    ) : (
                        'Generate Speech'
                    )}
                </button>

                {/* Progress bar */}
                {isNodeProcessing && (
                    <div className="space-y-2">
                        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                        <p className="text-xs text-zinc-400 text-center">{progressMessage}</p>
                    </div>
                )}

                {/* Audio player */}
                {generatedAudioUrl && !isNodeProcessing && (
                    <div className="space-y-3 p-3 bg-zinc-800 rounded-lg">
                        <audio ref={audioRef} src={generatedAudioUrl} />

                        {/* Controls */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={togglePlay}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-emerald-500 text-white hover:bg-emerald-400 transition-colors shadow-md"
                            >
                                {isPlaying ? (
                                    <Pause className="w-4 h-4" />
                                ) : (
                                    <Play className="w-4 h-4 ml-0.5" />
                                )}
                            </button>

                            <div className="flex-1 space-y-1">
                                <input
                                    type="range"
                                    min="0"
                                    max={duration || 100}
                                    value={currentTime}
                                    onChange={handleSeek}
                                    className="w-full h-2 bg-zinc-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-grab"
                                />
                                <div className="flex justify-between text-xs text-zinc-500">
                                    <span>{formatTime(currentTime)}</span>
                                    <span>{formatTime(duration)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Download button */}
                        <button
                            onClick={handleDownload}
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-zinc-700 text-zinc-300 hover:bg-zinc-600 transition-colors text-sm font-medium"
                        >
                            <Download className="w-4 h-4" />
                            Download WAV
                        </button>
                    </div>
                )}

                {/* Empty state */}
                {!generatedAudioUrl && !isNodeProcessing && (
                    <div className="py-4 px-3 text-center text-zinc-400 text-sm bg-zinc-800 rounded-lg">
                        {!canGenerate ? (
                            <span>Connect a voice model and script to generate</span>
                        ) : (
                            <span>Click Generate to create speech</span>
                        )}
                    </div>
                )}
            </div>

            {/* Single input handle */}
            <Handle
                type="target"
                position={Position.Left}
                className="!w-3 !h-3 !bg-emerald-500 !border-2 !border-zinc-900"
            />
        </motion.div>
    );
}

export default memo(OutputNode);
