'use client';

import { useEffect, useState } from 'react';
import { api, VoiceModel } from '@/lib/api';
import { Loader2, Mic, Search, GripVertical, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Animated waveform for voice cards
const MiniWaveform = () => (
    <div className="flex items-end gap-[1px] h-4">
        {[3, 5, 8, 6, 4, 7, 5, 3].map((h, i) => (
            <motion.div
                key={i}
                className="w-[2px] bg-emerald-500/60 rounded-full"
                initial={{ height: 2 }}
                animate={{ height: [2, h, 2] }}
                transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: "easeInOut"
                }}
            />
        ))}
    </div>
);

export default function CastSidebar() {
    const [voices, setVoices] = useState<VoiceModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [draggingId, setDraggingId] = useState<string | null>(null);

    useEffect(() => {
        loadVoices();
    }, []);

    const loadVoices = async () => {
        try {
            const models = await api.listVoiceModels();
            setVoices(models);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDragStart = (e: React.DragEvent, voice: VoiceModel) => {
        e.dataTransfer.setData('modelId', voice.id);
        e.dataTransfer.setData('modelName', voice.name);
        e.dataTransfer.effectAllowed = 'copy';
        setDraggingId(voice.id);
    };

    const handleDragEnd = () => {
        setDraggingId(null);
    };

    const filteredVoices = voices.filter(v =>
        v.name.toLowerCase().includes(search.toLowerCase())
    );

    // Generate consistent gradient based on name
    const getGradient = (name: string) => {
        const gradients = [
            "from-emerald-500 to-teal-600",
            "from-purple-500 to-pink-600",
            "from-blue-500 to-cyan-600",
            "from-orange-500 to-red-600",
            "from-indigo-500 to-purple-600",
            "from-rose-500 to-orange-500",
        ];
        const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return gradients[hash % gradients.length];
    };

    return (
        <div className="w-80 h-full border-r border-zinc-800/50 bg-gradient-to-b from-zinc-900/80 to-zinc-950 flex flex-col backdrop-blur-xl">
            {/* Header */}
            <div className="p-4 border-b border-zinc-800/50">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-lg">
                        <Mic className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-zinc-100">Voice Cast</h2>
                        <p className="text-xs text-zinc-500">{voices.length} voices available</p>
                    </div>
                </div>

                <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Search voices..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className={cn(
                            "w-full bg-zinc-950/50 border border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-zinc-200",
                            "focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10",
                            "placeholder:text-zinc-600 transition-all"
                        )}
                    />
                </div>
            </div>

            {/* Voice List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-3">
                        <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                        <p className="text-xs text-zinc-500">Loading voices...</p>
                    </div>
                ) : filteredVoices.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-3">
                        <Sparkles className="w-8 h-8 text-zinc-600" />
                        <p className="text-sm text-zinc-500">No voices found</p>
                        <p className="text-xs text-zinc-600">Clone a voice from the Voice Lab</p>
                    </div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {filteredVoices.map((voice, index) => (
                            <motion.div
                                key={voice.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.03 }}
                                draggable
                                onDragStart={(e) => handleDragStart(e as any, voice)}
                                onDragEnd={handleDragEnd}
                                className={cn(
                                    "group p-3 rounded-xl border cursor-grab active:cursor-grabbing",
                                    "transition-all duration-200",
                                    draggingId === voice.id
                                        ? "border-emerald-500/50 bg-emerald-500/10 scale-105 shadow-lg shadow-emerald-500/20"
                                        : "border-zinc-800/50 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-800/50"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    {/* Drag handle */}
                                    <div className="text-zinc-600 group-hover:text-zinc-400 transition-colors">
                                        <GripVertical className="w-4 h-4" />
                                    </div>

                                    {/* Avatar */}
                                    <div className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg",
                                        `bg-gradient-to-br ${getGradient(voice.name)}`
                                    )}>
                                        {voice.name[0].toUpperCase()}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-semibold text-zinc-200 truncate group-hover:text-white transition-colors">
                                            {voice.name}
                                        </h3>
                                        <p className="text-xs text-zinc-500 truncate">
                                            {Math.round(voice.duration_seconds)}s sample
                                        </p>
                                    </div>

                                    {/* Waveform indicator */}
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <MiniWaveform />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>

            {/* Footer */}
            <motion.div
                className="p-4 border-t border-zinc-800/50 bg-zinc-950/50"
                initial={false}
            >
                <div className="flex items-center justify-center gap-2 text-xs text-zinc-500">
                    <GripVertical className="w-3 h-3" />
                    <span>Drag voices to the stage</span>
                </div>
            </motion.div>
        </div>
    );
}
