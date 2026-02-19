"use client"

import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import { Sun, Moon } from "lucide-react"
import { useEffect, useState } from "react"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return (
        <div className="w-10 h-10 rounded-full bg-foreground/5 border border-foreground/10" />
    )

    const isDark = theme === "dark"

    const handleToggle = () => {
        setIsAnimating(true)
        setTheme(isDark ? "light" : "dark")
        setTimeout(() => setIsAnimating(false), 400)
    }

    return (
        <div className="relative">
            <motion.button
                onClick={handleToggle}
                className="relative w-9 h-9 rounded-full liquid-icon flex items-center justify-center overflow-hidden border-none"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Toggle theme"
            >
                {/* Refractive Gleam */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none z-10" />

                {/* Background Monochrome Fluid Fill */}
                <motion.div
                    className={`absolute inset-0 ${isDark ? 'bg-white/10' : 'bg-black/5'}`}
                    initial={false}
                    animate={{
                        scale: isAnimating ? [1, 1.2, 1] : 1,
                    }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                />

                {/* Theme Icons (Custom SVG) - Monochrome */}
                <AnimatePresence mode="wait" initial={false}>
                    {isDark ? (
                        <motion.div
                            key="moon"
                            className="relative z-20"
                            initial={{ y: 15, opacity: 0, scale: 0.5, rotate: -20 }}
                            animate={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
                            exit={{ y: -15, opacity: 0, scale: 0.5, rotate: 20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                            <img src="/icons/moon.svg" alt="Moon" className="w-[18px] h-[18px] invert" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="sun"
                            className="relative z-20"
                            initial={{ y: 15, opacity: 0, scale: 0.5, rotate: 20 }}
                            animate={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
                            exit={{ y: -15, opacity: 0, scale: 0.5, rotate: -20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                            <img src="/icons/sun.svg" alt="Sun" className="w-[18px] h-[18px] opacity-80" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Tactile Grayscale Highlight Ripple */}
                {isAnimating && (
                    <motion.div
                        className="absolute inset-0 bg-white/20 rounded-full z-30"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 2, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    />
                )}
            </motion.button>
        </div>
    )
}
