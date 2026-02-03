'use client';

import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import {
    Fingerprint,
    Mic2,
    Users,
    Cpu,
    FileAudio,
    Code2,
    LucideIcon
} from 'lucide-react';
import { MouseEvent } from 'react';

const features = [
    {
        icon: Fingerprint,
        title: "Voice Cloning",
        desc: "Clone unique voices from just 30 seconds of audio. Captures nuance, timbre, and cadence."
    },
    {
        icon: Mic2,
        title: "Natural TTS",
        desc: "Generate speech that sounds human. State-of-the-art flow matching model architecture."
    },
    {
        icon: Users,
        title: "Podcast Studio",
        desc: "Create multi-speaker conversations with a screenplay-style script editor."
    },
    {
        icon: Cpu,
        title: "CPU Optimized",
        desc: "Runs 100% locally on CPU. No expensive GPUs required for inference."
    },
    {
        icon: FileAudio,
        title: "Multi-Format",
        desc: "Export to WAV, MP3, FLAC, M4A, OGG, and WebM at 24kHz studio quality."
    },
    {
        icon: Code2,
        title: "Open Source",
        desc: "MIT Licensed. Transparent, privacy-first, and community driven. Built with Python & Next.js."
    }
];

function FeatureCard({ feature, index }: { feature: { icon: LucideIcon, title: string, desc: string }, index: number }) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group relative border border-zinc-800 bg-zinc-900 rounded-2xl px-6 py-8 hover:border-zinc-700/50 transition-colors"
            onMouseMove={handleMouseMove}
        >
            {/* Spotlight Gradient */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(20,184,166,0.15),
              transparent 80%
            )
          `,
                }}
            />
            <div>
                <div className="mb-6 inline-flex rounded-lg bg-zinc-800 p-3 ring-1 ring-white/10">
                    <feature.icon className="h-6 w-6 text-zinc-400 group-hover:text-teal-400 transition-colors" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">{feature.title}</h3>
                <p className="text-zinc-400 leading-relaxed text-sm">{feature.desc}</p>
            </div>
        </motion.div>
    );
}

export default function FeatureGrid() {
    return (
        <section className="py-32 bg-black">
            <div className="container px-4 max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Everything you need.
                    </h2>
                    <p className="text-zinc-400">
                        A complete suite for local audio generation.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, i) => (
                        <FeatureCard key={i} feature={feature} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}
