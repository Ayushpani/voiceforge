import { Terminal, Copy, Check } from "lucide-react";
import Link from "next/link";

export default function InstallationPage() {
    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-4xl font-bold text-white mb-6">Installation</h1>
                <p className="text-xl text-zinc-400 leading-relaxed">
                    Get VoiceForge running on your local machine in minutes.
                </p>
            </div>

            <div>
                <h2 className="text-2xl font-bold text-white mb-6">Prerequisites</h2>
                <ul className="space-y-3 text-zinc-400">
                    <li className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs text-zinc-500">1</div>
                        <span>Python 3.10 or higher</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs text-zinc-500">2</div>
                        <span>Node.js 18+ (for the UI)</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs text-zinc-500">3</div>
                        <span>FFmpeg installed and added to PATH</span>
                    </li>
                </ul>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Step 1: Clone the Repository</h2>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 font-mono text-sm text-zinc-300 overflow-x-auto">
                    <span className="text-zinc-500"># Clone with git</span>
                    <br />
                    <span className="text-teal-500">git</span> clone https://github.com/Ayushpani/voiceforge.git
                    <br />
                    <span className="text-teal-500">cd</span> voiceforge
                </div>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Step 2: Backend Setup (Python)</h2>
                <p className="text-zinc-400">
                    The backend handles all AI inference. It requires a dedicated python environment.
                </p>

                <h3 className="text-lg font-semibold text-white mt-4">1. Create Environment</h3>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 font-mono text-sm text-zinc-300 overflow-x-auto">
                    <span className="text-zinc-500"># Check your python version first (Must be 3.10+)</span>
                    <br />
                    python --version
                    <br /><br />
                    <span className="text-zinc-500"># Create virtual environment</span>
                    <br />
                    python -m venv venv
                </div>

                <h3 className="text-lg font-semibold text-white mt-4">2. Activate & Install</h3>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 font-mono text-sm text-zinc-300 overflow-x-auto">
                    <span className="text-zinc-500"># Windows Activation</span>
                    <br />
                    .\venv\Scripts\activate
                    <br />
                    <span className="text-zinc-500"># (You should see (venv) in your terminal now)</span>
                    <br />
                    <br />
                    <span className="text-zinc-500"># Install dependencies (This may take a few minutes)</span>
                    <br />
                    <span className="text-teal-500">pip</span> install -r requirements.txt
                </div>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Step 3: Frontend Setup (Next.js)</h2>
                <p className="text-zinc-400">
                    The frontend provides the web interface.
                </p>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 font-mono text-sm text-zinc-300 overflow-x-auto">
                    <span className="text-teal-500">cd</span> frontend
                    <br /><br />
                    <span className="text-zinc-500"># Install node modules</span>
                    <br />
                    <span className="text-teal-500">npm</span> install
                </div>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Step 4: Model Access (Important)</h2>
                <p className="text-zinc-400">
                    VoiceForge uses models from Hugging Face that may require acceptance of terms (e.g., Pyannote/SpeechBrain). You need a <a href="https://huggingface.co/settings/tokens" target="_blank" className="text-teal-400 underline">Hugging Face Access Token</a> (Read-only).
                </p>

                <h3 className="text-lg font-semibold text-white mt-4">Authenticate</h3>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 font-mono text-sm text-zinc-300 overflow-x-auto">
                    <span className="text-zinc-500"># In the backend directory:</span>
                    <br />
                    <span className="text-teal-500">python</span> hf_login.py
                    <br />
                    <span className="text-zinc-500"># Paste your token when prompted.</span>
                </div>
                <p className="text-sm text-zinc-500 mt-2">
                    Alternatively, set the <code className="bg-zinc-800 px-1 rounded">HF_TOKEN</code> environment variable.
                </p>
            </div>

            <div className="space-y-6 pt-6 border-t border-zinc-800">
                <h2 className="text-2xl font-bold text-white">Troubleshooting</h2>
                <div className="grid gap-4">
                    <details className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 cursor-pointer group">
                        <summary className="font-semibold text-zinc-200 group-hover:text-white">"Pip install failed on wheels"</summary>
                        <p className="mt-2 text-zinc-400 text-sm">
                            Ensure you have C++ Build Tools installed if you are on Windows. Some audio libraries require compilation.
                        </p>
                    </details>
                    <details className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 cursor-pointer group">
                        <summary className="font-semibold text-zinc-200 group-hover:text-white">"FFmpeg not found"</summary>
                        <p className="mt-2 text-zinc-400 text-sm">
                            Run <code className="bg-zinc-800 px-1 rounded">ffmpeg -version</code> in your terminal. If it fails, download FFmpeg and add the `bin` folder to your System PATH environment variable.
                        </p>
                    </details>
                </div>
            </div>

            <div className="bg-teal-900/10 border border-teal-500/20 rounded-xl p-6">
                <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-teal-500 mt-1" />
                    <div>
                        <h4 className="text-teal-400 font-bold mb-1">That's it!</h4>
                        <p className="text-zinc-400 text-sm">
                            You are now ready to run the application. Head over to the <Link href="/docs/quickstart" className="text-white underline">Quick Start</Link> guide.
                        </p>
                    </div>
                </div>
            </div>

        </div >
    );
}
