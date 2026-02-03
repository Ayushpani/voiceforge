'use client';

import { usePodcastStore, SpeakerRole } from '@/stores/podcast';
import { cn } from '@/lib/utils';
import { Mic, User, X, Radio } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

// Animated sound wave bars
const SoundWave = ({ active, color = "emerald" }: { active: boolean; color?: string }) => {
    return (
        <div className="flex items-end gap-[2px] h-8">
            {[0, 1, 2, 3, 4, 3, 2, 1, 0].map((delay, i) => (
                <motion.div
                    key={i}
                    className={cn(
                        "w-1 rounded-full",
                        color === "emerald" ? "bg-emerald-500" : "bg-purple-500"
                    )}
                    initial={{ height: 4 }}
                    animate={{
                        height: active ? [4, 16 + delay * 4, 8, 24 - delay * 2, 4] : 4,
                    }}
                    transition={{
                        duration: 0.8,
                        repeat: active ? Infinity : 0,
                        delay: i * 0.05,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </div>
    );
};

// Pulsing ring animation
const PulsingRing = ({ delay = 0 }: { delay?: number }) => (
    <motion.div
        className="absolute inset-0 rounded-full border-2 border-emerald-500/30"
        initial={{ scale: 1, opacity: 0.5 }}
        animate={{ scale: 1.5, opacity: 0 }}
        transition={{
            duration: 2,
            repeat: Infinity,
            delay,
            ease: "easeOut"
        }}
    />
);

// Floating particles
const Particles = () => {
    const particles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 3 + Math.random() * 4,
        size: 2 + Math.random() * 3
    }));

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map(p => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full bg-emerald-500/20"
                    style={{
                        left: `${p.x}%`,
                        width: p.size,
                        height: p.size,
                    }}
                    initial={{ bottom: -10, opacity: 0 }}
                    animate={{ bottom: "110%", opacity: [0, 0.6, 0] }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: "linear"
                    }}
                />
            ))}
        </div>
    );
};

export default function PodcastStage() {
    const { cast, setCast, isGenerating, audioUrl } = usePodcastStore();
    const [dragOverRole, setDragOverRole] = useState<SpeakerRole | null>(null);
    const [activeSpeaker, setActiveSpeaker] = useState<SpeakerRole | null>(null);

    // Simulate alternating speakers during generation
    useEffect(() => {
        if (isGenerating) {
            const interval = setInterval(() => {
                setActiveSpeaker(prev => prev === 'Speaker 1' ? 'Speaker 2' : 'Speaker 1');
            }, 2000);
            return () => clearInterval(interval);
        } else {
            setActiveSpeaker(null);
        }
    }, [isGenerating]);

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

    const MicSlot = ({ role, color }: { role: SpeakerRole; color: "emerald" | "purple" }) => {
        const member = cast[role];
        const isFilled = !!member.modelId;
        const isTarget = dragOverRole === role;
        const isActive = activeSpeaker === role && isGenerating;

        const gradients = {
            emerald: "from-emerald-500 to-teal-600",
            purple: "from-purple-500 to-pink-600"
        };

        const glows = {
            emerald: "shadow-[0_0_60px_rgba(16,185,129,0.4)]",
            purple: "shadow-[0_0_60px_rgba(168,85,247,0.4)]"
        };

        const borders = {
            emerald: "border-emerald-500/50",
            purple: "border-purple-500/50"
        };

        return (
            <motion.div
                layout
                className={cn(
                    "relative w-56 h-56 rounded-full flex flex-col items-center justify-center transition-all duration-300",
                    "border-2",
                    isTarget && "scale-110",
                    isTarget ? "border-white bg-white/10" : "border-zinc-700 bg-zinc-800/50",
                    isFilled && borders[color],
                    isFilled && isActive && glows[color],
                    !isFilled && "border-dashed"
                )}
                animate={{
                    scale: isActive ? [1, 1.02, 1] : 1,
                }}
                transition={{
                    duration: 0.5,
                    repeat: isActive ? Infinity : 0
                }}
                onDragOver={(e) => handleDragOver(e, role)}
                onDragLeave={() => setDragOverRole(null)}
                onDrop={(e) => handleDrop(e, role)}
            >
                {/* Pulsing rings when active */}
                {isActive && isFilled && (
                    <>
                        <PulsingRing delay={0} />
                        <PulsingRing delay={0.5} />
                        <PulsingRing delay={1} />
                    </>
                )}

                {/* Inner glow ring */}
                {isFilled && (
                    <div className={cn(
                        "absolute inset-2 rounded-full opacity-20 blur-sm",
                        `bg-gradient-to-br ${gradients[color]}`
                    )} />
                )}

                {/* Avatar */}
                <motion.div
                    className={cn(
                        "relative w-24 h-24 rounded-full flex items-center justify-center mb-2 z-10",
                        isFilled ? `bg-gradient-to-br ${gradients[color]} text-white` : "bg-zinc-800 text-zinc-600"
                    )}
                    animate={{
                        y: isActive ? [0, -4, 0] : 0,
                    }}
                    transition={{
                        duration: 0.5,
                        repeat: isActive ? Infinity : 0
                    }}
                >
                    {isFilled ? (
                        <span className="text-3xl font-bold">
                            {member.modelName?.[0]?.toUpperCase()}
                        </span>
                    ) : (
                        <Mic className="w-10 h-10" />
                    )}

                    {/* Recording indicator */}
                    {isActive && (
                        <motion.div
                            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-zinc-900"
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                        />
                    )}
                </motion.div>

                {/* Sound wave */}
                <div className="h-8 mb-2">
                    {isFilled && <SoundWave active={isActive} color={color} />}
                </div>

                <div className="text-center z-10">
                    <p className={cn(
                        "text-xs font-mono mb-1",
                        color === "emerald" ? "text-emerald-500/80" : "text-purple-500/80"
                    )}>{role}</p>
                    <p className={cn("text-sm font-semibold", isFilled ? "text-white" : "text-zinc-500")}>
                        {isFilled ? member.modelName : "Drop Voice Here"}
                    </p>
                </div>

                {/* Remove Button */}
                <AnimatePresence>
                    {isFilled && !isGenerating && (
                        <motion.button
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            onClick={() => clearRole(role)}
                            className="absolute -top-2 -right-2 p-2 bg-zinc-900 border border-zinc-700 rounded-full text-zinc-400 hover:text-red-400 hover:border-red-400/50 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </motion.button>
                    )}
                </AnimatePresence>
            </motion.div>
        );
    };

    return (
        <div className="flex-1 flex items-center justify-center gap-16 py-12 relative overflow-hidden bg-gradient-to-b from-zinc-900/80 to-zinc-950 rounded-2xl border border-zinc-800">
            {/* Animated background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />

            {/* Floating particles when generating */}
            {isGenerating && <Particles />}

            {/* Central connector beam */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div
                    className="h-[2px] bg-gradient-to-r from-emerald-500/0 via-emerald-500/50 to-purple-500/0"
                    initial={{ width: 0 }}
                    animate={{ width: isGenerating ? "50%" : "30%" }}
                    transition={{ duration: 1 }}
                />
            </div>

            {/* Recording indicator badge */}
            <AnimatePresence>
                {isGenerating && (
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-full"
                    >
                        <motion.div
                            className="w-2 h-2 bg-red-500 rounded-full"
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                        />
                        <span className="text-xs font-medium text-red-400 uppercase tracking-wider">Recording</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Success indicator */}
            <AnimatePresence>
                {audioUrl && !isGenerating && (
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full"
                    >
                        <Radio className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">Podcast Ready</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <MicSlot role="Speaker 1" color="emerald" />

            {/* Center divider with icon */}
            <div className="relative flex flex-col items-center gap-2">
                <motion.div
                    className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center"
                    animate={{
                        rotate: isGenerating ? 360 : 0,
                        borderColor: isGenerating ? ["#3f3f46", "#10b981", "#a855f7", "#3f3f46"] : "#3f3f46"
                    }}
                    transition={{
                        rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                        borderColor: { duration: 2, repeat: Infinity }
                    }}
                >
                    <Radio className={cn(
                        "w-5 h-5 transition-colors",
                        isGenerating ? "text-emerald-400" : "text-zinc-500"
                    )} />
                </motion.div>
                <div className="h-16 w-[1px] bg-gradient-to-b from-zinc-700 to-transparent" />
            </div>

            <MicSlot role="Speaker 2" color="purple" />
        </div>
    );
}
