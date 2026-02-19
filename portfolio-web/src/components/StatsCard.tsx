"use client"

import { useRef } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

interface StatsCardProps {
    stats: { views: string; clients: string };
}

function AnimatedNumber({ value, suffix = "", onComplete }: { value: string, suffix?: string, onComplete?: () => void }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const hasCompleted = useRef(false);

    // Parse the number part (e.g., "100" from "100k")
    const numericTarget = parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
    const detectedSuffix = value.replace(/[0-9.]/g, '') || suffix;

    const spring = useSpring(0, { stiffness: 45, damping: 20 });
    const displayValue = useTransform(spring, (latest) => {
        const formatted = numericTarget % 1 === 0
            ? Math.floor(latest).toString()
            : latest.toFixed(1);
        return formatted + detectedSuffix;
    });

    useEffect(() => {
        if (isInView) {
            spring.set(numericTarget);
        }
    }, [isInView, numericTarget, spring]);

    useEffect(() => {
        return spring.on("change", (latest) => {
            if (latest >= numericTarget && !hasCompleted.current) {
                hasCompleted.current = true;
                if (onComplete) onComplete();
            }
        });
    }, [spring, numericTarget, onComplete]);

    return (
        <motion.span ref={ref} className="tabular-nums">
            {displayValue}
        </motion.span>
    );
}

export function StatsCard({ stats }: StatsCardProps) {
    return (
        <div className="flex justify-center w-full mb-6 px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative group w-full max-w-2xl px-8 sm:px-16 py-6 sm:py-10"
            >
                {/* Advanced Liquid Glass Container */}
                <div className="absolute inset-0 rounded-[2.5rem] sm:rounded-[4rem] backdrop-blur-3xl bg-white/5 dark:bg-white/[0.03] border border-white/20 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] saturate-[180%] overflow-hidden">
                    {/* Inner Highlight (Top Edge Refraction) */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

                    {/* Inner Glow (Convex Effect) */}
                    <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent blur-xl pointer-events-none" />

                    {/* Animated Liquid Beam */}
                    <div className="absolute -inset-[100%] aspect-square animate-[border-rotate_15s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_45%,var(--foreground)_50%,transparent_55%)] opacity-[0.05] pointer-events-none" />
                </div>

                <div className="relative z-10 flex flex-nowrap items-center justify-center gap-10 sm:gap-24 h-full">
                    {/* Stat 1: Views */}
                    <div className="flex flex-col items-center text-center">
                        <span className="text-3xl sm:text-6xl font-bold tracking-tight text-foreground flex items-baseline gap-1 drop-shadow-sm">
                            <AnimatedNumber value={stats.views} />
                            <span className="text-xl sm:text-3xl text-foreground font-medium opacity-50">+</span>
                        </span>
                        <div className="flex flex-col items-center mt-1 sm:mt-2">
                            <span className="text-[10px] sm:text-sm font-bold uppercase tracking-[0.2em] text-foreground/50">
                                Views Generated</span>
                            <div className="h-0.5 w-6 bg-foreground/10 rounded-full mt-1.5 hidden sm:block" />
                        </div>
                    </div>

                    {/* Industrial Divider */}
                    <div className="h-16 w-[1px] bg-gradient-to-b from-transparent via-foreground/15 to-transparent" />

                    {/* Stat 2: Clients */}
                    <div className="flex flex-col items-center text-center">
                        <span className="text-3xl sm:text-6xl font-bold tracking-tight text-foreground flex items-baseline gap-1 drop-shadow-sm">
                            <AnimatedNumber value={stats.clients} />
                            <span className="text-xl sm:text-3xl text-foreground font-medium opacity-50">+</span>
                        </span>
                        <div className="flex flex-col items-center mt-1 sm:mt-2">
                            <span className="text-[10px] sm:text-sm font-bold uppercase tracking-[0.2em] text-foreground/50">
                                Clients <span className="hidden sm:inline">Worked With</span>
                            </span>
                            <div className="h-0.5 w-6 bg-foreground/10 rounded-full mt-1.5 hidden sm:block" />
                        </div>
                    </div>
                </div>

                {/* Outer Frosted Glow (Adaptive) */}
                <div className="absolute -inset-4 bg-foreground/5 blur-2xl rounded-[5rem] -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </motion.div >
        </div >
    );
}
