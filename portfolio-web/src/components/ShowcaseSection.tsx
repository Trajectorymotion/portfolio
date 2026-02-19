"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { Play } from "lucide-react"
import { Reveal } from "@/components/ui/reveal"
import { TextReveal } from "@/components/ui/text-reveal"
import { VideoModal } from "@/components/ui/video-modal"

interface ShowcaseItem {
    id: string
    title: string
    thumbnail?: string // URL or path
    videoUrl?: string
}

interface ShowcaseSectionProps {
    id: string
    title: string
    subtitle: string
    description: string
    items: ShowcaseItem[]
    secondaryItems?: ShowcaseItem[]
    variant?: 'portrait' | 'landscape'
    showToggle?: boolean
}

export function ShowcaseSection({ id, title, subtitle, description, items, secondaryItems = [], variant = 'portrait', showToggle = false }: ShowcaseSectionProps) {
    const [selectedVariant, setSelectedVariant] = useState<'portrait' | 'landscape'>(variant)
    const [selectedVideo, setSelectedVideo] = useState<{ url: string; title: string } | null>(null)

    useEffect(() => {
        setSelectedVariant(variant)
    }, [variant])

    // Determine which items to show based on toggle
    const displayItems = (selectedVariant === 'portrait' && secondaryItems.length > 0)
        ? secondaryItems
        : items

    // Helper to get YouTube ID from URL
    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/
        const match = url.match(regExp)
        return (match && match[2].length === 11) ? match[2] : null
    }

    return (
        <section id={id} className="pt-4 pb-20 px-6 sm:px-10">
            <div className="max-w-7xl mx-auto">
                <div className="mb-4 flex flex-col items-center">
                    {/* Character Visual */}
                    <div className="relative mb-2">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                            style={{
                                maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
                                WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)'
                            }}
                        >
                            <img
                                src="/character-pointing.png"
                                alt="Character pointing"
                                className="w-72 sm:w-96 h-auto object-contain transform hover:scale-105 transition-transform duration-700"
                            />
                        </motion.div>
                    </div>

                    <TextReveal
                        text={title}
                        className="text-4xl sm:text-5xl font-bold mb-2 tracking-tight text-foreground justify-center text-center"
                    />
                    <TextReveal
                        text={`[${subtitle}]`}
                        className="text-3xl sm:text-4xl text-gray-400 mb-6 justify-center"
                        delay={0.2}
                    />
                    <TextReveal
                        text={description}
                        className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed justify-center"
                        delay={0.4}
                        stagger={0.02}
                    />
                </div>

                {/* Aspect Ratio Toggle */}
                {showToggle && (
                    <Reveal delay={0.5} y={20} width="100%">
                        <div className="flex justify-center mb-12 w-full">
                            <div className="glass p-1.5 rounded-full flex items-center gap-1 border border-foreground/5 shadow-2xl backdrop-blur-3xl">
                                <button
                                    onClick={() => setSelectedVariant('landscape')}
                                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-500 ${selectedVariant === 'landscape'
                                        ? 'bg-foreground text-background shadow-lg'
                                        : 'text-gray-400 hover:text-foreground hover:bg-foreground/5'
                                        }`}
                                >
                                    16:9
                                </button>
                                <button
                                    onClick={() => setSelectedVariant('portrait')}
                                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-500 ${selectedVariant === 'portrait'
                                        ? 'bg-foreground text-background shadow-lg'
                                        : 'text-gray-400 hover:text-foreground hover:bg-foreground/5'
                                        }`}
                                >
                                    9:16
                                </button>
                            </div>
                        </div>
                    </Reveal>
                )}

                <div className={`${selectedVariant === 'landscape' ? 'grid-cols-1 max-w-4xl mx-auto gap-8' : 'grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8'} grid transition-all duration-700`}>
                    {displayItems.map((item, index) => {
                        const ytId = item.videoUrl ? getYouTubeId(item.videoUrl) : null
                        const thumbUrl = ytId
                            ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`
                            : item.thumbnail

                        return (
                            <Reveal key={item.id} delay={0.2 + index * 0.1} y={40} width="100%">
                                <GlassCard
                                    className="group cursor-pointer p-2 sm:p-3"
                                    onClick={() => item.videoUrl && setSelectedVideo({ url: item.videoUrl, title: item.title })}
                                >
                                    <div className={`${selectedVariant === 'landscape' ? 'aspect-video' : 'aspect-[9/16] md:aspect-video'} rounded-2xl bg-foreground/5 relative overflow-hidden transition-all duration-700 ease-in-out`}>
                                        {/* Thumbnail / Video View */}
                                        <div className="absolute inset-0 bg-foreground/5 group-hover:scale-110 transition-transform duration-700 ease-out">
                                            {thumbUrl ? (
                                                <img
                                                    src={thumbUrl}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 bg-gradient-to-br from-foreground/10 to-foreground/5 flex items-center justify-center">
                                                    <span className="text-foreground/40 font-medium text-4xl italic">MOTION</span>
                                                </div>
                                            )}
                                            {/* Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-60 transition-colors duration-500" />
                                        </div>

                                        {/* Play Button Overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center bg-foreground/5 group-hover:bg-foreground/10 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                            <div className="w-16 h-16 rounded-full glass flex items-center justify-center backdrop-blur-md border border-foreground/20 shadow-lg transform scale-50 group-hover:scale-100 transition-all duration-300 ease-out">
                                                <Play className="w-6 h-6 text-foreground fill-current ml-1" />
                                            </div>
                                        </div>
                                    </div>
                                </GlassCard>
                            </Reveal>
                        )
                    })}
                </div>
            </div>

            {/* Video Modal */}
            <VideoModal
                isOpen={!!selectedVideo}
                onClose={() => setSelectedVideo(null)}
                videoUrl={selectedVideo?.url || ""}
                title={selectedVideo?.title || ""}
                forceLandscape={selectedVariant === 'landscape'}
            />
        </section>
    )
}
