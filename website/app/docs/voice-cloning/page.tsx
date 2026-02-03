import { Mic, CheckCircle, AlertTriangle } from "lucide-react";

export default function VoiceCloningPage() {
    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-4xl font-bold text-white mb-6">Voice Cloning</h1>
                <p className="text-xl text-zinc-400 leading-relaxed">
                    Create a high-fidelity digital twin of any voice from just a short audio sample.
                </p>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">How it works</h2>
                <p className="text-zinc-400">
                    VoiceForge uses a zero-shot voice cloning technique. It extracts a "speaker embedding" (a 192-dimensional vector) from your reference audio and conditions the text-to-speech model on this vector.
                </p>
                <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                    <p className="text-sm text-zinc-300 font-mono">
                        Audio Sample (WAV/MP3) &rarr; [Speaker Encoder] &rarr; Speaker Embedding &rarr; [TTS Engine] &rarr; Cloned Speech
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Creating a Voice</h2>
                <ol className="list-decimal pl-6 space-y-4 text-zinc-400">
                    <li>Navigate to the <strong>Voice Lab</strong> tab.</li>
                    <li>Click <strong>New Voice</strong>.</li>
                    <li>Upload an audio file (details below) or record directly.</li>
                    <li>Name your voice and click <strong>Clone Voice</strong>.</li>
                </ol>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                        Best Practices
                    </h3>
                    <ul className="space-y-2 text-zinc-400 text-sm">
                        <li>• Use high-quality audio (no background noise).</li>
                        <li>• A 30-60 second sample is usually sufficient.</li>
                        <li>• Ensure the speaker is speaking clearly and naturally.</li>
                        <li>• Mono WAV files at 22050Hz or 24000Hz are ideal.</li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                        Avoid
                    </h3>
                    <ul className="space-y-2 text-zinc-400 text-sm">
                        <li>• Audio with music or heavy reverb.</li>
                        <li>• Multiple speakers in the same clip.</li>
                        <li>• Extremely short clips (under 5 seconds).</li>
                        <li>• Overly processed audio (heavy compression).</li>
                    </ul>
                </div>
            </div>

        </div>
    );
}
