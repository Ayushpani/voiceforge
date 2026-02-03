'use client';

import { memo, useRef, useState, useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Mic, Upload, Square, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePipelineStore } from '@/stores/pipeline';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

function VoiceInputNode() {
    const cardRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const {
        uploadedAudioId,
        uploadedAudioValid,
        uploadedAudioMessage,
        setUploadedAudio,
        isProcessing,
        processingNodeId
    } = usePipelineStore();

    const isNodeProcessing = isProcessing && processingNodeId === 'voice-input';

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = cardRef.current?.getBoundingClientRect();
        if (rect) {
            setMousePos({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
        }
    };

    const handleFileSelect = useCallback(async (file: File) => {
        setIsUploading(true);
        try {
            const result = await api.uploadAudio(file);
            setUploadedAudio(result.id, result.is_valid, result.message);
        } catch (error) {
            setUploadedAudio('', false, error instanceof Error ? error.message : 'Upload failed');
        } finally {
            setIsUploading(false);
        }
    }, [setUploadedAudio]);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                const file = new File([blob], 'recording.webm', { type: 'audio/webm' });
                await handleFileSelect(file);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            setRecordingTime(0);

            timerRef.current = setInterval(() => {
                setRecordingTime(t => t + 1);
            }, 1000);
        } catch (error) {
            console.error('Failed to start recording:', error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
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
                isNodeProcessing && "ring-2 ring-blue-500/50"
            )}
            style={{
                border: '1px solid',
                borderColor: isHovered
                    ? 'rgba(59, 130, 246, 0.5)'
                    : 'rgba(63, 63, 70, 1)',
                transition: 'border-color 0.3s ease',
            }}
        >
            {/* Glow overlay */}
            <div
                className="absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-300"
                style={{
                    opacity: isHovered ? 1 : 0,
                    background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(59, 130, 246, 0.1), transparent 40%)`,
                }}
            />

            {/* Header */}
            <div className="px-4 py-3 border-b border-zinc-800 relative z-10">
                <h3 className="text-sm font-semibold text-zinc-100">Voice Sample</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Minimum 30 seconds required</p>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4 relative z-10">
                {/* Recording indicator */}
                {isRecording && (
                    <div className="flex items-center justify-center gap-2 py-3 bg-red-500/10 rounded-lg border border-red-500/30">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-red-400 text-sm font-medium">
                            Recording {formatTime(recordingTime)}
                        </span>
                    </div>
                )}

                {/* Upload progress */}
                {isUploading && (
                    <div className="flex items-center justify-center gap-2 py-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
                        <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                        <span className="text-blue-400 text-sm">Processing audio...</span>
                    </div>
                )}

                {/* Status message */}
                {uploadedAudioId && !isUploading && (
                    <div className={cn(
                        "py-3 px-3 rounded-lg border text-sm",
                        uploadedAudioValid
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                            : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                    )}>
                        {uploadedAudioMessage}
                    </div>
                )}

                {/* Buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={isRecording ? stopRecording : startRecording}
                        disabled={isUploading}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all",
                            isRecording
                                ? "bg-red-500 text-white hover:bg-red-600"
                                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700",
                            isUploading && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        {isRecording ? (
                            <>
                                <Square className="w-4 h-4" />
                                Stop
                            </>
                        ) : (
                            <>
                                <Mic className="w-4 h-4" />
                                Record
                            </>
                        )}
                    </button>

                    <button
                        onClick={handleUploadClick}
                        disabled={isRecording || isUploading}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all",
                            "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700",
                            (isRecording || isUploading) && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        <Upload className="w-4 h-4" />
                        Upload
                    </button>
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>

            {/* Output handle */}
            <Handle
                type="source"
                position={Position.Right}
                className="!w-3 !h-3 !bg-blue-500 !border-2 !border-zinc-900"
            />
        </motion.div>
    );
}

export default memo(VoiceInputNode);
