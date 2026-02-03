'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DnaSpinnerProps {
    className?: string;
    size?: number;
    color1?: string;
    color2?: string;
}

export function DnaSpinner({
    className,
    size = 40,
    color1 = '#a855f7', // purple-500
    color2 = '#3b82f6'  // blue-500
}: DnaSpinnerProps) {
    // Generate dots for the helix
    const dots = Array.from({ length: 12 });

    return (
        <div
            className={cn("relative flex items-center justify-center", className)}
            style={{ width: size, height: size }}
        >
            {dots.map((_, i) => {
                const delay = i * 0.15;
                const angle = (i / dots.length) * Math.PI * 2;

                return (
                    <div
                        key={i}
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ transform: `rotate(${angle}rad)` }}
                    >
                        {/* Strand 1 */}
                        <motion.div
                            className="absolute w-1.5 h-1.5 rounded-full"
                            style={{
                                backgroundColor: color1,
                                top: 0
                            }}
                            animate={{
                                y: [0, size / 2, 0],
                                scale: [1, 0.5, 1],
                                opacity: [1, 0.5, 1]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: delay
                            }}
                        />

                        {/* Strand 2 */}
                        <motion.div
                            className="absolute w-1.5 h-1.5 rounded-full"
                            style={{
                                backgroundColor: color2,
                                bottom: 0
                            }}
                            animate={{
                                y: [0, -size / 2, 0],
                                scale: [1, 0.5, 1],
                                opacity: [1, 0.5, 1]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: delay
                            }}
                        />
                    </div>
                );
            })}
        </div>
    );
}
