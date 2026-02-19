"use client"

import { motion } from "framer-motion";
import { Instagram, Youtube, Mail } from "lucide-react";

export function ContactCard() {
    const socials = [
        { icon: <Instagram className="w-5 h-5" />, href: "https://www.instagram.com/trajectory.motion/", label: "Instagram" },
        { icon: <Youtube className="w-5 h-5" />, href: "https://youtube.com/@TrajectoryMotion", label: "YouTube" },
        { icon: <Mail className="w-5 h-5" />, href: "mailto:trajectorymotion.work@gmail.com", label: "Email" },
    ];

    return (
        <div className="flex flex-col items-center justify-center px-6 mt-8 mb-8 relative">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-50 max-w-[550px] w-full rounded-[3.5rem] pt-10 px-10 pb-10 sm:pt-12 sm:px-12 sm:pb-12 flex flex-col glass-premium shadow-[0_20px_80px_rgba(0,0,0,0.4)] dark:shadow-[0_20px_80px_rgba(0,0,0,0.8)] border-white/20 dark:border-white/10 transition-all duration-500 hover:scale-[1.01] overflow-hidden"
            >
                <div className="absolute -inset-2 bg-gradient-to-br from-white/5 to-transparent blur-2xl rounded-[4rem] pointer-events-none -z-10 opacity-50" />

                <div className="mb-10 text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground/90 leading-tight">
                        Want Scroll-Stopping
                    </h2>
                    <div className="flex items-center justify-center gap-2 mt-1">
                        <div className="h-[1px] w-8 bg-foreground/10 hidden sm:block" />
                        <h2 className="text-2xl sm:text-3xl font-serif italic text-foreground/80 lowercase">
                            videos?
                        </h2>
                        <div className="h-[1px] w-8 bg-foreground/10 hidden sm:block" />
                    </div>
                </div>

                <div className="flex flex-col gap-6 mb-10">
                    <div>
                        <h3 className="text-base sm:text-lg font-bold text-foreground mb-1.5">
                            Long-Form Video Editing
                        </h3>
                        <p className="text-foreground/60 text-sm sm:text-base leading-relaxed">
                            Clean, engaging edits for YouTube and more, with dynamic motion and viral-ready storytelling.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-base sm:text-lg font-bold text-foreground mb-1.5">
                            Short-Form Video Editing
                        </h3>
                        <p className="text-foreground/60 text-sm sm:text-base leading-relaxed">
                            Scroll-stopping edits for Reels, TikToks, and Shorts—trending, punchy, and built to go viral.
                        </p>
                    </div>
                </div>

                {/* FINAL FIX → opens socials landing page */}
                <motion.a
                    href="/socials"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl liquid-icon group cursor-pointer shadow-xl text-foreground font-semibold text-base"
                >
                    <span className="z-10">Get In Touch</span>

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
                </motion.a>

                <div className="w-full flex justify-center mt-8 -mb-16 relative">
                    <img
                        src="/angel.png"
                        alt="Contact Avatar"
                        className="w-40 sm:w-48 object-contain drop-shadow-[0_0_30px_rgba(59,130,246,0.3)] opacity-90 transition-transform duration-500 hover:scale-105"
                    />
                </div>
            </motion.div>

            {/* Outside Text with Word-by-Word Animation */}
            <div className="mt-14 mb-8 flex flex-wrap justify-center gap-x-2 px-4">
                {"Let visuals do the talking🔥".split(" ").map((word, i) => (
                    <motion.span
                        key={i}
                        initial={{ opacity: 0, filter: "blur(10px)", scale: 0.8, y: 20 }}
                        whileInView={{ opacity: 1, filter: "blur(0px)", scale: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{
                            duration: 0.6,
                            type: "spring",
                            stiffness: 100,
                            damping: 15,
                            delay: i * 0.1 // Staggered delay for word-by-word effect
                        }}
                        className="text-xl sm:text-2xl font-bold text-foreground/80 tracking-tight"
                    >
                        {word}{i < "Let visuals do the talking🔥".split(" ").length - 1 ? " " : ""}
                    </motion.span>
                ))}
            </div>

            {/* Quick Access Socials */}
            <div className="flex items-center gap-4">
                {socials.map((social, i) => (
                    <motion.a
                        key={i}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                            delay: 0.8 + (i * 0.1),
                            type: "spring",
                            stiffness: 200,
                            damping: 15
                        }}
                        whileHover={{ y: -5, scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-12 h-12 rounded-full liquid-icon flex items-center justify-center text-foreground/70 hover:text-foreground shadow-lg"
                        title={social.label}
                    >
                        {social.icon}
                    </motion.a>
                ))}
            </div>
        </div>
    );
}