'use client';

import { usePodcastStore } from '@/stores/podcast';
import { cn } from '@/lib/utils';
import { Play, Download, Loader2, AlertCircle, Sparkles, Volume2, Pause } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Styled script line component
const ScriptLine = ({ line, index }: { line: string; index: number }) => {
    const match = line.match(/^(Speaker \d+):\s*(.*)/);

    if (!match) {
        return <span className="text-zinc-500">{line}</span>;
    }

    const [speaker, text] = [match[1], match[2]];
    const isSpeaker1 = speaker === "Speaker 1";

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group"
        >
            <span className={cn(
                "font-bold",
                isSpeaker1 ? "text-emerald-400" : "text-purple-400"
            )}>
                {speaker}:
            </span>
            <span className="text-zinc-300 ml-2">{text}</span>
        </motion.div>
    );
};

export default function ScriptEditor() {
    const { script, setScript, generatePodcast, isGenerating, audioUrl, cast } = usePodcastStore();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [error, setError] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showPreview, setShowPreview] = useState(false);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [script]);

    // Audio event handlers
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        const handleLoadedMetadata = () => setDuration(audio.duration);
        const handleEnded = () => setIsPlaying(false);

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [audioUrl]);

    const handleGenerate = async () => {
        setError(null);

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

    const togglePlayPause = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const scriptLines = script.split('\n').filter(line => line.trim());

    return (
        <div className="flex-1 flex flex-col min-h-0 bg-gradient-to-b from-zinc-900/50 to-zinc-950/80 backdrop-blur-xl">
            {/* Header */}
            <div className="p-4 border-b border-zinc-800/50 flex items-center justify-between bg-zinc-900/30">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-purple-500/20 rounded-lg">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-zinc-100">Script Screenplay</h2>
                        <p className="text-xs text-zinc-500">{scriptLines.length} lines</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Preview toggle */}
                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                            showPreview
                                ? "bg-zinc-700 text-white"
                                : "bg-zinc-800/50 text-zinc-400 hover:text-white"
                        )}
                    >
                        {showPreview ? "Edit" : "Preview"}
                    </button>

                    {audioUrl && (
                        <a
                            href={audioUrl}
                            download="podcast.wav"
                            className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-white transition-colors"
                        >
                            <Download className="w-4 h-4" />
                        </a>
                    )}

                    <motion.button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className={cn(
                            "px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
                            "bg-gradient-to-r from-emerald-500 to-teal-500 text-white",
                            "hover:from-emerald-400 hover:to-teal-400",
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                            "shadow-lg shadow-emerald-500/20"
                        )}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
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
                    </motion.button>
                </div>
            </div>

            {/* Error Banner */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mx-4 mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 text-red-400 text-sm"
                    >
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Script Area */}
            <div className="flex-1 overflow-y-auto p-6 relative">
                <div className="max-w-3xl mx-auto">
                    {showPreview ? (
                        <div className="space-y-3">
                            {scriptLines.map((line, i) => (
                                <ScriptLine key={i} line={line} index={i} />
                            ))}
                        </div>
                    ) : (
                        <textarea
                            ref={textareaRef}
                            value={script}
                            onChange={(e) => setScript(e.target.value)}
                            placeholder="Speaker 1: Hello, welcome to our podcast!&#10;Speaker 2: Thanks for having me..."
                            className={cn(
                                "w-full bg-transparent resize-none focus:outline-none",
                                "font-mono text-base leading-relaxed text-zinc-300",
                                "placeholder:text-zinc-600",
                                "min-h-[200px]"
                            )}
                            spellCheck={false}
                        />
                    )}
                </div>

                {/* Decorative gradient lines */}
                <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-emerald-500/20 via-purple-500/20 to-transparent" />
            </div>

            {/* Audio Player */}
            <AnimatePresence>
                {audioUrl && !isGenerating && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="p-4 border-t border-zinc-800/50 bg-gradient-to-r from-zinc-900 via-zinc-900/95 to-zinc-900"
                    >
                        <audio ref={audioRef} src={audioUrl} className="hidden" />

                        <div className="flex items-center gap-4">
                            {/* Play/Pause */}
                            <motion.button
                                onClick={togglePlayPause}
                                className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {isPlaying ? (
                                    <Pause className="w-5 h-5 fill-current" />
                                ) : (
                                    <Play className="w-5 h-5 fill-current ml-0.5" />
                                )}
                            </motion.button>

                            {/* Progress bar */}
                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-zinc-500 font-mono w-10">
                                        {formatTime(currentTime)}
                                    </span>
                                    <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                                            style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                                        />
                                    </div>
                                    <span className="text-xs text-zinc-500 font-mono w-10">
                                        {formatTime(duration)}
                                    </span>
                                </div>
                            </div>

                            {/* Volume indicator */}
                            <div className="flex items-center gap-2 text-zinc-500">
                                <Volume2 className="w-4 h-4" />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
