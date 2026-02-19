"use client"

import { useState } from "react";
import { motion } from "framer-motion";
import { Instagram, Youtube, Mail, Star, Copy, Check, ExternalLink, ShoppingBag, Briefcase, Globe } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SocialLink {
    id: string;
    title: string;
    subtitle?: string;
    url: string;
    icon_name: string;
    secondary_icon_name?: string;
}

interface SiteSettings {
    site_name: string;
    logo_url: string;
    favicon_url: string;
}

const icons: Record<string, any> = {
    Instagram,
    Youtube,
    Mail,
    Star,
    Copy,
    Check,
    ExternalLink,
    Store: ShoppingBag,
    Fiverr: Briefcase,
    Upwork: Briefcase,
    Portfolio: Globe
};

const iconColors: Record<string, string> = {
    Fiverr: "text-[#1dbf73]",
    Upwork: "text-[#14a800]",
};

function PremiumSocialButton({
    social,
    onCopy,
    variant = 'glass'
}: {
    social: SocialLink,
    onCopy?: (text: string) => void,
    variant?: 'glass' | 'solid'
}) {
    const [isCopied, setIsCopied] = useState(false);
    const Icon = icons[social.icon_name] || Star;
    const SecondaryIcon = isCopied ? Check : (icons[social.secondary_icon_name || "ExternalLink"] || ExternalLink);

    const isInternal = social.url.startsWith('/');
    const isCopyAction = social.icon_name === 'Copy' || social.subtitle === 'Copy Handle' || (social.url.includes('trajectory.motion') && !social.url.startsWith('http'));

    const handleAction = (e: React.MouseEvent) => {
        if (isCopyAction) {
            e.preventDefault();
            if (onCopy) onCopy(social.url);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    const content = (
        <div className="relative z-10 flex items-center justify-between w-full px-5 py-3.5">
            <div className="flex items-center gap-4">
                <div className={cn(
                    "w-10 h-10 rounded-2xl flex items-center justify-center border shadow-inner transition-colors duration-300 overflow-hidden",
                    variant === 'glass'
                        ? "bg-foreground/[0.03] dark:bg-white/[0.04] border-foreground/[0.05] dark:border-white/[0.05]"
                        : "bg-foreground/5 dark:bg-white/5 border-transparent"
                )}>
                    {social.icon_name && (social.icon_name.startsWith('data:image') || social.icon_name.startsWith('http')) ? (
                        <img src={social.icon_name} alt="" className="w-full h-full object-contain p-1.5" />
                    ) : (
                        (() => {
                            const Icon = icons[social.icon_name] || Star;
                            return <Icon className={cn("w-5 h-5 text-foreground", iconColors[social.icon_name])} />;
                        })()
                    )}
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-[15px] text-foreground tracking-tight">{social.title}</span>
                    {social.subtitle && (
                        <span className="text-[10px] text-foreground/30 font-medium uppercase tracking-widest">{social.subtitle}</span>
                    )}
                </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-foreground/[0.02] flex items-center justify-center opacity-30">
                <SecondaryIcon className={isCopied ? "w-3.5 h-3.5 text-green-500" : "w-3.5 h-3.5"} />
            </div>
        </div>
    );

    const buttonProps = {
        whileHover: { scale: 1.01, y: -1 },
        whileTap: { scale: 0.99 },
        className: cn(
            "w-full rounded-2xl overflow-hidden relative group transition-all duration-300",
            variant === 'glass'
                ? "glass-premium border border-white/10 dark:border-white/5 backdrop-blur-[40px]"
                : "bg-foreground/5 hover:bg-foreground/10 border border-transparent"
        )
    };

    if (isInternal) {
        return (
            <Link href={social.url} className="w-full block">
                <motion.div {...buttonProps}>{content}</motion.div>
            </Link>
        );
    }

    return (
        <motion.a
            href={isCopyAction ? "#" : social.url}
            target={isCopyAction ? undefined : "_blank"}
            rel={isCopyAction ? undefined : "noopener noreferrer"}
            onClick={handleAction}
            {...buttonProps}
        >
            {content}
        </motion.a>
    );
}

export default function SocialsPageClient({ initialSocials, settings }: { initialSocials: SocialLink[], settings: SiteSettings }) {
    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <main className="min-h-screen bg-background relative flex items-center justify-center px-6 py-20 overflow-hidden font-sans">
            {/* Atmospheric Background Layers */}
            <div className="absolute top-[-20%] left-[-10%] w-[60rem] h-[60rem] bg-foreground/[0.02] dark:bg-white/[0.01] blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-md w-full relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="glass-premium p-10 rounded-[3rem] relative overflow-hidden flex flex-col items-center backdrop-blur-[40px] border border-white/10">
                        {/* Profile Section */}
                        <div className="mb-8 relative group/avatar">
                            <div className="w-24 h-24 rounded-[2.2rem] overflow-hidden border border-foreground/[0.1] dark:border-white/[0.1] shadow-xl relative z-10 bg-white p-1 isolate">
                                <img src={settings?.logo_url || "/logo.png"} alt="Profile" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute -inset-10 bg-foreground/[0.03] blur-[60px] rounded-full -z-10" />
                        </div>

                        <div className="text-center mb-10 w-full">
                            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Get in Touch</h1>
                            <p className="text-foreground/40 text-[12px] font-medium max-w-[240px] mx-auto leading-relaxed">
                                Crafting visuals that flow through the noise.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3.5 w-full">
                            {initialSocials.map((social) => (
                                <PremiumSocialButton
                                    key={social.id}
                                    social={social}
                                    onCopy={copyToClipboard}
                                    variant="glass"
                                />
                            ))}
                        </div>

                        {/* Footer Ornament */}
                        <div className="mt-12 flex flex-col items-center gap-4 w-full opacity-5">
                            <div className="h-[1px] w-full bg-foreground" />
                        </div>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
