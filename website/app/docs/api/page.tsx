export default function ApiReferencePage() {
    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-4xl font-bold text-white mb-6">API Reference</h1>
                <p className="text-xl text-zinc-400 leading-relaxed">
                    Interact with the VoiceForge engine programmatically.
                </p>
            </div>

            <div className="space-y-8">

                {/* Endpoint 1 */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <span className="px-2 py-1 rounded bg-teal-500/20 text-teal-400 font-mono text-xs font-bold">POST</span>
                        <code className="text-zinc-200 font-mono text-lg">/api/v1/clone</code>
                    </div>
                    <p className="text-zinc-400">Create a new voice model from an audio sample.</p>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 font-mono text-sm text-zinc-300">
                        {`{
  "name": "My Voice",
  "files": [binary_audio_data]
}`}
                    </div>
                </div>

                {/* Endpoint 2 */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400 font-mono text-xs font-bold">POST</span>
                        <code className="text-zinc-200 font-mono text-lg">/api/v1/generate</code>
                    </div>
                    <p className="text-zinc-400">Generate speech from text using a specific model.</p>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 font-mono text-sm text-zinc-300">
                        {`{
  "text": "Hello world",
  "voice_id": "voice_123",
  "speed": 1.0
}`}
                    </div>
                </div>

            </div>

        </div>
    );
}
