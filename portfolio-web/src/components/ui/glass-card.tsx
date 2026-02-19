"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface GlassCardProps {
    children: React.ReactNode
    className?: string
    noHover?: boolean
    onClick?: () => void
}

export function GlassCard({ children, className, noHover = false, onClick }: GlassCardProps) {
    return (
        <motion.div
            onClick={onClick}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={cn(
                "glass rounded-3xl p-6 sm:p-8 relative overflow-hidden transition-all duration-500",
                !noHover && "hover:scale-[1.01] hover:border-foreground/30",
                className
            )}
        >
            {/* Glossy reflection effect */}
            {/* Premium fluid reflection effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            {children}
        </motion.div>
    )
}
