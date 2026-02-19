"use client"

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Instagram, Youtube, Mail, Star, Copy, Check, ExternalLink, ArrowLeft } from "lucide-react";
import Link from "next/link";

function RealLiquidButton({
    children,
    onClick,
    href,
    className,
    variant = "glass",
    rounded = "rounded-3xl"
}: {
    children: React.ReactNode,
    onClick?: () => void,
    href?: string,
    className?: string,
    variant?: "glass" | "solid",
    rounded?: string
}) {
    const Component = href ? motion.a : motion.button;

    // Hyperrealistic Real Liquid Styles
    const baseStyles = `relative group flex items-center justify-between px-7 py-4.5 ${rounded} transition-all duration-700 overflow-hidden`;

    // Variant-specific base layers - Enhanced for Light Mode
    const variantStyles = variant === "solid"
        ? "bg-foreground text-background shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
        : "bg-white/40 dark:bg-white/[0.03] border border-foreground/[0.08] dark:border-white/[0.08] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-none";

    const content = (
        <>
            {/* Glass Surface Refraction Layer */}
            <div className="absolute inset-0 backdrop-blur-[24px] pointer-events-none" />

            {/* Specular Gradient Layer (Light Mode Focus) */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent dark:from-transparent dark:to-transparent pointer-events-none opacity-50 dark:opacity-0" />

            {/* Top Gloss Highlight (Curved Surface) */}
            <div className="absolute top-0 left-0 right-0 h-[60%] bg-gradient-to-b from-white/[0.3] dark:from-white/[0.08] to-transparent pointer-events-none z-10" />

            {/* Dynamic Liquid Shine Flare */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none z-20">
                <div className="absolute top-[-50%] -left-[100%] w-[150%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2)_0%,transparent_60%)] animate-[shimmer_4s_infinite]" />
            </div>

            {/* Specular Highlight (Corner Shine) */}
            <div className="absolute top-2 left-5 w-14 h-[1.5px] bg-white/[0.5] dark:bg-white/[0.2] blur-[1px] rounded-full pointer-events-none z-30 opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:left-8" />

            {/* Inner Liquid Depth Shadow */}
            <div className="absolute inset-0 shadow-[inset_0_2px_12px_rgba(0,0,0,0.04)] dark:shadow-[inset_0_2px_10px_rgba(255,255,255,0.02)] pointer-events-none" />

            {/* Liquid Edge Glow - Sharper and more curved */}
            <div className={`absolute inset-px ${rounded} border border-white/[0.3] dark:border-white/[0.08] pointer-events-none z-30 shadow-[inset_0_0_10px_rgba(255,255,255,0.2)] dark:shadow-none`} />

            <div className="relative z-40 flex items-center gap-4 w-full justify-between">
                {children}
            </div>

            {/* Bottom Surface Reflection */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] h-[1px] bg-gradient-to-r from-transparent via-foreground/10 dark:via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[0.5px] z-30" />
        </>
    );

    const motionProps = {
        whileHover: {
            scale: 1.025,
            y: -3,
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.08), inset 0 0 20px rgba(255,255,255,0.1)"
        },
        whileTap: { scale: 0.98 },
    };

    if (href && !href.startsWith("http")) {
        return (
            <Link href={href} className="w-full">
                <motion.div
                    {...motionProps}
                    className={`${baseStyles} ${variantStyles} ${className} isolate`}
                >
                    {content}
                </motion.div>
            </Link>
        );
    }

    return (
        <Component
            href={href}
            onClick={onClick}
            target={href?.startsWith("http") ? "_blank" : undefined}
            rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
            {...motionProps}
            className={`${baseStyles} ${variantStyles} ${className} w-full text-left isolate`}
        >
            {content}
        </Component>
    );
}

export default function SocialsPage() {
    const [copied, setCopied] = useState(false);

    const copyInstagram = async () => {
        const textToCopy = "trajectory.motion";

        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(textToCopy);
            } else {
                const textArea = document.createElement("textarea");
                textArea.value = textToCopy;
                textArea.style.position = "fixed";
                textArea.style.left = "-9999px";
                textArea.style.top = "0";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                const success = document.execCommand('copy');
                textArea.remove();
                if (!success) throw new Error("Fallback copy failed");
            }
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <main className="min-h-screen bg-background relative flex items-center justify-center px-6 py-20 overflow-hidden selection:bg-foreground selection:text-background font-sans">
            {/* Atmospheric Background Layers */}
            <div className="absolute top-[-20%] left-[-10%] w-[60rem] h-[60rem] bg-foreground/[0.03] dark:bg-white/[0.01] blur-[120px] rounded-full pointer-events-none animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60rem] h-[60rem] bg-foreground/[0.03] dark:bg-white/[0.01] blur-[120px] rounded-full pointer-events-none animate-pulse" style={{ animationDelay: "2s" }} />

            <div className="max-w-md w-full relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="relative p-[1px] rounded-[3.5rem] overflow-hidden group/card shadow-[0_50px_100px_rgba(0,0,0,0.1)] dark:shadow-[0_50px_100px_rgba(0,0,0,0.4)]"
                >
                    {/* Animated Edge Light */}
                    <div className="absolute inset-[-500%] animate-[border-rotate_8s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_20%,var(--foreground)_50%,transparent_80%)] opacity-30 blur-2xl transition-opacity duration-1000 group-hover/card:opacity-50" />

                    <div className="glass-premium p-10 sm:p-14 rounded-[3.5rem] relative overflow-hidden flex flex-col items-center backdrop-blur-[40px]">
                        {/* Profile Section - Volumetric Bubble */}
                        <div className="mb-10 relative group/avatar">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
                                className="w-28 h-28 rounded-[2.8rem] overflow-hidden border border-foreground/[0.1] dark:border-white/[0.1] shadow-2xl relative z-10 bg-background flex items-center justify-center p-1.5 isolate"
                            >
                                <img src="/logo.png" alt="Profile" className="w-full h-full object-cover transition-transform duration-1000 group-hover/avatar:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-white/10 pointer-events-none" />
                                {/* Surface Shine on Avatar */}
                                <div className="absolute top-1 left-4 right-4 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-full blur-[2px] opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-500" />
                            </motion.div>
                            <div className="absolute -inset-10 bg-foreground/[0.05] blur-[60px] rounded-full -z-10 animate-pulse" />
                        </div>

                        <div className="text-center mb-12 w-full">
                            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-3 font-sans">Get in Touch</h1>
                            <p className="text-foreground/40 text-[13px] font-medium max-w-[260px] mx-auto leading-relaxed tracking-wide">
                                Crafting visuals that flow through the noise.
                            </p>
                        </div>

                        <div className="flex flex-col gap-4 w-full">
                            {/* Start A Project - Liquid Glass */}
                            <RealLiquidButton href="/contact">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-3xl bg-foreground/[0.03] dark:bg-white/[0.03] flex items-center justify-center border border-foreground/[0.05] dark:border-white/[0.05] group-hover:scale-105 transition-transform duration-500 shadow-inner relative overflow-hidden">
                                        <Star className="w-5 h-5 text-foreground fill-current animate-pulse" />
                                    </div>
                                    <span className="font-bold text-base tracking-tight">Start A Project</span>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-foreground/[0.02] flex items-center justify-center opacity-30">
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </div>
                            </RealLiquidButton>

                            {/* Instagram Link - Liquid Glass */}
                            <RealLiquidButton href="https://www.instagram.com/trajectory.motion/">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-3xl bg-foreground/[0.03] dark:bg-white/[0.03] flex items-center justify-center border border-foreground/[0.05] dark:border-white/[0.05] group-hover:scale-105 transition-transform duration-500 shadow-inner relative overflow-hidden">
                                        <Instagram className="w-5 h-5 text-foreground relative z-10" />
                                        <div className="absolute inset-0 bg-gradient-to-tr from-foreground/5 to-transparent" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-[15px] text-foreground tracking-tight">Instagram</span>
                                        <span className="text-[10px] text-foreground/30 font-mono tracking-widest uppercase">@trajectory.motion</span>
                                    </div>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-foreground/[0.02] flex items-center justify-center opacity-30">
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </div>
                            </RealLiquidButton>

                            {/* Instagram Copy - Liquid Glass */}
                            <RealLiquidButton onClick={() => copyInstagram()}>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-3xl bg-foreground/[0.03] dark:bg-white/[0.03] flex items-center justify-center border border-foreground/[0.05] dark:border-white/[0.05] group-hover:scale-105 transition-transform duration-500 shadow-inner relative overflow-hidden flex-shrink-0">
                                        <div className="relative z-10">
                                            <AnimatePresence mode="wait">
                                                {copied ? (
                                                    <motion.div
                                                        key="check"
                                                        initial={{ scale: 0.5, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        exit={{ scale: 0.5, opacity: 0 }}
                                                    >
                                                        <Check className="w-5 h-5 text-green-500" />
                                                    </motion.div>
                                                ) : (
                                                    <motion.div
                                                        key="copy"
                                                        initial={{ scale: 0.5, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        exit={{ scale: 0.5, opacity: 0 }}
                                                    >
                                                        <Copy className="w-5 h-5 text-foreground" />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-tr from-foreground/5 to-transparent" />
                                    </div>
                                    <div className="flex flex-col truncate">
                                        <span className="font-bold text-[15px] text-foreground tracking-tight">trajectory.motion</span>
                                        <span className="text-[10px] text-foreground/30 font-medium uppercase tracking-widest">{copied ? "Copied" : "Copy"}</span>
                                    </div>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-foreground/[0.02] flex items-center justify-center opacity-30">
                                    {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                                </div>
                            </RealLiquidButton>

                            {/* YouTube - Liquid Glass */}
                            <RealLiquidButton href="https://youtube.com/@TrajectoryMotion">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-3xl bg-foreground/[0.03] dark:bg-white/[0.03] flex items-center justify-center border border-foreground/[0.05] dark:border-white/[0.05] shadow-inner relative overflow-hidden">
                                        <Youtube className="w-5 h-5 text-foreground relative z-10" />
                                        <div className="absolute inset-0 bg-gradient-to-tr from-foreground/5 to-transparent" />
                                    </div>
                                    <span className="font-bold text-[15px] text-foreground tracking-tight">YouTube Channel</span>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-foreground/[0.02] flex items-center justify-center opacity-30">
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </div>
                            </RealLiquidButton>

                            {/* Email - Liquid Glass */}
                            <RealLiquidButton href="mailto:trajectorymotion.work@gmail.com">
                                <div className="flex items-center gap-4 overflow-hidden">
                                    <div className="w-10 h-10 rounded-3xl bg-foreground/[0.03] dark:bg-white/[0.03] flex items-center justify-center border border-foreground/[0.05] dark:border-white/[0.05] shadow-inner relative overflow-hidden flex-shrink-0">
                                        <Mail className="w-5 h-5 text-foreground relative z-10" />
                                        <div className="absolute inset-0 bg-gradient-to-tr from-foreground/5 to-transparent" />
                                    </div>
                                    <div className="flex flex-col truncate">
                                        <span className="font-bold text-[15px] text-foreground tracking-tight">Direct Email</span>
                                        <span className="text-[10px] text-foreground/30 font-medium truncate tracking-tight lowercase">trajectorymotion.work@gmail.com</span>
                                    </div>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-foreground/[0.02] flex items-center justify-center opacity-30">
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </div>
                            </RealLiquidButton>
                        </div>

                        {/* Footer Ornament */}
                        <div className="mt-14 flex flex-col items-center gap-4 w-full opacity-10">
                            <div className="flex items-center gap-3 w-full">
                                <div className="h-[1px] flex-1 bg-foreground" />
                                <Star className="w-3 h-3 fill-current" />
                                <div className="h-[1px] flex-1 bg-foreground" />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
