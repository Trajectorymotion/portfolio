"use client"

import { motion } from "framer-motion";
import Link from "next/link";

export function DifferenceCard() {
    return (
        <div className="flex justify-center px-6 mt-24 mb-12">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-50 max-w-[550px] w-full rounded-[3.5rem] pt-4 px-10 pb-10 sm:pt-6 sm:px-12 sm:pb-12 flex flex-col items-center glass-premium shadow-[0_20px_60px_rgba(255,255,255,0.7)] dark:shadow-[0_30px_100px_rgba(0,0,0,0.8)] border-white/40 dark:border-white/10 transition-all duration-500 hover:scale-[1.01]"
            >
                {/* Visual Background Glow (Added for extra visibility) */}
                <div className="absolute -inset-2 bg-gradient-to-br from-white/10 to-transparent blur-3xl rounded-[4rem] pointer-events-none -z-10 opacity-70" />

                {/* Asset (Larger with bottom fade) */}
                <div className="w-full flex justify-center mb-0 relative group/img -mt-10 sm:-mt-12">
                    <img
                        src="/logo.png"
                        alt="Profile"
                        className="w-80 h-80 sm:w-[26rem] sm:h-[26rem] object-contain dark:drop-shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition-transform duration-700 hover:scale-105 [mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)]"
                    />
                    {/* Light Mode Bottom Blend - Soft White Blur */}
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent dark:hidden pointer-events-none" />
                </div>

                {/* Heading (Slightly adjusted for larger image) */}
                <div className="mb-2 w-full text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-1">
                        What makes me
                    </h2>
                    <h2 className="text-3xl sm:text-4xl font-serif italic text-foreground/90">
                        different?
                    </h2>
                </div>

                {/* Browse Button */}
                <div className="w-full flex justify-center mb-10">
                    <a href="#work">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2.5 px-7 py-3 rounded-xl liquid-icon group cursor-pointer shadow-xl"
                        >
                            <span className="text-foreground font-semibold text-sm z-10">Browse My Work</span>
                            <svg
                                className="w-4 h-4 text-foreground transition-transform group-hover:translate-x-1 z-10"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        </motion.div>
                    </a>
                </div>

                {/* Description Text */}
                <p className="text-foreground/70 text-sm sm:text-base leading-relaxed font-medium text-center max-w-[90%] mx-auto">
                    What sets me apart? A focus on <span className="text-foreground/90 font-bold underline decoration-white/20 underline-offset-4">premium quality</span>, <span className="text-foreground/90 font-bold underline decoration-white/20 underline-offset-4">attention-grabbing motion</span>, and a deep understanding of <span className="text-foreground/90 font-bold underline decoration-white/20 underline-offset-4">what makes content go viral</span>. I blend style with strategy to deliver results that are ahead of the trend.
                </p>
            </motion.div>
        </div>
    );
}
