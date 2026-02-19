"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { useEffect } from "react"

interface VideoModalProps {
    isOpen: boolean
    onClose: () => void
    videoUrl: string
    title: string
    forceLandscape?: boolean
}

export function VideoModal({ isOpen, onClose, videoUrl, title, forceLandscape = false }: VideoModalProps) {
    // Get YouTube ID from various formats
    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/
        const match = url.match(regExp)
        return (match && match[2].length === 11) ? match[2] : null
    }

    const videoId = getYouTubeId(videoUrl)
    const isShort = !forceLandscape && videoUrl.includes("shorts")

    // Close on escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }
        window.addEventListener("keydown", handleEsc)
        return () => window.removeEventListener("keydown", handleEsc)
    }, [onClose])

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-hidden"
                >
                    {/* Backdrop Overlay */}
                    <div
                        onClick={onClose}
                        className="absolute inset-0 bg-background/80 backdrop-blur-md cursor-pointer"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{
                            type: "spring",
                            damping: 25,
                            stiffness: 200,
                            mass: 0.8
                        }}
                        className="relative w-full flex flex-col items-center pointer-events-none z-10"
                        style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}
                    >
                        {/* Floating Header Glass Card */}
                        <div className="glass rounded-full px-6 py-3 flex items-center gap-4 mb-6 pointer-events-auto max-w-[90%]">
                            <h3 className="text-foreground font-medium truncate max-w-[200px] sm:max-w-md">{title}</h3>
                            <div className="w-px h-4 bg-foreground/20 mx-1" />
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-full bg-foreground/5 hover:bg-foreground/20 flex items-center justify-center text-foreground transition-all duration-300 hover:scale-110 active:scale-95"
                                aria-label="Close modal"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Video Frame */}
                        <div
                            className={`relative w-full ${isShort ? 'max-w-[400px]' : 'max-w-5xl'} bg-background rounded-3xl overflow-hidden shadow-2xl border border-foreground/10 pointer-events-auto`}
                        >
                            <div className={`relative w-full ${isShort ? 'aspect-[9/16]' : 'aspect-video'} bg-background`}>
                                {videoId ? (
                                    <iframe
                                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&showinfo=0`}
                                        className="absolute inset-0 w-full h-full border-0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        title={title}
                                    />
                                ) : (
                                    <div className="absolute inset-0 w-full h-full flex items-center justify-center text-white/40">
                                        Invalid Video URL
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
