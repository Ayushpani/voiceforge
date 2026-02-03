'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Book, Code, Terminal, Mic, Cpu, Zap, Menu } from 'lucide-react';
import { useState } from 'react';

const links = [
    {
        section: "Getting Started",
        items: [
            { title: "Introduction", href: "/docs", icon: Book },
            { title: "Installation", href: "/docs/installation", icon: Terminal },
            { title: "Quick Start", href: "/docs/quickstart", icon: Zap },
        ]
    },
    {
        section: "Core Concepts",
        items: [
            { title: "Voice Cloning", href: "/docs/voice-cloning", icon: Mic },
            { title: "Podcast Studio", href: "/docs/podcast-studio", icon: Mic },
            { title: "Architecture", href: "/docs/architecture", icon: Cpu },
        ]
    },
    {
        section: "Reference",
        items: [
            { title: "API Reference", href: "/docs/api", icon: Code },
        ]
    }
];

export default function DocsSidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden fixed bottom-6 right-6 z-50 p-4 rounded-full bg-teal-500 text-black shadow-lg"
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Sidebar Container */}
            <div className={cn(
                "fixed inset-y-0 left-0 z-40 w-64 bg-black border-r border-zinc-900 transform transition-transform duration-300 ease-in-out md:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="h-full overflow-y-auto p-6 scrollbar-none">
                    <div className="mb-8">
                        <Link href="/" className="text-xl font-bold text-white flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-teal-500" />
                            VoiceForge
                        </Link>
                        <div className="text-xs text-zinc-500 mt-2 font-mono">v1.0.0 Docs</div>
                    </div>

                    <div className="space-y-8">
                        {links.map((section, i) => (
                            <div key={i}>
                                <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4 px-2">
                                    {section.section}
                                </h3>
                                <div className="space-y-1">
                                    {section.items.map((item, j) => {
                                        const isActive = pathname === item.href;
                                        return (
                                            <Link
                                                key={j}
                                                href={item.href}
                                                onClick={() => setIsOpen(false)}
                                                className={cn(
                                                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all",
                                                    isActive
                                                        ? "bg-teal-500/10 text-teal-400 font-medium"
                                                        : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                                                )}
                                            >
                                                <item.icon className={cn("w-4 h-4", isActive ? "text-teal-500" : "text-zinc-600")} />
                                                {item.title}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
