'use client';

import { memo, useRef, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePipelineStore } from '@/stores/pipeline';
import { cn } from '@/lib/utils';

function ScriptNode() {
    const cardRef = useRef<HTMLDivElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const { scriptText, setScriptText, isProcessing } = usePipelineStore();

    const charCount = scriptText.length;
    const wordCount = scriptText.trim() ? scriptText.trim().split(/\s+/).length : 0;

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
                "w-80 rounded-xl relative",
                "bg-zinc-900",
                "shadow-2xl shadow-black/50"
            )}
            style={{
                border: '1px solid',
                borderColor: isHovered
                    ? 'rgba(59, 130, 246, 0.5)'
                    : 'rgba(63, 63, 70, 1)',
                transition: 'border-color 0.3s ease',
            }}
        >
            {/* Glow overlay */}
            <div
                className="absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-300"
                style={{
                    opacity: isHovered ? 1 : 0,
                    background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(59, 130, 246, 0.1), transparent 40%)`,
                }}
            />

            {/* Header */}
            <div className="px-4 py-3 border-b border-zinc-800 flex items-center gap-2 relative z-10">
                <FileText className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-semibold text-zinc-100">Script</h3>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3 relative z-10">
                <textarea
                    value={scriptText}
                    onChange={(e) => setScriptText(e.target.value)}
                    placeholder="Enter the text you want to speak..."
                    disabled={isProcessing}
                    className={cn(
                        "w-full h-32 px-3 py-2.5 rounded-lg",
                        "bg-zinc-800 border border-zinc-700",
                        "text-sm text-zinc-100 placeholder:text-zinc-500",
                        "focus:outline-none focus:ring-2 focus:ring-blue-500/50",
                        "resize-none",
                        isProcessing && "opacity-50 cursor-not-allowed"
                    )}
                />

                {/* Stats */}
                <div className="flex items-center justify-between text-xs text-zinc-500">
                    <span>{charCount.toLocaleString()} characters</span>
                    <span>{wordCount.toLocaleString()} words</span>
                </div>

                {/* Auto-chunking notice */}
                {charCount > 500 && (
                    <div className="py-2 px-3 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs">
                        Long text will be processed in segments automatically
                    </div>
                )}
            </div>

            {/* Output handle */}
            <Handle
                type="source"
                position={Position.Right}
                className="!w-3 !h-3 !bg-blue-500 !border-2 !border-zinc-900"
            />
        </motion.div>
    );
}

export default memo(ScriptNode);
