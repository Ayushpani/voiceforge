'use client';

import { useEffect, useState } from 'react';
import { Play, Trash2, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePipelineStore } from '@/stores/pipeline';
import { api, VoiceModel } from '@/lib/api';
import { cn } from '@/lib/utils';

export default function VoiceLibrary() {
    const { voiceModels, loadVoiceModels, setVoiceModel } = usePipelineStore();
    const [playingId, setPlayingId] = useState<string | null>(null);
    const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadVoiceModels().catch((err) => {
            setError('Backend not connected');
            console.log('Voice library unavailable:', err);
        });
    }, [loadVoiceModels]);

    const handlePlay = (model: VoiceModel) => {
        if (playingId === model.id) {
            audioRef?.pause();
            setPlayingId(null);
            return;
        }

        if (audioRef) {
            audioRef.pause();
        }

        const audio = new Audio(api.getPreviewUrl(model.id));
        audio.onended = () => setPlayingId(null);
        audio.play().catch(() => setPlayingId(null));
        setAudioRef(audio);
        setPlayingId(model.id);
    };

    const handleUse = (model: VoiceModel) => {
        setVoiceModel(model.id, model.name);
    };

    const handleDelete = async (model: VoiceModel) => {
        if (confirm(`Delete "${model.name}"? This cannot be undone.`)) {
            await api.deleteVoiceModel(model.id);
            loadVoiceModels();
        }
    };

    return (
        <div className="p-4 space-y-4">
            <div className="px-1">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 transition-colors duration-300">Voice Library</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 transition-colors duration-300">
                    {error ? error : `${voiceModels.length} saved voice${voiceModels.length !== 1 ? 's' : ''}`}
                </p>
            </div>

            {voiceModels.length === 0 && !error ? (
                <div className="py-8 text-center">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 transition-colors duration-300">No saved voices yet</p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 transition-colors duration-300">Clone a voice to see it here</p>
                </div>
            ) : (
                <div className="space-y-2">
                    <AnimatePresence>
                        {voiceModels.map((model) => (
                            <motion.div
                                key={model.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="p-3 bg-zinc-100 dark:bg-zinc-800/50 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-300"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate transition-colors duration-300">
                                            {model.name}
                                        </h4>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 transition-colors duration-300">
                                            {model.duration_seconds.toFixed(0)}s sample
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-1.5 ml-3">
                                        <button
                                            onClick={() => handlePlay(model)}
                                            className={cn(
                                                "p-2 rounded-lg transition-all duration-200",
                                                playingId === model.id
                                                    ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                                                    : "bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
                                            )}
                                        >
                                            {playingId === model.id ? (
                                                <Pause className="w-3.5 h-3.5" />
                                            ) : (
                                                <Play className="w-3.5 h-3.5" />
                                            )}
                                        </button>

                                        <button
                                            onClick={() => handleUse(model)}
                                            className="px-3 py-1.5 text-xs font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors duration-200"
                                        >
                                            Use
                                        </button>

                                        <button
                                            onClick={() => handleDelete(model)}
                                            className="p-2 rounded-lg bg-zinc-200 dark:bg-zinc-700 text-zinc-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
