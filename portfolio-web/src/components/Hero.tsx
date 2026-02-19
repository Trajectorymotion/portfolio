"use client"

import { motion } from "framer-motion"
import { ArrowDown } from "lucide-react"
import { Reveal } from "@/components/ui/reveal"
import { TextReveal } from "@/components/ui/text-reveal"

function Meteor({ index }: { index: number }) {
    return (
        <motion.div
            initial={{ x: "120%", y: "-120%", opacity: 0 }}
            animate={{
                x: "-120%",
                y: "120%",
                opacity: [0, 0.6, 0.6, 0]
            }}
            transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: index * 6 + Math.random() * 5,
                ease: "linear"
            }}
            className="absolute h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent rotate-[-45deg]"
            style={{
                width: `${100 + Math.random() * 100}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`
            }}
        />
    )
}

export function Hero() {
    return (
        <section id="home" className="min-h-screen flex flex-col items-center justify-center relative px-6 text-center pt-28 sm:pt-36 pb-8">
            {/* Background blobs */}
            <div className="absolute top-[20%] left-[10%] w-72 h-72 bg-blue-500/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen filter animate-float opacity-30 dark:opacity-70" />
            <div className="absolute top-[20%] right-[10%] w-72 h-72 bg-purple-500/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen filter animate-float opacity-30 dark:opacity-70" style={{ animationDelay: "2s" }} />
            <div className="absolute bottom-[20%] left-[30%] w-72 h-72 bg-pink-500/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen filter animate-float opacity-30 dark:opacity-70" style={{ animationDelay: "4s" }} />

            <Reveal delay={0.2} y={30}>
                <div className="max-w-7xl mx-auto w-full px-4 sm:px-10">
                    <div className="glass-premium rounded-3xl sm:rounded-[3rem] p-6 sm:p-12 relative overflow-hidden transition-all duration-500 shadow-none dark:shadow-2xl">
                        {/* Background Meteor Effect (Subtle) */}
                        <div className="absolute inset-0 pointer-events-none">
                            {[...Array(5)].map((_, i) => (
                                <Meteor key={i} index={i} />
                            ))}
                        </div>

                        {/* Centered Intro Stack: Large Avatar ➔ Text ➔ Button */}
                        <div className="relative z-10 flex flex-col items-center text-center gap-8 mb-8">
                            {/* Large Borderless Avatar (Center Top) */}
                            <div className="w-72 h-72 sm:w-96 sm:h-96 relative">
                                <img
                                    src="/avatar_new.png"
                                    alt="RJ"
                                    className="w-full h-full object-cover"
                                    style={{
                                        maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
                                        WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)'
                                    }}
                                />
                            </div>

                            {/* Single-Line Glowing Intro Cluster */}
                            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-2">
                                <h2 className="text-sm sm:text-base font-bold text-foreground tracking-tight">
                                    Hey, I'm RJ
                                </h2>
                                <span className="h-4 w-[1px] bg-foreground/20 hidden sm:block" />
                                <p className="text-xs sm:text-sm text-foreground/60 font-medium font-serif italic tracking-wide">
                                    Motion Designer | Video editor
                                </p>
                            </div>

                            {/* Hyper-Realistic Frosted Liquid Glass Button (Static) */}
                            <div className="relative">
                                <a
                                    href="#work"
                                    className="group relative overflow-hidden px-5 py-2 glass rounded-2xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2.5 hover:scale-[1.05] active:scale-95 shadow-xl"
                                >
                                    <span className="relative z-10 tracking-wide text-foreground">Explore My Work</span>
                                    <ArrowDown className="relative z-10 w-3.5 h-3.5 rotate-[270deg] text-foreground group-hover:translate-x-1 transition-transform" />
                                </a>
                            </div>
                        </div>

                        {/* Main Description Area (Centered & Expanded Width) */}
                        <div className="text-center relative z-10 max-w-5xl mx-auto">
                            <div className="mb-6">
                                <TextReveal
                                    text="Crafting visual [masterpieces] with premium edits and motion"
                                    className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-6 leading-[1.1]"
                                    delay={0.4}
                                />
                            </div>

                            <div className="max-w-5xl mx-auto">
                                <TextReveal
                                    text="Transforming raw footage into [viral-ready] content. I help creators and brands make content that stands out in the crowd and takes off."
                                    className="text-sm sm:text-base text-foreground/70 font-medium leading-relaxed"
                                    delay={0.6}
                                    stagger={0.01}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Reveal>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 1 }}
                className="mt-6"
            >
                <ArrowDown className="w-6 h-6 text-gray-500 animate-bounce" />
            </motion.div>
        </section>
    )
}
