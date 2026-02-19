"use client"

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getContent, updateContent } from "@/lib/actions";
import {
    Save,
    RefreshCw,
    Globe,
    Image as ImageIcon,
    Layout,
    Type,
    CheckCircle2,
    Info,
    Plus,
    Trash2,
    Upload,
    Link as LinkIcon,
    Instagram,
    Youtube,
    Mail,
    Twitter,
    Github,
    Linkedin,
    ExternalLink,
    ChevronDown,
    ShoppingBag,
    Briefcase,
    Globe as GlobeIcon,
    Search
} from "lucide-react";

// Platform Icon Configurations
const presetIcons: Record<string, any> = {
    Instagram: Instagram,
    Youtube: Youtube,
    Mail: Mail,
    Twitter: Twitter,
    Github: Github,
    Linkedin: Linkedin,
    Store: ShoppingBag,
    Fiverr: Briefcase,
    Upwork: Briefcase,
    Portfolio: GlobeIcon,
    ExternalLink: ExternalLink,
};

const iconColors: Record<string, string> = {
    // Brand colors removed for consistent theme-based icons
};

export default function SettingsPage() {
    const [data, setData] = useState<any>(null);
    const [settings, setSettings] = useState({
        site_name: "",
        logo_url: "",
        favicon_url: "",
        footer_socials: [] as { icon: string; href: string }[]
    });
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const socialIconInputRef = useRef<HTMLInputElement>(null);
    const [uploadType, setUploadType] = useState<"logo" | "favicon" | "social_icon" | null>(null);
    const [activeSocialIndex, setActiveSocialIndex] = useState<number | null>(null);
    const [openDropdown, setOpenDropdown] = useState<number | null>(null);
    const [iconUrlInput, setIconUrlInput] = useState<{ index: number, value: string } | null>(null);

    useEffect(() => {
        async function load() {
            const content = await getContent();
            if (content) {
                setData(content);
                setSettings({
                    site_name: content.settings.site_name || "",
                    logo_url: content.settings.logo_url || "",
                    favicon_url: content.settings.favicon_url || "",
                    footer_socials: content.settings.footer_socials || []
                });
            }
        }
        load();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        const updatedData = { ...data, settings };
        const result = await updateContent(updatedData);
        if (result.success) {
            setData(updatedData);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } else {
            alert("Error: " + result.error);
        }
        setIsSaving(false);
    };

    const compressImage = (file: File, maxWidth: number, maxHeight: number): Promise<string> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > maxWidth) {
                            height *= maxWidth / width;
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width *= maxHeight / height;
                            height = maxHeight;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);
                    // Use higher quality for logo, lower for icons
                    const quality = maxWidth > 200 ? 0.8 : 0.6;
                    resolve(canvas.toDataURL('image/jpeg', quality));
                };
            };
        });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !uploadType) return;

        // Determine target size based on type
        const maxWidth = uploadType === "logo" ? 512 : 128;
        const maxHeight = uploadType === "logo" ? 512 : 128;

        const compressedBase64 = await compressImage(file, maxWidth, maxHeight);

        if (uploadType === "logo") {
            setSettings({ ...settings, logo_url: compressedBase64 });
        } else if (uploadType === "favicon") {
            setSettings({ ...settings, favicon_url: compressedBase64 });
        } else if (uploadType === "social_icon" && activeSocialIndex !== null) {
            updateFooterSocial(activeSocialIndex, "icon", compressedBase64);
        }
    };

    const addFooterSocial = () => {
        setSettings({
            ...settings,
            footer_socials: [...settings.footer_socials, { icon: "Instagram", href: "https://instagram.com" }]
        });
    };

    const removeFooterSocial = (index: number) => {
        const newSocials = [...settings.footer_socials];
        newSocials.splice(index, 1);
        setSettings({ ...settings, footer_socials: newSocials });
    };

    const updateFooterSocial = (index: number, field: string, value: string) => {
        const newSocials = [...settings.footer_socials];
        newSocials[index] = { ...newSocials[index], [field]: value };
        setSettings({ ...settings, footer_socials: newSocials });
    };

    const isCustomIcon = (iconStr: string) => {
        return iconStr?.startsWith('data:image') || iconStr?.startsWith('http');
    };

    if (!data) return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <RefreshCw className="animate-spin text-foreground/20" size={40} />
        </div>
    );

    return (
        <div className="space-y-10 pb-20 max-w-6xl mx-auto">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Global Settings</h1>
                    <p className="text-foreground/40 text-xs font-bold uppercase tracking-widest mt-1">Brand Identity & Footer Presence</p>
                </div>

                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="liquid-icon px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-2xl whitespace-nowrap"
                >
                    {isSaving ? (
                        <RefreshCw className="animate-spin" size={18} />
                    ) : showSuccess ? (
                        <CheckCircle2 size={18} className="text-green-400" />
                    ) : (
                        <Save size={18} />
                    )}
                    <span>{isSaving ? "Syncing..." : showSuccess ? "Settings Live" : "Save All Changes"}</span>
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Site Identity Column */}
                <div className="space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-premium p-6 rounded-[1.5rem] border border-white/10 space-y-6"
                    >
                        <h2 className="text-lg font-bold flex items-center gap-3 border-b border-white/5 pb-4">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                                <Globe size={18} />
                            </div>
                            Core Identity
                        </h2>

                        <div className="space-y-5">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40 ml-1">Website Name</label>
                                <div className="relative group">
                                    <Type className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-blue-500 transition-colors" size={18} />
                                    <input
                                        value={settings.site_name}
                                        onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                                        className="w-full h-12 bg-foreground/[0.04] border border-foreground/10 rounded-xl pl-14 pr-5 outline-none focus:ring-1 ring-blue-500/30 text-base font-medium transition-all"
                                        placeholder="e.g. Trajectory motion"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40 ml-1">Main Logo / Avatar</label>
                                    <button
                                        onClick={() => { setUploadType("logo"); fileInputRef.current?.click(); }}
                                        className="text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-xl bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-all flex items-center gap-2 border border-blue-500/10"
                                    >
                                        <Upload size={12} /> Replace
                                    </button>
                                </div>
                                <div className="flex items-center gap-4 bg-foreground/[0.02] p-3 rounded-xl border border-white/5">
                                    <div className="w-14 h-14 rounded-xl overflow-hidden border border-white/10 bg-black/40 shadow-inner flex-shrink-0">
                                        <img src={settings.logo_url || "/logo.png"} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-grow space-y-3">
                                        <div className="relative">
                                            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20" size={14} />
                                            <input
                                                value={settings.logo_url}
                                                onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })}
                                                className="w-full bg-transparent border-b border-white/10 pl-10 pr-2 py-2 outline-none text-[10px] font-mono text-foreground/50 focus:text-foreground transition-all"
                                                placeholder="Paste direct link..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40 ml-1">Favicon Asset</label>
                                    <button
                                        onClick={() => { setUploadType("favicon"); fileInputRef.current?.click(); }}
                                        className="text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-xl bg-foreground/10 text-foreground/60 hover:bg-foreground/20 transition-all flex items-center gap-2"
                                    >
                                        <Upload size={12} /> Update
                                    </button>
                                </div>
                                <div className="flex items-center gap-4 bg-foreground/[0.02] p-3 rounded-xl border border-white/5">
                                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 bg-black/40 flex items-center justify-center p-2">
                                        <img src={settings.favicon_url || "/favicontm.png"} alt="Favicon" className="w-full h-full object-contain" />
                                    </div>
                                    <div className="flex-grow">
                                        <div className="relative">
                                            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20" size={14} />
                                            <input
                                                value={settings.favicon_url}
                                                onChange={(e) => setSettings({ ...settings, favicon_url: e.target.value })}
                                                className="w-full bg-transparent border-b border-white/10 pl-10 pr-2 py-2 outline-none text-[10px] font-mono text-foreground/50 focus:text-foreground transition-all"
                                                placeholder="Favicon Link..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Footer Socials Column */}
                <div className="space-y-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-premium p-5 rounded-[1.5rem] border border-white/10 min-h-[500px] flex flex-col"
                    >
                        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                            <h2 className="text-sm font-bold flex items-center gap-2 whitespace-nowrap">
                                <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500 shadow-inner">
                                    <Layout size={14} />
                                </div>
                                Quick Reach Links
                            </h2>
                            <button
                                onClick={addFooterSocial}
                                className="px-3 py-2 rounded-lg bg-purple-500 text-white flex items-center gap-1 hover:scale-[1.05] active:scale-[0.95] transition-all shadow-xl shadow-purple-500/20 text-[8px] font-bold uppercase tracking-widest whitespace-nowrap"
                            >
                                <Plus size={12} /> Add
                            </button>
                        </div>

                        <div className="space-y-6 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
                            <AnimatePresence mode="popLayout">
                                {settings.footer_socials.length === 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="py-20 text-center flex flex-col items-center gap-4 text-foreground/10 border border-dashed border-white/10 rounded-[3rem]"
                                    >
                                        <Plus size={48} strokeWidth={1} />
                                        <p className="text-sm font-bold uppercase tracking-[0.3em]">No reach points</p>
                                    </motion.div>
                                ) : (
                                    settings.footer_socials.map((social, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="bg-foreground/[0.04] border border-white/5 rounded-[1.25rem] p-7 flex flex-col gap-6 relative group/item transition-all hover:bg-foreground/[0.06]"
                                        >
                                            <div className="flex items-end gap-3 transition-all">
                                                <div className="flex flex-col gap-2 flex-grow">
                                                    <label className="text-[9px] font-bold uppercase tracking-widest text-foreground/30 ml-1">Platform Identity</label>
                                                    <div className="relative h-11">
                                                        {/* Custom Dropdown Trigger */}
                                                        <button
                                                            onClick={() => setOpenDropdown(openDropdown === idx ? null : idx)}
                                                            className="w-full h-full bg-background/50 backdrop-blur-md border border-foreground/10 rounded-2xl px-5 flex items-center justify-between text-xs font-bold transition-all focus:border-purple-500/50 hover:bg-background/80"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                {isCustomIcon(social.icon) ? (
                                                                    <div className="w-5 h-5 flex items-center justify-center">
                                                                        <img
                                                                            src={social.icon}
                                                                            alt=""
                                                                            className="w-full h-full object-contain dark:brightness-0 dark:invert invert-0"
                                                                        />
                                                                    </div>
                                                                ) : (
                                                                    (() => {
                                                                        const Icon = presetIcons[social.icon] || ExternalLink;
                                                                        return <Icon size={16} className="text-foreground" />;
                                                                    })()
                                                                )}
                                                                <span className="truncate max-w-[140px] text-xs">
                                                                    {isCustomIcon(social.icon) ? "Private Asset" : social.icon}
                                                                </span>
                                                            </div>
                                                            <ChevronDown size={14} className={`transition-transform duration-500 ${openDropdown === idx ? 'rotate-180 text-purple-500' : 'text-foreground/30'}`} />
                                                        </button>

                                                        {/* Animated Dropdown Menu */}
                                                        <AnimatePresence>
                                                            {openDropdown === idx && (
                                                                <>
                                                                    <div
                                                                        className="fixed inset-0 z-[60]"
                                                                        onClick={() => setOpenDropdown(null)}
                                                                    />
                                                                    <motion.div
                                                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                                        exit={{ opacity: 0, y: 5, scale: 0.98 }}
                                                                        className="absolute top-[calc(100%+8px)] left-0 w-full bg-background/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-[70] p-2 overflow-hidden overflow-y-auto max-h-[300px] custom-scrollbar"
                                                                    >
                                                                        <div className="text-[8px] font-bold uppercase tracking-widest text-foreground/30 p-2 border-b border-white/5 mb-1">Presets</div>
                                                                        {Object.keys(presetIcons).map(name => (
                                                                            <button
                                                                                key={name}
                                                                                onClick={() => {
                                                                                    updateFooterSocial(idx, "icon", name);
                                                                                    setOpenDropdown(null);
                                                                                }}
                                                                                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-xs font-medium group"
                                                                            >
                                                                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                                                                    {(() => {
                                                                                        const Icon = presetIcons[name];
                                                                                        return <Icon size={16} className={iconColors[name] || ""} />;
                                                                                    })()}
                                                                                </div>
                                                                                {name}
                                                                            </button>
                                                                        ))}

                                                                        <div className="text-[8px] font-bold uppercase tracking-widest text-foreground/30 p-2 border-b border-white/5 mt-2 mb-1">Advanced</div>
                                                                        <div className="space-y-1 p-1">
                                                                            <button
                                                                                onClick={() => {
                                                                                    setUploadType("social_icon");
                                                                                    setActiveSocialIndex(idx);
                                                                                    socialIconInputRef.current?.click();
                                                                                    setOpenDropdown(null);
                                                                                }}
                                                                                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-purple-500/10 text-purple-500 transition-colors text-xs font-bold group"
                                                                            >
                                                                                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-all">
                                                                                    <Upload size={16} />
                                                                                </div>
                                                                                Upload Local File
                                                                            </button>

                                                                            <div
                                                                                className="flex items-center gap-2 p-3 rounded-xl bg-foreground/5 focus-within:bg-foreground/10 transition-all"
                                                                                onClick={(e) => e.stopPropagation()}
                                                                            >
                                                                                <div className="w-8 h-8 rounded-lg bg-foreground/5 flex items-center justify-center text-foreground/40">
                                                                                    <LinkIcon size={14} />
                                                                                </div>
                                                                                <input
                                                                                    type="text"
                                                                                    placeholder="External Icon URL..."
                                                                                    className="bg-transparent border-none outline-none text-[10px] flex-grow font-mono"
                                                                                    onKeyDown={(e) => {
                                                                                        if (e.key === 'Enter') {
                                                                                            updateFooterSocial(idx, "icon", (e.target as HTMLInputElement).value);
                                                                                            setOpenDropdown(null);
                                                                                        }
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </motion.div>
                                                                </>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                </div>

                                                {/* Balanced Preview Window */}
                                                <div className="w-11 h-11 rounded-xl bg-foreground/5 flex items-center justify-center flex-shrink-0 border border-white/5 relative group/preview">
                                                    {isCustomIcon(social.icon) ? (
                                                        <img
                                                            src={social.icon}
                                                            alt="Custom"
                                                            className="w-full h-full object-contain p-1.5 dark:brightness-0 dark:invert invert-0"
                                                        />
                                                    ) : (
                                                        (() => {
                                                            const Icon = presetIcons[social.icon] || ExternalLink;
                                                            return <Icon size={18} className="text-foreground" />;
                                                        })()
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-[9px] font-bold uppercase tracking-widest text-foreground/30 ml-1">Destination URL</label>
                                                <div className="relative group/link">
                                                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within/link:text-purple-500 transition-colors" size={14} />
                                                    <input
                                                        value={social.href}
                                                        onChange={(e) => updateFooterSocial(idx, "href", e.target.value)}
                                                        className="w-full h-12 bg-background/50 border border-foreground/10 rounded-xl pl-12 pr-4 outline-none text-[13px] font-medium transition-all focus:border-purple-500/30"
                                                        placeholder="https://..."
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => { if (confirm("Permanently discard this link?")) removeFooterSocial(idx); }}
                                                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-red-500/10 bg-red-500/5 text-red-500/60 hover:bg-red-500 hover:text-white transition-all text-[8px] font-bold uppercase tracking-widest whitespace-nowrap active:scale-[0.98]"
                                            >
                                                <Trash2 size={12} />
                                                <span>Discard Link Instance</span>
                                            </button>
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Hidden System Inputs */}
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
            <input type="file" ref={socialIconInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
        </div>
    );
}
