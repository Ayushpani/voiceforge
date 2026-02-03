'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Radio, Play, Pause, RadioTower } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

// --- Animation Components from PodcastStage ---

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
                        height: active ? [4, 24 + Math.random() * 10, 8, 28 - Math.random() * 5, 4] : 4,
                    }}
                    transition={{
                        duration: 0.6,
                        repeat: active ? Infinity : 0,
                        delay: i * 0.05,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </div>
    );
};

const PulsingRing = ({ delay = 0, color }: { delay?: number, color: string }) => (
    <motion.div
        className={cn(
            "absolute inset-0 rounded-full border-2",
            color === "emerald" ? "border-emerald-500/30" : "border-purple-500/30"
        )}
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

const Particles = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 15 }).map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full bg-emerald-500/20"
                    style={{
                        left: `${(i * 7) % 100}%`,
                        width: 2 + (i % 3),
                        height: 2 + (i % 3),
                    }}
                    initial={{ bottom: -10, opacity: 0 }}
                    animate={{ bottom: "110%", opacity: [0, 0.6, 0] }}
                    transition={{
                        duration: 3 + (i % 4),
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: "linear"
                    }}
                />
            ))}
        </div>
    );
};

export default function PodcastPreview() {
    const [activeSpeaker, setActiveSpeaker] = useState<1 | 2>(1);

    // Toggle active speaker loop
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveSpeaker(prev => prev === 1 ? 2 : 1);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    const SpeakerNode = ({ id, name, role, color }: { id: 1 | 2, name: string, role: string, color: "emerald" | "purple" }) => {
        const isActive = activeSpeaker === id;

        return (
            <div className="relative flex flex-col items-center z-10">
                {/* Main Node Circle */}
                <motion.div
                    className={cn(
                        "relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500",
                        "bg-zinc-900 border-2",
                        color === "emerald" ? "border-emerald-500/50" : "border-purple-500/50",
                        isActive && (color === "emerald" ? "shadow-[0_0_60px_rgba(16,185,129,0.3)]" : "shadow-[0_0_60px_rgba(168,85,247,0.3)]")
                    )}
                    animate={{ scale: isActive ? 1.05 : 1 }}
                >
                    {/* Pulsing Rings */}
                    {isActive && (
                        <>
                            <PulsingRing delay={0} color={color} />
                            <PulsingRing delay={0.6} color={color} />
                            <PulsingRing delay={1.2} color={color} />
                        </>
                    )}

                    {/* Inner Gradient BG */}
                    <div className={cn(
                        "absolute inset-2 rounded-full opacity-20 blur-sm",
                        color === "emerald" ? "bg-gradient-to-br from-emerald-500 to-teal-400" : "bg-gradient-to-br from-purple-500 to-pink-400"
                    )} />

                    {/* Avatar Initial */}
                    <div className={cn(
                        "relative w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg",
                        color === "emerald" ? "bg-gradient-to-br from-emerald-500 to-teal-600" : "bg-gradient-to-br from-purple-500 to-pink-600"
                    )}>
                        {name[0].toUpperCase()}
                    </div>

                    {/* Recording Dot */}
                    {isActive && (
                        <motion.div
                            className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full border border-zinc-900 z-20"
                            animate={{ opacity: [1, 0.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                        />
                    )}
                </motion.div>

                {/* Info Text */}
                <div className="mt-4 text-center space-y-1">
                    <SoundWave active={isActive} color={color} />
                    <div className={cn("text-xs font-mono uppercase tracking-wider", color === "emerald" ? "text-emerald-500" : "text-purple-500")}>
                        {role}
                    </div>
                    <div className="text-white font-semibold">{name}</div>
                </div>
            </div>
        );
    };

    return (
        <section className="py-32 bg-zinc-950 relative overflow-hidden">
            <div className="container px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* LEFT: Text Content (Stats Grid) */}
                    <div className="order-2 lg:order-1">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-purple-900/20 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider">
                                <RadioTower className="w-4 h-4" />
                                Multi-Speaker
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                Podcast Studio
                            </h2>
                            <p className="text-xl text-zinc-400 leading-relaxed mb-8">
                                Orchestrate complex conversations. Assign unique voices to speakers and generate full episodes with natural turn-taking.
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: "Format", value: "Screenplay Script" },
                                    { label: "Turn-Taking", value: "Automatic" },
                                    { label: "Export", value: "WAV / MP3 / OGG" },
                                    { label: "Speakers", value: "Unlimited Casting" },
                                ].map((stat, i) => (
                                    <div key={i} className="flex flex-col border-l border-zinc-800 pl-4">
                                        <span className="text-zinc-500 text-xs uppercase tracking-wider mb-1">{stat.label}</span>
                                        <span className="text-zinc-200 font-semibold">{stat.value}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* RIGHT: Visual Replica (The Stage) */}
                    <div className="order-1 lg:order-2 w-full aspect-video bg-zinc-900 relative rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl flex items-center justify-center">

                        {/* Background Grid */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] opacity-50" />

                        {/* Particles */}
                        <Particles />

                        {/* Recording Badge */}
                        <div className="absolute top-6 flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Recording</span>
                        </div>

                        {/* Connector Line */}
                        <div className="absolute w-[60%] h-[1px] bg-zinc-800 top-[40%]">
                            <motion.div
                                className="h-full bg-gradient-to-r from-emerald-500 to-purple-500"
                                animate={{
                                    opacity: [0.2, 1, 0.2],
                                    width: activeSpeaker === 1 ? ["0%", "100%"] : ["100%", "0%"],
                                    marginLeft: activeSpeaker === 1 ? "0%" : "auto"
                                }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                            />
                        </div>

                        {/* Center Hub */}
                        <div className="absolute top-[40%] -translate-y-1/2 z-0">
                            <motion.div
                                className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            >
                                <Radio className="w-4 h-4 text-zinc-500" />
                            </motion.div>
                        </div>

                        {/* Speakers Container */}
                        <div className="flex justify-between w-[80%] z-10 translate-y-[-10px]">
                            <SpeakerNode id={1} name="shreya" role="Speaker 1" color="emerald" />
                            <SpeakerNode id={2} name="ayush" role="Speaker 2" color="purple" />
                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
}
