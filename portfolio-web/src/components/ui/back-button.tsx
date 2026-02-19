"use client"

import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Reveal } from "./reveal"

interface BackButtonProps {
    className?: string;
}

export function BackButton({ className }: BackButtonProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={className}
        >
            <Link
                href="/"
                className="glass px-6 py-2.5 rounded-xl flex items-center gap-2 text-foreground/90 text-sm font-medium transition-all group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                <span>Back</span>
            </Link>
        </motion.div>
    )
}
