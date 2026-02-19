"use client"

import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { TextReveal } from "@/components/ui/text-reveal";
import Link from "next/link";
import { portfolioCategories } from "@/data/portfolio";
import { StatsCard } from "./StatsCard";

export function WorkCategories() {
    return (
        <section id="work" className="pt-2 pb-10 px-6 sm:px-10">
            <div className="max-w-7xl mx-auto">
                {/* Stats Card Component (Top of section) */}
                <div className="mb-16 sm:mb-24">
                    <StatsCard />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-8 sm:mb-12"
                >
                    <div className="mb-4">
                        <TextReveal
                            text="My Work"
                            className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight text-foreground justify-center"
                        />
                        <TextReveal
                            text="Select a category to view specific edits."
                            className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed justify-center"
                            delay={0.3}
                            stagger={0.03}
                        />
                    </div>
                </motion.div>

                <div className="flex flex-col gap-4 max-w-5xl mx-auto">
                    {[
                        portfolioCategories.find(c => c.id === "short-form"),
                        portfolioCategories.find(c => c.id === "saas"),
                        portfolioCategories.find(c => c.id === "long-form")
                    ].filter(Boolean).map((category, index) => (
                        <Reveal key={category!.id} delay={0.1 + index * 0.1} y={20} width="100%" overflow="visible">
                            <Link href={`/work/${category!.id}`} className="group block relative">
                                {/* Theme-Adaptive Outer Glow (Robust Blurred Background version) */}
                                <div className="absolute inset-x-10 inset-y-4 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-all duration-700 bg-white/10 dark:bg-white/20 blur-3xl pointer-events-none z-0 scale-125 group-hover:scale-150" />
                                <div className="absolute inset-x-10 inset-y-4 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-all duration-1000 bg-black/5 dark:hidden blur-2xl pointer-events-none z-0 scale-125" />

                                <div className="glass rounded-[2rem] px-6 py-4 sm:px-10 sm:py-6 transition-all duration-500 group-hover:scale-[1.01] group-hover:border-transparent flex flex-col sm:flex-row items-center justify-between gap-4 overflow-hidden relative z-10">
                                    {/* Animated Border Reveal */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                                        <div className="absolute inset-[-100%] aspect-square animate-[border-rotate_6s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_20%,var(--foreground)_50%,transparent_80%)] opacity-30" />
                                        <div className="absolute inset-[1px] glass rounded-[2rem] z-10" />
                                    </div>

                                    {/* Refractive Gleam Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none z-20" />

                                    {/* Text Content (Left) */}
                                    <div className="flex flex-col text-left w-full sm:w-auto">
                                        <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                                            {category!.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm sm:text-base font-medium opacity-80">
                                            {category!.description}
                                        </p>
                                    </div>

                                    {/* Action Button (Right) */}
                                    <div className="flex-shrink-0 ml-auto sm:ml-0 w-full sm:w-auto">
                                        <motion.div
                                            whileTap={{ scale: 0.94 }}
                                            transition={{ type: "spring", stiffness: 500, damping: 20 }}
                                            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 dark:bg-white/5 backdrop-blur-xl border border-white/10 ring-1 ring-white/10 text-foreground text-sm font-semibold group-hover:bg-foreground group-hover:text-background group-hover:ring-0 transition-all duration-300 w-full sm:w-auto shadow-[0_4px_12px_rgba(0,0,0,0.05)] cursor-pointer"
                                        >
                                            <span>View Projects</span>
                                            <ArrowUpRight className="w-4 h-4" />
                                        </motion.div>
                                    </div>
                                </div>
                            </Link>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
