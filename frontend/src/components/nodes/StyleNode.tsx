'use client';

import { memo, useRef, useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Sliders } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePipelineStore } from '@/stores/pipeline';
import { cn } from '@/lib/utils';

function StyleNode() {
    const cardRef = useRef<HTMLDivElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const { speed, pitch, setSpeed, setPitch, isProcessing } = usePipelineStore();

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = cardRef.current?.getBoundingClientRect();
        if (rect) {
            setMousePos({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
        }
    };

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={cn(
                "w-64 rounded-xl relative",
                "bg-zinc-900",
                "shadow-2xl shadow-black/50"
            )}
            style={{
                border: '1px solid',
                borderColor: isHovered
                    ? 'rgba(251, 191, 36, 0.5)'
                    : 'rgba(63, 63, 70, 1)',
                transition: 'border-color 0.3s ease',
            }}
        >
            {/* Glow overlay */}
            <div
                className="absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-300"
                style={{
                    opacity: isHovered ? 1 : 0,
                    background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(251, 191, 36, 0.1), transparent 40%)`,
                }}
            />

            {/* Header */}
            <div className="px-4 py-3 border-b border-zinc-800 flex items-center gap-2 relative z-10">
                <Sliders className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-zinc-100">Style</h3>
            </div>

            {/* Content */}
            <div className="p-4 space-y-5 relative z-10">
                {/* Speed slider */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-zinc-300">Speed</label>
                        <span className="text-sm font-mono text-zinc-100 bg-zinc-800 px-2 py-0.5 rounded">{speed.toFixed(1)}x</span>
                    </div>
                    <div className="relative">
                        <input
                            type="range"
                            min="0.5"
                            max="2.0"
                            step="0.1"
                            value={speed}
                            onChange={(e) => setSpeed(parseFloat(e.target.value))}
                            disabled={isProcessing}
                            className={cn(
                                "w-full h-2 rounded-full appearance-none cursor-grab active:cursor-grabbing",
                                "bg-gradient-to-r from-zinc-700 via-amber-500 to-zinc-700",
                                "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5",
                                "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-amber-500",
                                "[&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing",
                                "[&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110",
                                isProcessing && "opacity-50 cursor-not-allowed"
                            )}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-zinc-500 px-1">
                        <span>0.5x</span>
                        <span>1.0x</span>
                        <span>2.0x</span>
                    </div>
                </div>

                {/* Pitch slider */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-zinc-300">Pitch</label>
                        <span className="text-sm font-mono text-zinc-100 bg-zinc-800 px-2 py-0.5 rounded">
                            {pitch > 0 ? '+' : ''}{pitch.toFixed(0)} st
                        </span>
                    </div>
                    <div className="relative">
                        <input
                            type="range"
                            min="-12"
                            max="12"
                            step="1"
                            value={pitch}
                            onChange={(e) => setPitch(parseFloat(e.target.value))}
                            disabled={isProcessing}
                            className={cn(
                                "w-full h-2 rounded-full appearance-none cursor-grab active:cursor-grabbing",
                                "bg-gradient-to-r from-blue-500 via-zinc-600 to-red-500",
                                "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5",
                                "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-amber-500",
                                "[&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing",
                                "[&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110",
                                isProcessing && "opacity-50 cursor-not-allowed"
                            )}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-zinc-500 px-1">
                        <span>-12</span>
                        <span>0</span>
                        <span>+12</span>
                    </div>
                </div>

                <p className="text-xs text-zinc-500 text-center pt-2 border-t border-zinc-800">
                    Applied after generation
                </p>
            </div>

            {/* Single output handle only - no input */}
            <Handle
                type="source"
                position={Position.Right}
                className="!w-3 !h-3 !bg-amber-500 !border-2 !border-zinc-900"
            />
        </motion.div>
    );
}

export default memo(StyleNode);
