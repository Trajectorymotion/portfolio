"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Star } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false)

    const menuItems = [
        { label: "Work", href: "#work" },
        { label: "About", href: "/#home" },
        { label: "Contact", href: "/socials" },
    ]

    return (
        <>
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                className="fixed top-0 left-0 right-0 z-50 px-4 py-4 sm:px-10 sm:py-6 pointer-events-none"
            >
                {/* MOBILE: Floating Pill Bar */}
                <div
                    className="
                    pointer-events-auto sm:hidden flex items-center justify-between
                    px-4 py-2 rounded-2xl mx-auto max-w-sm relative overflow-hidden
                    bg-white/15 dark:bg-white/1
                    backdrop-blur-[32px] backdrop-saturate-150
                    border border-white/20 dark:border-white/10
                    shadow-[0_8px_30px_rgba(0,0,0,0.15)]
                    ring-1 ring-white/10
                    before:absolute before:inset-0 before:rounded-2xl
                    before:bg-gradient-to-b before:from-white/10 before:to-white/5
                    before:pointer-events-none
                "
                >
                    {/* Mobile Logo */}
                    <div className="flex items-center gap-2 pr-4 relative z-10">
                        <div className="w-9 h-9 rounded-full liquid-icon flex items-center justify-center overflow-hidden border border-foreground/10">
                            <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
                        </div>
                        <span className="font-semibold text-sm text-foreground tracking-tight whitespace-nowrap">
                            Trajectory motion
                        </span>
                    </div>

                    {/* Mobile Menu Trigger & Theme */}
                    <div className="flex items-center gap-1.5 relative z-10">
                        <ThemeToggle />
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="w-10 h-10 rounded-full liquid-icon flex items-center justify-center text-foreground active:scale-95 transition-all"
                        >
                            <Star
                                className={cn(
                                    "w-5 h-5 fill-current transition-transform duration-500",
                                    isOpen && "rotate-180"
                                )}
                            />
                        </button>
                    </div>
                </div>

                {/* DESKTOP: Floating Dock Layout */}
                <div className="hidden sm:flex w-full items-center justify-between relative h-full">
                    {/* Logo Area */}
                    <div className="pointer-events-auto flex items-center gap-2 glass px-5 py-3 rounded-2xl relative z-50">
                        <div className="w-10 h-10 rounded-full liquid-icon flex items-center justify-center overflow-hidden">
                            <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
                        </div>
                        <span className="font-medium text-foreground tracking-tight">
                            Trajectory motion
                        </span>
                    </div>

                    {/* Center Floating Dock */}
                    <div className="pointer-events-auto absolute left-1/2 -translate-x-1/2 z-50">
                        <div className="glass px-3 py-3 rounded-2xl flex items-center gap-1">
                            <div className="w-12 h-12 rounded-full liquid-icon flex items-center justify-center text-foreground">
                                <Star className="w-6 h-6 fill-current" />
                            </div>

                            <div className="flex items-center px-2 gap-1">
                                {menuItems.map((item) => (
                                    <a
                                        key={item.label}
                                        href={item.href}
                                        className="px-4 py-2 rounded-full text-sm font-medium text-foreground/60 hover:text-foreground hover:bg-foreground/10 transition-all duration-300"
                                    >
                                        {item.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right side CTA & Theme */}
                    <div className="pointer-events-auto relative z-50 flex items-center gap-3">
                        <ThemeToggle />
                        <a
                            href="/contact#project-form"
                            className="px-5 py-2.5 bg-foreground text-background rounded-xl text-sm font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                        >
                            Start A Project
                        </a>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-background/20 z-30 backdrop-blur-sm sm:hidden"
                            onClick={() => setIsOpen(false)}
                        />

                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.96 }}
                            transition={{ duration: 0.25 }}
                            className="
                                fixed inset-x-4 top-24 z-40 sm:hidden
                                rounded-2xl px-5 py-5
                                bg-white/15 dark:bg-white/8
                                backdrop-blur-[30px] backdrop-saturate-150
                                border border-white/20 dark:border-white/10
                                shadow-[0_20px_60px_rgba(0,0,0,0.25)]
                                flex flex-col gap-3
                            "
                        >
                            {menuItems.map((item, i) => (
                                <motion.a
                                    key={item.label}
                                    href={item.href}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    onClick={() => setIsOpen(false)}
                                    className="p-3 rounded-xl hover:bg-foreground/5 transition-colors font-medium text-base text-foreground flex justify-between items-center"
                                >
                                    {item.label}
                                    <Star className="w-4 h-4 text-gray-400 opacity-50" />
                                </motion.a>
                            ))}

                            <motion.a
                                href="/contact#project-form"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                onClick={() => setIsOpen(false)}
                                className="mt-1 p-3.5 rounded-xl bg-foreground text-background text-center font-medium shadow-lg text-sm"
                            >
                                Start A Project
                            </motion.a>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}