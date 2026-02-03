'use client';

import dynamic from 'next/dynamic';
import VoiceLibrary from '@/components/VoiceLibrary';
import ThemeToggle from '@/components/ThemeToggle';

const PipelineEditor = dynamic(() => import('@/components/PipelineEditor'), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center bg-white dark:bg-zinc-950 transition-colors duration-300">
      <div className="text-zinc-500 dark:text-zinc-400">Loading editor...</div>
    </div>
  ),
});

export default function Home() {
  return (
    <main className="h-screen flex flex-col bg-zinc-100 dark:bg-zinc-950 transition-colors duration-300">
      {/* Header */}
      <header className="h-14 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between px-6 transition-colors duration-300">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <span className="text-white font-bold text-sm">V</span>
          </div>
          <div>
            <h1 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 transition-colors duration-300">VoiceForge</h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 transition-colors duration-300">Clone Once, Speak Forever</p>
          </div>
        </div>

        <ThemeToggle />
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-y-auto transition-colors duration-300">
          <VoiceLibrary />
        </aside>

        {/* Canvas */}
        <div className="flex-1">
          <PipelineEditor />
        </div>
      </div>
    </main>
  );
}
