'use client';

import { usePodcastStore } from '@/stores/podcast';
import { cn } from '@/lib/utils';
import { Play, Download, Loader2, AlertCircle } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

export default function ScriptEditor() {
    const { script, setScript, generatePodcast, isGenerating, audioUrl, cast } = usePodcastStore();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [error, setError] = useState<string | null>(null);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [script]);

    const handleGenerate = async () => {
        setError(null);

        // Pre-validation with clear message
        if (!cast['Speaker 1'].modelId || !cast['Speaker 2'].modelId) {
            setError("Please drag and drop voices to both Speaker 1 and Speaker 2 slots first!");
            return;
        }

        try {
            await generatePodcast();
        } catch (err: any) {
            setError(err.message || "Generation failed");
        }
    };

    return (
        <div className="flex-1 flex flex-col min-h-0 bg-zinc-900/50 border-l border-zinc-800 backdrop-blur-xl">
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-zinc-100">Script Screenplay</h2>

                <div className="flex items-center gap-2">
                    {audioUrl && (
                        <a
                            href={audioUrl}
                            download="podcast.wav"
                            className="p-2 hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-white transition-colors"
                        >
                            <Download className="w-4 h-4" />
                        </a>
                    )}

                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2",
                            "bg-emerald-500 text-white hover:bg-emerald-400",
                            "disabled:opacity-50 disabled:cursor-not-allowed"
                        )}
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Recording...
                            </>
                        ) : (
                            <>
                                <Play className="w-4 h-4 fill-current" />
                                Generate
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="mx-4 mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                </div>
            )}

            <div className="flex-1 overflow-y-auto p-6 relative">
                <div className="max-w-3xl mx-auto space-y-6">
                    <textarea
                        ref={textareaRef}
                        value={script}
                        onChange={(e) => setScript(e.target.value)}
                        placeholder="Speaker 1: Hello world..."
                        className={cn(
                            "w-full bg-transparent resize-none focus:outline-none",
                            "font-mono text-base leading-relaxed text-zinc-300",
                            "placeholder:text-zinc-700"
                        )}
                        spellCheck={false}
                    />
                </div>
            </div>

            {audioUrl && !isGenerating && (
                <div className="p-4 border-t border-zinc-800 bg-zinc-900">
                    <audio src={audioUrl} controls className="w-full h-10 accent-emerald-500" />
                </div>
            )}
        </div>
    );
}
