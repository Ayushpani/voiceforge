'use client';

import { motion } from 'framer-motion';
import { Type, ArrowRight, Volume2 } from 'lucide-react';

export default function TextToSpeech() {
    return (
        <section className="py-32 bg-black relative overflow-hidden">
            <div className="container px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Animation Visualization: Stream Flow */}
                    <div className="relative h-[400px] bg-zinc-900/20 rounded-3xl border border-zinc-800/50 backdrop-blur-sm flex flex-col items-center justify-center p-8 overflow-hidden group">

                        {/* Background Stream Lines */}
                        <div className="absolute inset-0 opacity-10">
                            {[...Array(5)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute h-[1px] bg-teal-500 w-full"
                                    style={{ top: `${20 + i * 15}%` }}
                                    animate={{ x: ["-100%", "100%"] }}
                                    transition={{ duration: 3 - i * 0.2, repeat: Infinity, ease: "linear" }}
                                />
                            ))}
                        </div>

                        <div className="flex items-center gap-8 w-full max-w-lg relative z-10">

                            {/* Input: Text */}
                            <div className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl p-4 shadow-lg">
                                <div className="flex items-center gap-2 mb-3 text-zinc-500">
                                    <Type className="w-4 h-4" />
                                    <span className="text-xs font-mono">INPUT</span>
                                </div>
                                <div className="space-y-2">
                                    <motion.div
                                        className="h-2 bg-zinc-600 rounded w-full"
                                        animate={{ width: ["0%", "100%"] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                    <motion.div
                                        className="h-2 bg-zinc-600 rounded w-3/4"
                                        animate={{ width: ["0%", "75%"] }}
                                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                    />
                                </div>
                            </div>

                            {/* Arrow */}
                            <ArrowRight className="w-6 h-6 text-zinc-600" />

                            {/* Output: Audio */}
                            <div className="flex-1 bg-zinc-900 border border-teal-500/30 rounded-xl p-4 shadow-lg shadow-teal-500/10">
                                <div className="flex items-center gap-2 mb-3 text-teal-500">
                                    <Volume2 className="w-4 h-4" />
                                    <span className="text-xs font-mono">OUTPUT</span>
                                </div>
                                {/* Live Waveform */}
                                <div className="flex items-end gap-1 h-8">
                                    {[...Array(12)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            className="flex-1 bg-teal-500 rounded-full"
                                            animate={{ height: ["20%", "100%", "20%"] }}
                                            transition={{
                                                duration: 0.6,
                                                repeat: Infinity,
                                                delay: i * 0.05,
                                                ease: "easeInOut"
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>

                        </div>

                    </div>

                    {/* Text Content */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                Latency? Non-existent.
                            </h2>
                            <p className="text-xl text-zinc-400 leading-relaxed mb-8">
                                Our streaming architecture generates audio chunks in real-time.
                                Experience <span className="text-teal-400 font-semibold">sub-200ms latency</span> on standard consumer hardware.
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: "Architecture", value: "Flow Matching" },
                                    { label: "Sample Rate", value: "24kHz / 48kHz" },
                                    { label: "Language", value: "English Only" },
                                    { label: "License", value: "MIT Open Source" },
                                ].map((stat, i) => (
                                    <div key={i} className="flex flex-col border-l border-zinc-800 pl-4">
                                        <span className="text-zinc-500 text-xs uppercase tracking-wider mb-1">{stat.label}</span>
                                        <span className="text-zinc-200 font-semibold">{stat.value}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
