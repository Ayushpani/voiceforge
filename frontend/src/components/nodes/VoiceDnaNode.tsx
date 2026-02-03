'use client';

import { memo, useState, useRef } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Dna, Save, Loader2, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePipelineStore } from '@/stores/pipeline';
import { cn } from '@/lib/utils';
import { DnaSpinner } from '@/components/ui/DnaSpinner';
import { triggerSuccessConfetti, triggerBurstConfetti } from '@/lib/confetti';

function VoiceDnaNode() {
    const cardRef = useRef<HTMLDivElement>(null);
    const [voiceName, setVoiceName] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const {
        uploadedAudioValid,
        uploadedAudioId,
        voiceModelId,
        voiceModelName,
        isProcessing,
        processingNodeId,
        progress,
        progressMessage,
        cloneVoice,
    } = usePipelineStore();

    const isNodeProcessing = isProcessing && processingNodeId === 'voice-dna';
    const canClone = uploadedAudioValid && uploadedAudioId && !voiceModelId;

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = cardRef.current?.getBoundingClientRect();
        if (rect) {
            setMousePos({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
        }
    };

    const handleSave = async (e: React.MouseEvent) => {
        if (!voiceName.trim()) return;

        setIsSaving(true);
        setSaveSuccess(false);

        try {
            await cloneVoice(voiceName);
            setSaveSuccess(true);

            // Trigger burst at mouse position
            triggerBurstConfetti(e.clientX, e.clientY);
            // And general celebration
            setTimeout(() => triggerSuccessConfetti(), 300);

            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error) {
            console.error('Clone failed:', error);
        } finally {
            setIsSaving(false);
        }
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
                isNodeProcessing && "ring-2 ring-purple-500/50"
            )}
            style={{
                border: '1px solid',
                borderColor: isHovered
                    ? 'rgba(168, 85, 247, 0.5)'
                    : 'rgba(63, 63, 70, 1)',
                transition: 'border-color 0.3s ease',
            }}
        >
            {/* Glow overlay */}
            <div
                className="absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-300"
                style={{
                    opacity: isHovered ? 1 : 0,
                    background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(168, 85, 247, 0.1), transparent 40%)`,
                }}
            />

            {/* Header */}
            <div className="px-4 py-3 border-b border-zinc-800 flex items-center gap-2 relative z-10">
                <Dna className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-semibold text-zinc-100">Voice DNA</h3>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4 relative z-10">
                {/* Status */}
                {!uploadedAudioValid && !voiceModelId && (
                    <div className="py-3 px-3 rounded-lg bg-zinc-800 text-zinc-400 text-sm text-center">
                        Waiting for voice sample...
                    </div>
                )}

                {/* Processing */}
                {isNodeProcessing && (
                    <div className="space-y-4 flex flex-col items-center justify-center py-4">
                        <DnaSpinner size={60} />
                        <div className="space-y-2 w-full">
                            <div className="text-center">
                                <span className="text-purple-400 text-sm font-medium animate-pulse">{progressMessage}</span>
                            </div>
                            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden w-full">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Ready to clone */}
                {canClone && !isNodeProcessing && (
                    <div className="space-y-3">
                        <div className="py-3 px-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm text-center">
                            Voice sample ready
                        </div>

                        <input
                            type="text"
                            value={voiceName}
                            onChange={(e) => setVoiceName(e.target.value)}
                            placeholder="Enter voice name..."
                            className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        />

                        <button
                            onClick={handleSave}
                            disabled={!voiceName.trim() || isSaving}
                            className={cn(
                                "w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all",
                                "bg-gradient-to-r from-purple-500 to-blue-500 text-white",
                                "hover:from-purple-400 hover:to-blue-400",
                                "disabled:opacity-50 disabled:cursor-not-allowed",
                                "shadow-lg shadow-purple-500/25"
                            )}
                        >
                            {isSaving ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : saveSuccess ? (
                                <Check className="w-4 h-4" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            {isSaving ? 'Cloning...' : saveSuccess ? 'Saved!' : 'Clone Voice'}
                        </button>
                    </div>
                )}

                {/* Voice model ready */}
                {voiceModelId && !isNodeProcessing && (
                    <div className="space-y-2">
                        <div className="py-3 px-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-emerald-400" />
                                <span className="text-emerald-400 text-sm font-medium">Voice Cloned</span>
                            </div>
                            <p className="text-zinc-500 text-xs mt-1">{voiceModelName}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Handles */}
            <Handle
                type="target"
                position={Position.Left}
                className="!w-3 !h-3 !bg-purple-500 !border-2 !border-zinc-900"
            />
            <Handle
                type="source"
                position={Position.Right}
                className="!w-3 !h-3 !bg-purple-500 !border-2 !border-zinc-900"
            />
        </motion.div>
    );
}

export default memo(VoiceDnaNode);
