'use client';

import { motion } from 'framer-motion';
import { ScanFace, FileAudio } from 'lucide-react';

export default function VoiceCloning() {
    return (
        <section className="py-32 bg-zinc-950 relative overflow-hidden">
            <div className="container px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Text Content */}
                    <div className="order-2 lg:order-1">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-teal-900/20 border border-teal-500/20 text-teal-400 text-xs font-semibold uppercase tracking-wider">
                                <ScanFace className="w-4 h-4" />
                                Spectral Capture
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                Instant Voice Cloning
                            </h2>
                            <p className="text-xl text-zinc-400 leading-relaxed mb-8">
                                Drop in a 30-second audio sample. Our scanning engine extracts timbre, cadence, and resonance into a lightweight model file.
                                Zero training time.
                            </p>

                            <div className="flex gap-4">
                                <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 flex-1">
                                    <div className="text-2xl font-bold text-white mb-1">30s</div>
                                    <div className="text-xs text-zinc-500 uppercase">Min Sample</div>
                                </div>
                                <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 flex-1">
                                    <div className="text-2xl font-bold text-white mb-1">Local</div>
                                    <div className="text-xs text-zinc-500 uppercase">Inference</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Animation Visualization: Spectral Scanning */}
                    <div className="order-1 lg:order-2 relative h-[400px] flex items-center justify-center bg-zinc-900/30 rounded-3xl border border-zinc-800 overflow-hidden">

                        {/* Waveform Background */}
                        <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-20">
                            {[...Array(40)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="w-2 rounded-full bg-teal-500"
                                    initial={{ height: "20%" }}
                                    animate={{ height: ["20%", "60%", "20%"] }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        delay: i * 0.05,
                                        ease: "easeInOut"
                                    }}
                                />
                            ))}
                        </div>

                        {/* Scanning Beam */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-b from-transparent via-teal-500/10 to-transparent z-10"
                            initial={{ top: "-100%" }}
                            animate={{ top: "100%" }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        >
                            <div className="absolute bottom-0 w-full h-[1px] bg-teal-500/50 shadow-[0_0_20px_rgba(20,184,166,0.5)]" />
                        </motion.div>

                        {/* Captured "Model" Card */}
                        <motion.div
                            className="relative z-20 w-48 bg-black border border-zinc-700 rounded-xl p-4 shadow-2xl"
                            initial={{ scale: 0.9, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600" />
                                <div>
                                    <div className="h-2 w-20 bg-zinc-700 rounded mb-1" />
                                    <div className="h-2 w-12 bg-zinc-800 rounded" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-1.5 w-full bg-zinc-800 rounded" />
                                <div className="h-1.5 w-full bg-zinc-800 rounded" />
                                <div className="h-1.5 w-3/4 bg-zinc-800 rounded" />
                            </div>

                            {/* Success Badge */}
                            <motion.div
                                className="absolute -top-3 -right-3 w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-black font-bold border-4 border-zinc-950"
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                transition={{ delay: 1, type: "spring" }}
                            >
                                ✓
                            </motion.div>
                        </motion.div>

                    </div>

                </div>
            </div>
        </section>
    );
}
