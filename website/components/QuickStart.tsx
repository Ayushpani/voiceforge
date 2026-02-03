'use client';

import { motion } from 'framer-motion';
import { Terminal, Copy, Check } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function QuickStart() {
    const [copied, setCopied] = useState(false);
    const [step, setStep] = useState(0);

    useEffect(() => {
        // Simulate typing progression
        const interval = setInterval(() => {
            setStep((prev) => (prev < 3 ? prev + 1 : prev));
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    const copyCommand = () => {
        navigator.clipboard.writeText("git clone https://github.com/Ayushpani/voiceforge.git\ncd voiceforge\nnpm run dev");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section className="py-32 bg-zinc-950">
            <div className="container px-4 max-w-4xl mx-auto">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Start cloning in seconds.
                    </h2>
                    <p className="text-zinc-400">
                        Get up and running with a few simple commands.
                    </p>
                </div>

                <div className="relative rounded-xl overflow-hidden bg-[#1e1e1e] border border-zinc-800 shadow-2xl">
                    {/* Terminal Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-[#2d2d2d] border-b border-black/20">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/80" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                            <div className="w-3 h-3 rounded-full bg-green-500/80" />
                        </div>
                        <div className="text-xs text-zinc-500 font-mono">bash — 80x24</div>
                        <button
                            onClick={copyCommand}
                            className="text-zinc-500 hover:text-white transition-colors"
                        >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                    </div>

                    {/* Terminal Body */}
                    <div className="p-6 font-mono text-sm min-h-[300px] text-zinc-300">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                        >
                            {/* Step 1 */}
                            <div className="flex gap-2 mb-2">
                                <span className="text-teal-500">$</span>
                                <span className="typing-effect">git clone https://github.com/Ayushpani/voiceforge.git</span>
                            </div>
                            <div className={`mb-4 text-zinc-500 ${step >= 1 ? 'block' : 'hidden'}`}>
                                Cloning into 'voiceforge'...<br />
                                remote: Enumerating objects: 142, done.<br />
                                remote: Total 142 (delta 59), reused 102 (delta 24)<br />
                                Receiving objects: 100% (142/142), 2.45 MiB | 4.20 MiB/s, done.
                            </div>

                            {/* Step 2 */}
                            <div className={`flex gap-2 mb-2 ${step >= 1 ? 'flex' : 'hidden'}`}>
                                <span className="text-teal-500">$</span>
                                <span className="typing-effect">cd voiceforge</span>
                            </div>

                            {/* Step 3 */}
                            <div className={`flex gap-2 mb-2 ${step >= 2 ? 'flex' : 'hidden'}`}>
                                <span className="text-teal-500">$</span>
                                <span className="typing-effect">npm run install && npm run dev</span>
                            </div>
                            <div className={`text-zinc-500 ${step >= 3 ? 'block' : 'hidden'}`}>
                                ready - started server on 0.0.0.0:3000, url: http://localhost:3000<br />
                                info  - Loaded env from .env.local
                            </div>

                            {/* Blinking Cursor */}
                            <motion.div
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ duration: 0.8, repeat: Infinity }}
                                className="w-2 h-4 bg-teal-500 inline-block align-middle ml-1"
                            />
                        </motion.div>
                    </div>
                </div>

            </div>
        </section>
    );
}
