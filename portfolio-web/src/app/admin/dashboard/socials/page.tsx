"use client"

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getContent, updateContent } from "@/lib/actions";
import {
    Plus,
    Trash2,
    RefreshCw,
    Save,
    ExternalLink,
    Instagram,
    Youtube,
    Mail,
    Star,
    Check,
    ShoppingBag,
    Briefcase,
    Globe,
    Copy,
    GripVertical,
    ChevronDown
} from "lucide-react";

export default function SocialsAdmin() {
    const [data, setData] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [form, setForm] = useState({ title: "", subtitle: "", url: "", icon_name: "Instagram", secondary_icon_name: "ExternalLink" });
    const [openDropdown, setOpenDropdown] = useState<"main" | "secondary" | null>(null);

    useEffect(() => {
        async function load() {
            const content = await getContent();
            if (content) setData(content);
        }
        load();
    }, []);

    const handleSave = async (updatedData: any) => {
        setIsSaving(true);
        const result = await updateContent(updatedData);
        if (result.success) {
            setData(updatedData);
        } else {
            alert("Error: " + result.error);
        }
        setIsSaving(false);
    };

    const addSocial = () => {
        if (!form.title || !form.url) return;

        const newSocial = {
            id: Math.random().toString(36).substr(2, 9),
            ...form
        };

        const updated = {
            ...data,
            socials: [...data.socials, newSocial]
        };
        handleSave(updated);
        setForm({ title: "", subtitle: "", url: "", icon_name: "Instagram", secondary_icon_name: "ExternalLink" });
    };

    const deleteSocial = (id: string) => {
        if (!confirm("Delete this link?")) return;
        const updated = {
            ...data,
            socials: data.socials.filter((s: any) => s.id !== id)
        };
        handleSave(updated);
    };

    const icons = {
        Instagram,
        Youtube,
        Mail,
        Star,
        Copy,
        ExternalLink,
        Check,
        Store: ShoppingBag,
        Fiverr: Briefcase,
        Upwork: Briefcase,
        Portfolio: Globe
    };

    if (!data) return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <RefreshCw className="animate-spin text-foreground/20" size={40} />
        </div>
    );

    return (
        <div className="space-y-8 sm:space-y-12">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Social Links</h1>
                    <p className="text-foreground/40 uppercase tracking-widest text-[9px] font-bold mt-1">Manage links on your socials page</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* ADD SOCIAL FORM */}
                <div className="lg:col-span-1">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-premium p-8 rounded-[1.5rem] border border-white/10 sticky top-10"
                    >
                        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <Plus size={20} /> Add Link
                        </h2>

                        <div className="flex flex-col gap-5">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 ml-1">Title</label>
                                <input
                                    placeholder="e.g. My Portfolio"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    className="bg-foreground/[0.04] border border-foreground/10 rounded-2xl px-5 py-4 outline-none focus:ring-1 ring-foreground/20 text-sm"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 ml-1">Subtitle (Optional)</label>
                                <input
                                    placeholder="e.g. @username"
                                    value={form.subtitle}
                                    onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                                    className="bg-foreground/[0.04] border border-foreground/10 rounded-2xl px-5 py-4 outline-none focus:ring-1 ring-foreground/20 text-sm"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 ml-1">URL / Handle</label>
                                <input
                                    placeholder="https://..."
                                    value={form.url}
                                    onChange={(e) => setForm({ ...form, url: e.target.value })}
                                    className="bg-foreground/[0.04] border border-foreground/10 rounded-2xl px-5 py-4 outline-none focus:ring-1 ring-foreground/20 text-xs font-mono"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2 relative">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 ml-1">Main Icon</label>
                                    <button
                                        type="button"
                                        onClick={() => setOpenDropdown(openDropdown === "main" ? null : "main")}
                                        className="bg-foreground/[0.04] border border-foreground/10 rounded-2xl px-5 py-4 flex items-center justify-between text-xs font-bold transition-all focus:ring-1 ring-foreground/20 hover:bg-foreground/[0.06]"
                                    >
                                        <div className="flex items-center gap-2">
                                            {(() => {
                                                const Icon = (icons as any)[form.icon_name] || Star;
                                                return <Icon size={14} className="text-foreground/60" />;
                                            })()}
                                            <span className="truncate">{form.icon_name}</span>
                                        </div>
                                        <ChevronDown size={14} className={`text-foreground/20 transition-transform duration-300 ${openDropdown === "main" ? "rotate-180" : ""}`} />
                                    </button>

                                    <AnimatePresence>
                                        {openDropdown === "main" && (
                                            <>
                                                <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                                                    className="absolute top-[calc(100%+8px)] left-0 w-full bg-background border border-white/10 rounded-2xl shadow-2xl z-50 p-2 max-h-[240px] overflow-y-auto custom-scrollbar"
                                                >
                                                    {Object.keys(icons).map(name => (
                                                        <button
                                                            key={name}
                                                            type="button"
                                                            onClick={() => {
                                                                setForm({ ...form, icon_name: name });
                                                                setOpenDropdown(null);
                                                            }}
                                                            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-foreground/5 transition-colors text-xs font-medium group"
                                                        >
                                                            {(() => {
                                                                const Icon = (icons as any)[name];
                                                                return <Icon size={16} className="text-foreground/40 group-hover:text-foreground/80 transition-colors" />;
                                                            })()}
                                                            {name}
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="flex flex-col gap-2 relative">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 ml-1">Right Icon</label>
                                    <button
                                        type="button"
                                        onClick={() => setOpenDropdown(openDropdown === "secondary" ? null : "secondary")}
                                        className="bg-foreground/[0.04] border border-foreground/10 rounded-2xl px-5 py-4 flex items-center justify-between text-xs font-bold transition-all focus:ring-1 ring-foreground/20 hover:bg-foreground/[0.06]"
                                    >
                                        <div className="flex items-center gap-2">
                                            {(() => {
                                                const Icon = (icons as any)[form.secondary_icon_name] || ExternalLink;
                                                return <Icon size={14} className="text-foreground/60" />;
                                            })()}
                                            <span className="truncate">
                                                {form.secondary_icon_name === "secondary_icon_name" ? "Select" :
                                                    form.secondary_icon_name === "ExternalLink" ? "External" :
                                                        form.secondary_icon_name === "Check" ? "Check" :
                                                            form.secondary_icon_name === "Copy" ? "Copy" : form.secondary_icon_name}
                                            </span>
                                        </div>
                                        <ChevronDown size={14} className={`text-foreground/20 transition-transform duration-300 ${openDropdown === "secondary" ? "rotate-180" : ""}`} />
                                    </button>

                                    <AnimatePresence>
                                        {openDropdown === "secondary" && (
                                            <>
                                                <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                                                    className="absolute top-[calc(100%+8px)] left-0 w-full bg-background border border-white/10 rounded-2xl shadow-2xl z-50 p-2"
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() => { setForm({ ...form, secondary_icon_name: "ExternalLink" }); setOpenDropdown(null); }}
                                                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-foreground/5 transition-colors text-xs font-medium group"
                                                    >
                                                        <ExternalLink size={16} className="text-foreground/40 group-hover:text-foreground/80" />
                                                        ExternalLink
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => { setForm({ ...form, secondary_icon_name: "Check" }); setOpenDropdown(null); }}
                                                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-foreground/5 transition-colors text-xs font-medium group"
                                                    >
                                                        <Check size={16} className="text-foreground/40 group-hover:text-foreground/80" />
                                                        Check mark
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => { setForm({ ...form, secondary_icon_name: "Copy" }); setOpenDropdown(null); }}
                                                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-foreground/5 transition-colors text-xs font-medium group"
                                                    >
                                                        <Copy size={16} className="text-foreground/40 group-hover:text-foreground/80" />
                                                        Copy icon
                                                    </button>
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            <button
                                onClick={addSocial}
                                disabled={isSaving || !form.title || !form.url}
                                className="mt-4 w-full py-4 rounded-2xl bg-foreground text-background font-bold text-sm flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform disabled:opacity-50"
                            >
                                <Save size={18} /> Add Link
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* LIST OF SOCIALS */}
                <div className="lg:col-span-2 space-y-4">
                    <AnimatePresence mode="popLayout">
                        {data.socials.map((s: any, i: number) => {
                            const Icon = (icons as any)[s.icon_name] || Star;
                            const SecIcon = (icons as any)[s.secondary_icon_name] || ExternalLink;

                            return (
                                <motion.div
                                    key={s.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="glass-premium p-6 rounded-[1.25rem] border border-white/5 group flex items-center gap-4"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center text-foreground/40">
                                        <Icon size={20} />
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="font-bold text-sm">{s.title}</h3>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <SecIcon size={14} className="text-foreground/20" />
                                        <button
                                            onClick={() => deleteSocial(s.id)}
                                            className="p-2 text-red-500/80 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>

                    {data.socials.length === 0 && (
                        <div className="py-20 text-center opacity-20 flex flex-col items-center gap-4 border border-dashed border-white/10 rounded-[1.5rem]">
                            <Star size={60} />
                            <p className="text-xl font-bold uppercase tracking-[0.2em]">No links found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
