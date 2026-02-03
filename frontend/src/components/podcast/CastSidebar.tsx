'use client';

import { useEffect, useState } from 'react';
import { api, VoiceModel } from '@/lib/api';
import { Loader2, Mic, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function CastSidebar() {
    const [voices, setVoices] = useState<VoiceModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

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
    };

    const filteredVoices = voices.filter(v =>
        v.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="w-80 h-full border-r border-zinc-800 bg-zinc-900/50 flex flex-col backdrop-blur-xl">
            <div className="p-4 border-b border-zinc-800">
                <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2 mb-3">
                    <Mic className="w-4 h-4 text-emerald-500" />
                    Voice Cast
                </h2>
                <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Search voices..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-zinc-950/50 border border-zinc-700 rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50 transition-colors"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {loading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                    </div>
                ) : (
                    filteredVoices.map(voice => (
                        <div
                            key={voice.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, voice)}
                            className={cn(
                                "group p-3 rounded-lg border border-zinc-800 bg-zinc-900/80 cursor-grab active:cursor-grabbing",
                                "hover:border-emerald-500/30 hover:bg-zinc-800 transition-all",
                                "flex items-center justify-between"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                                    {voice.name[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-medium text-zinc-200 truncate">{voice.name}</h3>
                                    <p className="text-xs text-zinc-500 truncate">{Math.round(voice.duration_seconds)}s sample</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="p-4 border-t border-zinc-800 text-xs text-zinc-500 text-center">
                Drag voices to the stage slots
            </div>
        </div>
    );
}
