'use client';

import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

export default function ThemeToggle() {
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem('voiceforge-theme') as 'light' | 'dark';
        if (stored) {
            setTheme(stored);
            if (stored === 'light') {
                document.documentElement.classList.remove('dark');
            }
        }
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('voiceforge-theme', theme);
    }, [theme, mounted]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    if (!mounted) {
        return (
            <div className="p-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 w-9 h-9" />
        );
    }

    return (
        <button
            onClick={toggleTheme}
            className={cn(
                "p-2 rounded-lg transition-all duration-300",
                "bg-zinc-200 dark:bg-zinc-800",
                "hover:bg-zinc-300 dark:hover:bg-zinc-700",
                "text-zinc-600 dark:text-zinc-400",
                "border border-zinc-300 dark:border-zinc-700"
            )}
            aria-label="Toggle theme"
        >
            {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
            ) : (
                <Moon className="w-5 h-5" />
            )}
        </button>
    );
}
