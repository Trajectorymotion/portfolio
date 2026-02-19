"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { ArrowUpRight, Mail } from "lucide-react"
import { Reveal } from "@/components/ui/reveal"
import { TextReveal } from "@/components/ui/text-reveal"

export function Contact() {
    return (
        <section className="py-10 px-6 relative overflow-hidden">
            {/* Background blobs for footer area */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-gradient-to-t from-blue-900/20 to-transparent opacity-50 blur-3xl -z-10 pointer-events-none" />

            <div className="max-w-4xl mx-auto text-center">
                <GlassCard className="py-20 px-8 sm:px-16" noHover>
                    <div className="flex flex-col items-center">
                        <Reveal delay={0.2} y={20}>
                            <div className="w-24 h-24 mx-auto mb-8 rounded-full overflow-hidden border-4 border-foreground/10 shadow-xl bg-background relative">
                                {/* Avatar or Memoji */}
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-4xl">
                                    🚀
                                </div>
                            </div>
                        </Reveal>

                        <div className="mb-6">
                            <TextReveal
                                text="[Start] [conversation!]"
                                className="text-4xl sm:text-6xl font-bold text-foreground tracking-tight justify-center"
                                delay={0.4}
                            />
                        </div>

                        <div className="mb-10 max-w-xl mx-auto">
                            <TextReveal
                                text="Discuss the perfect [creative] strategy for your content. I'm available for new [projects.]"
                                className="text-lg text-gray-400 justify-center"
                                delay={0.6}
                                stagger={0.03}
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Reveal delay={0.8} y={20}>
                                <a
                                    href="https://www.instagram.com/trajectory.motion?igsh=MWpnYWYxZHBpYm5zNg=="
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative px-8 py-4 bg-foreground text-background rounded-full font-medium shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-tr from-foreground/0 via-foreground/20 to-foreground/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                    <Mail className="w-5 h-5 text-background" />
                                    <span>Get in touch</span>
                                </a>
                            </Reveal>
                            <Reveal delay={0.9} y={20}>
                                <a
                                    href="#"
                                    className="group px-8 py-4 bg-foreground/5 text-foreground rounded-full font-medium shadow-sm border border-foreground/10 hover:border-foreground/20 hover:bg-foreground/10 transition-all duration-300 flex items-center gap-2"
                                >
                                    <span>View resume</span>
                                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </a>
                            </Reveal>
                        </div>
                    </div>
                </GlassCard>

                <footer className="mt-10 flex flex-col items-center gap-6">
                    <div className="flex gap-6">
                        {/* Social Icons */}
                        {['Twitter', 'Instagram', 'YouTube'].map((social) => (
                            <a key={social} href="#" className="p-3 liquid-icon text-gray-400 rounded-full hover:text-foreground transition-all">
                                <span className="sr-only">{social}</span>
                                <div className="w-5 h-5 bg-current rounded-sm opacity-50" />
                            </a>
                        ))}
                    </div>
                    <p className="text-sm text-gray-400 font-medium">© 2024 Portfolio. All rights reserved.</p>
                </footer>
            </div>
        </section>
    )
}
