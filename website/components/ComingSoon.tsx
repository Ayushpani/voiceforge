'use client';

import { motion } from 'framer-motion';
import { Github } from 'lucide-react';

export default function ComingSoon() {
    const loadingFeatures = [
        "Real-time Streaming Generation",
        "Emotion & Style Control",
        "Multi-Language Support (v2)",
        "Voice Marketplace Integration",
        "Mobile App Companion",
    ];

    return (
        <section className="py-32 bg-black border-t border-zinc-900">
            <div className="container px-4 max-w-4xl mx-auto text-center">

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 mb-8">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                    </span>
                    Roadmap Active
                </div>

                <h2 className="text-3xl md:text-5xl font-bold text-white mb-12">
                    Building the future of open voice.
                </h2>

                {/* Loading Bars */}
                <div className="max-w-md mx-auto space-y-6 mb-16">
                    {loadingFeatures.map((feature, i) => (
                        <div key={i} className="space-y-2">
                            <div className="flex justify-between text-sm text-zinc-500">
                                <span>{feature}</span>
                                <span className="text-zinc-700">Loading...</span>
                            </div>
                            <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-zinc-800 to-zinc-700 w-1/2 rounded-full relative"
                                    animate={{ x: ["-100%", "200%"] }}
                                    transition={{
                                        duration: 2 + (i % 2), // Deterministic duration
                                        repeat: Infinity,
                                        ease: "linear",
                                        delay: i * 0.2
                                    }}
                                >
                                    <div className="absolute inset-0 bg-white/5" />
                                </motion.div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm">
                    <p className="text-xl text-zinc-300 mb-6">
                        This is an open source project. We need your help to build these features.
                    </p>
                    <motion.a
                        href="https://github.com/Ayushpani/voiceforge"
                        target="_blank"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-bold hover:bg-zinc-200 transition-colors"
                    >
                        <Github className="w-5 h-5" />
                        Contribute on GitHub
                    </motion.a>
                </div>

            </div>
        </section>
    );
}
