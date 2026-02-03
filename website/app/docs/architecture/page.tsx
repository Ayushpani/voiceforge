import { Cpu, Layers, Database, Code, Share2, Workflow } from "lucide-react";

export default function ArchitecturePage() {
    return (
        <div className="space-y-16">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold text-white mb-6">System Architecture</h1>
                <p className="text-xl text-zinc-400 leading-relaxed max-w-3xl">
                    VoiceForge is designed as a <span className="text-teal-400">modular monolith</span>.
                    While it runs as a unified local application, the internal components are strictly decoupled
                    to allow for future splitting into microservices (e.g., separating inference from the API).
                </p>
            </div>

            {/* High Level Diagram */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Workflow className="w-6 h-6 text-purple-500" />
                    High-Level Data Flow
                </h2>
                <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-950 overflow-x-auto shadow-2xl">
                    <pre className="font-mono text-sm leading-6 text-zinc-300">
                        {`
                  [ USER BROWSER ]
                         |
                    (HTTP/JSON)
                         |
           +-------------v-------------+
           |       API GATEWAY         |  <-- FastAPI (main.py)
           |    (Request Validation)   |
           +-------------+-------------+
                         |
        +----------------+----------------+
        |                                 |
+-------v-------+                 +-------v-------+
|  SERVICE:     |                 |  SERVICE:     |
|  Voice Cloning|                 |  TTS Engine   |
+-------+-------+                 +-------+-------+
        |                                 |
  (Speaker Encoder)                (Flow Matching)
        |                                 |
        v                                 v
+-------------------------------------------------+
|               ML INFERENCE MODEL                |  <-- PyTorch / OnnxRunTime
|         (Optimized for CPU execution)           |
+-------------------------------------------------+
`}
                    </pre>
                </div>
            </div>

            {/* Components Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/20">
                            <Layers className="w-6 h-6 text-teal-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-white">Frontend Layer</h3>
                    </div>
                    <p className="text-zinc-400 leading-relaxed">
                        The UI is built with <strong>Next.js 14 (App Router)</strong> and <strong>React Server Components</strong>.
                    </p>
                    <ul className="space-y-4">
                        <li className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                            <strong className="text-white block mb-1">State Management</strong>
                            <span className="text-zinc-400 text-sm">Zustand is used for global client state (e.g., the active podcast cast, audio player status).</span>
                        </li>
                        <li className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                            <strong className="text-white block mb-1">Audio Visualization</strong>
                            <span className="text-zinc-400 text-sm">Real-time waveforms are rendered using the Web Audio API and bespoke Canvas/Framer Motion animations.</span>
                        </li>
                        <li className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                            <strong className="text-white block mb-1">Styling</strong>
                            <span className="text-zinc-400 text-sm">Tailwind CSS v4 with a custom design system centered around "Zinc" dark mode aesthetics.</span>
                        </li>
                    </ul>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                            <Cpu className="w-6 h-6 text-purple-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-white">Inference Engine</h3>
                    </div>
                    <p className="text-zinc-400 leading-relaxed">
                        The core intelligence runs on <strong>Python 3.10+</strong> and <strong>PyTorch</strong>.
                    </p>
                    <ul className="space-y-4">
                        <li className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                            <strong className="text-white block mb-1">F5-TTS Architecture</strong>
                            <span className="text-zinc-400 text-sm">We utilize a Flow Matching transformer model that treats speech generation as an iterative denoising process.</span>
                        </li>
                        <li className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                            <strong className="text-white block mb-1">Vocoder</strong>
                            <span className="text-zinc-400 text-sm">BigVGAN is used to convert the generated mel-spectrograms into high-fidelity audible waveforms.</span>
                        </li>
                        <li className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                            <strong className="text-white block mb-1">CPU Optimization</strong>
                            <span className="text-zinc-400 text-sm">Models are quantized and optimized to run reasonably fast on standard consumer CPUs, avoiding hard dependencies on CUDA.</span>
                        </li>
                    </ul>
                </div>

            </div>

            {/* Directory Structure */}
            <div className="space-y-6 pt-12 border-t border-zinc-800">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Code className="w-6 h-6 text-blue-500" />
                    Codebase Structure
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 font-mono text-sm">
                        <div className="text-zinc-500 mb-2">/backend (Root)</div>
                        <ul className="space-y-2 text-zinc-300">
                            <li><span className="text-blue-400">src/</span></li>
                            <li className="pl-4">├── <span className="text-yellow-400">api/</span> <span className="text-zinc-600"># FastAPI Routes</span></li>
                            <li className="pl-4">├── <span className="text-yellow-400">core/</span> <span className="text-zinc-600"># Config & Security</span></li>
                            <li className="pl-4">├── <span className="text-yellow-400">services/</span> <span className="text-zinc-600"># Business Logic</span></li>
                            <li className="pl-4">└── <span className="text-yellow-400">ml/</span> <span className="text-zinc-600"># Model Definitions</span></li>
                        </ul>
                    </div>
                    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 font-mono text-sm">
                        <div className="text-zinc-500 mb-2">/frontend</div>
                        <ul className="space-y-2 text-zinc-300">
                            <li><span className="text-blue-400">app/</span></li>
                            <li className="pl-4">├── <span className="text-yellow-400">docs/</span> <span className="text-zinc-600"># Documentation Logic</span></li>
                            <li className="pl-4">└── <span className="text-yellow-400">page.tsx</span> <span className="text-zinc-600"># Landing Page</span></li>
                            <li><span className="text-blue-400">components/</span> <span className="text-zinc-600"># Reusable UI</span></li>
                            <li><span className="text-blue-400">lib/</span> <span className="text-zinc-600"># Utilities</span></li>
                        </ul>
                    </div>
                </div>
            </div>

        </div>
    );
}
