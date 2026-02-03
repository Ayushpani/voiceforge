'use client';

import CastSidebar from '@/components/podcast/CastSidebar';
import PodcastStage from '@/components/podcast/PodcastStage';
import ScriptEditor from '@/components/podcast/ScriptEditor';
import { Sidebar } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function PodcastPage() {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="h-screen bg-black flex overflow-hidden font-sans text-zinc-100">
            {/* Sidebar (Cast) */}
            <div
                className={cn(
                    "transition-all duration-300 ease-in-out border-r border-zinc-800",
                    sidebarOpen ? "w-80" : "w-0 overflow-hidden"
                )}
            >
                <CastSidebar />
            </div>

            {/* Main Studio Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="h-14 border-b border-zinc-800 flex items-center px-4 justify-between bg-zinc-900/50 backdrop-blur-sm z-10">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-white transition-colors"
                        >
                            <Sidebar className="w-5 h-5" />
                        </button>
                        <h1 className="text-sm font-bold tracking-wide uppercase text-zinc-400">
                            🎙️ Podcast Studio
                        </h1>
                    </div>

                    <Link
                        href="/"
                        className="text-xs font-medium text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                        Back to Voice Lab
                    </Link>
                </header>

                {/* Content */}
                <main className="flex-1 flex flex-col p-6 gap-6 overflow-hidden">
                    {/* Top: The Stage (Visualizer) */}
                    <div className="h-[40%] min-h-[300px] flex flex-col">
                        <PodcastStage />
                    </div>

                    {/* Bottom: The Script (Editor) */}
                    <div className="flex-1 flex flex-col min-h-0 bg-zinc-900/30 rounded-xl border border-zinc-800/50 overflow-hidden shadow-2xl">
                        <ScriptEditor />
                    </div>
                </main>
            </div>
        </div>
    );
}
