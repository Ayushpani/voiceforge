import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DocsPage() {
    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-4xl font-bold text-white mb-6">Introduction</h1>
                <p className="text-xl text-zinc-400 leading-relaxed">
                    VoiceForge is an open-source, local-first audio generation engine.
                    It allows you to clone voices, generate speech, and create multi-speaker podcasts completely offline, running on your CPU.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50">
                    <h3 className="text-lg font-bold text-white mb-2">Privacy First</h3>
                    <p className="text-zinc-400">Your voice data never leaves your machine. All inference and processing happen locally.</p>
                </div>
                <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50">
                    <h3 className="text-lg font-bold text-white mb-2">CPU Optimized</h3>
                    <p className="text-zinc-400">Optimized for consumer hardware. No expensive NVIDIA H100s required.</p>
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold text-white mb-4">Core Features</h2>
                <ul className="space-y-4 text-zinc-400 list-disc pl-6 marker:text-teal-500">
                    <li>
                        <strong className="text-white">Voice Cloning:</strong> Create a digital twin of any voice from a 30-second sample.
                    </li>
                    <li>
                        <strong className="text-white">Text to Speech:</strong> High-fidelity speech generation with controllable emotion and pacing.
                    </li>
                    <li>
                        <strong className="text-white">Podcast Studio:</strong> Script-to-audio engine for generating full conversations between multiple AI speakers.
                    </li>
                </ul>
            </div>

            <div className="pt-8 border-t border-zinc-800">
                <Link
                    href="/docs/installation"
                    className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 font-semibold"
                >
                    Get Started with Installation
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
