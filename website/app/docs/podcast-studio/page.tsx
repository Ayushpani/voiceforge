import { Radio, Layers, Download } from "lucide-react";

export default function PodcastStudioDocsPage() {
    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-4xl font-bold text-white mb-6">Podcast Studio</h1>
                <p className="text-xl text-zinc-400 leading-relaxed">
                    Produce full multi-speaker podcast episodes from text scripts.
                </p>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Overview</h2>
                <p className="text-zinc-400">
                    The Podcast Studio allows you to assign different cloned voices to different "roles" (e.g., Host, Guest) and generate a coherent audio conversation. It handles the stitching of audio clips and insertion of natural pauses.
                </p>
            </div>

            <div className="space-y-8">
                <h2 className="text-2xl font-bold text-white">Workflow</h2>

                <div className="relative border-l-2 border-zinc-800 ml-4 pl-8 space-y-12">

                    <div className="relative">
                        <div className="absolute -left-[41px] w-5 h-5 rounded-full bg-zinc-900 border-2 border-purple-500" />
                        <h3 className="text-xl font-bold text-white mb-2">1. Cast Your Speakers</h3>
                        <p className="text-zinc-400 mb-4">
                            Drag and drop voices from your library into the <strong>Speaker 1</strong> and <strong>Speaker 2</strong> slots on the stage.
                        </p>
                        <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800 text-sm text-zinc-500">
                            Tip: Use contrasting voices (e.g., one deep, one higher pitch) for better listener distinction.
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute -left-[41px] w-5 h-5 rounded-full bg-zinc-900 border-2 border-purple-500" />
                        <h3 className="text-xl font-bold text-white mb-2">2. Write the Script</h3>
                        <p className="text-zinc-400 mb-4">
                            Use the script editor at the bottom. The format is similar to a screenplay:
                        </p>
                        <pre className="p-4 bg-zinc-950 rounded-lg border border-zinc-800 text-sm text-zinc-300 font-mono overflow-x-auto">
                            {`Speaker 1: Welcome to the show!
Speaker 2: Thanks for having me.
Speaker 1: Let's talk about AI.`}
                        </pre>
                    </div>

                    <div className="relative">
                        <div className="absolute -left-[41px] w-5 h-5 rounded-full bg-zinc-900 border-2 border-purple-500" />
                        <h3 className="text-xl font-bold text-white mb-2">3. Generate & Export</h3>
                        <p className="text-zinc-400">
                            Click <strong>Generate Episode</strong>. The engine will process each line sequentially. Once complete, you can listen to the preview and download the full mix as a WAV or MP3 file.
                        </p>
                    </div>

                </div>
            </div>

        </div>
    );
}
