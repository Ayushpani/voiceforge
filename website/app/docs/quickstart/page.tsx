import Link from "next/link";
import { Play, Pause } from "lucide-react";

export default function QuickStartPage() {
    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-4xl font-bold text-white mb-6">Quick Start</h1>
                <p className="text-xl text-zinc-400 leading-relaxed">
                    Launch the VoiceForge server and UI to generate your first audio.
                </p>
            </div>

            <div className="p-6 rounded-xl border border-yellow-500/20 bg-yellow-500/5">
                <h2 className="text-lg font-bold text-yellow-500 mb-2">First Time Setup?</h2>
                <p className="text-zinc-400 mb-4 text-sm">
                    If you haven't installed the dependencies yet, run these commands first.
                </p>
                <div className="bg-black border border-zinc-800 rounded-lg p-3 font-mono text-xs text-zinc-300 overflow-x-auto">
                    <span className="text-zinc-500"># 1. Setup Backend</span><br />
                    python -m venv venv<br />
                    .\venv\Scripts\activate<br />
                    pip install -r requirements.txt<br />
                    <br />
                    <span className="text-zinc-500"># 2. Setup Frontend</span><br />
                    cd frontend<br />
                    npm install<br />
                    cd ..
                </div>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">1. Start the Backend</h2>
                <p className="text-zinc-400">
                    Open a terminal in the root `voiceforge` directory.
                </p>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 font-mono text-sm text-zinc-300">
                    <span className="text-zinc-500"># Activate environment first!</span><br />
                    .\venv\Scripts\activate
                    <br /><br />
                    <span className="text-teal-500">python</span> main.py
                </div>
                <p className="text-sm text-zinc-500">Server will start at <code className="text-zinc-300 bg-zinc-800 px-1 py-0.5 rounded">http://localhost:8000</code></p>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">2. Start the Frontend</h2>
                <p className="text-zinc-400">
                    Open a NEW terminal, navigate to <code className="text-zinc-300 bg-zinc-800 px-1 py-0.5 rounded">frontend/</code> and run:
                </p>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 font-mono text-sm text-zinc-300">
                    <span className="text-teal-500">npm</span> run dev
                </div>
                <p className="text-sm text-zinc-500">UI will be available at <code className="text-zinc-300 bg-zinc-800 px-1 py-0.5 rounded">http://localhost:3000</code></p>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">3. Verify it works</h2>
                <p className="text-zinc-400">
                    Go to the <strong>Text to Speech</strong> tab in the UI. Type "Hello world" and click <strong>Generate</strong>.
                </p>
            </div>

        </div>
    );
}
