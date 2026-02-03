'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Github } from 'lucide-react';
import { cn } from '@/lib/utils';

// Abstract Waveform Animation
const HeroWaveform = () => {
    return (
        <div className="absolute inset-x-0 bottom-0 h-96 opacity-20 pointer-events-none">
            <div className="flex items-end justify-center h-full gap-1 px-4">
                {[...Array(60)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="w-2 rounded-t-full bg-teal-500"
                        animate={{
                            height: ["10%", "60%", "30%", "80%", "20%", "70%", "10%"],
                        }}
                        transition={{
                            duration: 2 + (i % 3) * 0.5, // Deterministic duration based on index
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.05,
                        }}
                        style={{
                            opacity: Math.max(0.2, 1 - Math.abs(i - 30) / 30), // Fade edges
                        }}
                    />
                ))}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>
    );
};

export default function Hero() {
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-teal-900/20 blur-[120px] rounded-full pointer-events-none" />

            <HeroWaveform />

            <div className="container relative z-10 px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-4xl mx-auto"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full bg-white/5 border border-white/10 text-sm text-zinc-400"
                    >
                        <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                        v1.0 is now Open Source
                    </motion.div>

                    <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-white mb-6">
                        Clone Any Voice. <br />
                        <span className="text-zinc-500">Speak Any Words.</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        A privacy-first, CPU-optimized voice cloning engine. <br />
                        Run it locally. No GPU required. No limits.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <motion.a
                            href="/docs"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 rounded-full bg-white text-black font-semibold text-lg flex items-center gap-2 hover:bg-zinc-200 transition-colors"
                        >
                            Get Started
                            <ArrowRight className="w-5 h-5" />
                        </motion.a>

                        <motion.a
                            href="https://github.com/Ayushpani/voiceforge"
                            target="_blank"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 rounded-full bg-zinc-900 border border-zinc-800 text-white font-semibold text-lg flex items-center gap-2 hover:bg-zinc-800 transition-colors"
                        >
                            <Github className="w-5 h-5" />
                            Star on GitHub
                        </motion.a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
