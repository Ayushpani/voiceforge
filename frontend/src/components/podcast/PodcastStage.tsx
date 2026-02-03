'use client';

import { usePodcastStore, SpeakerRole } from '@/stores/podcast';
import { cn } from '@/lib/utils';
import { Mic, User, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function PodcastStage() {
    const { cast, setCast, isGenerating } = usePodcastStore();
    const [dragOverRole, setDragOverRole] = useState<SpeakerRole | null>(null);

    const handleDragOver = (e: React.DragEvent, role: SpeakerRole) => {
        e.preventDefault();
        setDragOverRole(role);
    };

    const handleDrop = (e: React.DragEvent, role: SpeakerRole) => {
        e.preventDefault();
        setDragOverRole(null);

        const modelId = e.dataTransfer.getData('modelId');
        const modelName = e.dataTransfer.getData('modelName');

        if (modelId && modelName) {
            setCast(role, modelId, modelName);
        }
    };

    const clearRole = (role: SpeakerRole) => {
        if (!isGenerating) {
            setCast(role, '', '');
        }
    };

    const MicSlot = ({ role }: { role: SpeakerRole }) => {
        const member = cast[role];
        const isFilled = !!member.modelId;
        const isTarget = dragOverRole === role;

        return (
            <div
                className={cn(
                    "relative w-48 h-48 rounded-full flex flex-col items-center justify-center transition-all duration-300",
                    "border-2",
                    isTarget ? "border-emerald-400 bg-emerald-500/10 scale-105" : "border-zinc-700 bg-zinc-800/50",
                    isFilled ? "border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.2)]" : "border-dashed"
                )}
                onDragOver={(e) => handleDragOver(e, role)}
                onDragLeave={() => setDragOverRole(null)}
                onDrop={(e) => handleDrop(e, role)}
            >
                {/* Visual Avatar */}
                <div className={cn(
                    "w-24 h-24 rounded-full flex items-center justify-center mb-3 transition-colors",
                    isFilled ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white" : "bg-zinc-800 text-zinc-600"
                )}>
                    {isFilled ? <User className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
                </div>

                <div className="text-center z-10">
                    <p className="text-xs font-mono text-emerald-500/80 mb-1">{role}</p>
                    <p className={cn("text-sm font-semibold", isFilled ? "text-white" : "text-zinc-500")}>
                        {isFilled ? member.modelName : "Drop Voice Here"}
                    </p>
                </div>

                {/* Remove Button */}
                {isFilled && !isGenerating && (
                    <button
                        onClick={() => clearRole(role)}
                        className="absolute -top-2 -right-2 p-1.5 bg-zinc-900 border border-zinc-700 rounded-full text-zinc-400 hover:text-red-400 transition-colors"
                    >
                        <X className="w-3 h-3" />
                    </button>
                )}

                {/* Recording Animation Ring */}
                {isGenerating && isFilled && (
                    <div className="absolute inset-0 rounded-full border-2 border-emerald-500/50 animate-pulse" />
                )}
            </div>
        );
    };

    return (
        <div className="flex-1 flex items-center justify-center gap-16 py-12 relative overflow-hidden bg-zinc-900/50 rounded-2xl border border-zinc-800">
            {/* Background elements */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:24px_24px]" />

            <MicSlot role="Speaker 1" />
            <div className="h-24 w-[1px] bg-gradient-to-b from-transparent via-zinc-700 to-transparent" />
            <MicSlot role="Speaker 2" />
        </div>
    );
}
