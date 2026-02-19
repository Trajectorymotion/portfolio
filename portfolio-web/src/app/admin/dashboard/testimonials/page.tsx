"use client"

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getContent, updateContent } from "@/lib/actions";
import {
    Plus,
    Trash2,
    Image as ImageIcon,
    RefreshCw,
    Save,
    User,
    Link as LinkIcon,
    Quote
} from "lucide-react";

const getGoogleDriveDirectLink = (url: string) => {
    if (!url || !url.includes('drive.google.com')) return url;
    const idMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
    if (idMatch && idMatch[1]) {
        return `https://lh3.googleusercontent.com/u/0/d/${idMatch[1]}`;
    }
    return url;
};

export default function TestimonialsAdmin() {
    const [data, setData] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Form State
    const [form, setForm] = useState({ name: "", review: "", image: "" });

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

    const addTestimonial = () => {
        if (!form.name || !form.review) return;

        const newTestimonial = {
            id: Math.random().toString(36).substr(2, 9),
            name: form.name,
            review: form.review,
            image: form.image
        };

        const updated = {
            ...data,
            testimonials: [newTestimonial, ...data.testimonials]
        };
        handleSave(updated);
        setForm({ name: "", review: "", image: "" });
    };

    const deleteTestimonial = (id: string) => {
        if (!confirm("Delete this testimonial?")) return;
        const updated = {
            ...data,
            testimonials: data.testimonials.filter((t: any) => t.id !== id)
        };
        handleSave(updated);
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
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Client Reviews</h1>
                    <p className="text-foreground/40 uppercase tracking-widest text-[9px] font-bold mt-1">Manage what people say about you</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* ADD TESTIMONIAL FORM */}
                <div className="lg:col-span-1">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-premium p-8 rounded-[3rem] border border-white/10 sticky top-10"
                    >
                        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <Plus size={20} /> Add Review
                        </h2>

                        <div className="flex flex-col gap-5">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 ml-1">Client Image Preview</label>
                                <div className="w-24 h-24 rounded-full bg-foreground/5 border border-white/5 flex items-center justify-center overflow-hidden self-center">
                                    {form.image ? (
                                        <img
                                            src={getGoogleDriveDirectLink(form.image)}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                            onError={(e) => { (e.target as any).src = ""; }}
                                        />
                                    ) : (
                                        <User size={32} className="text-foreground/10" />
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 ml-1">Full Name</label>
                                <input
                                    placeholder="e.g. Alex Rivera"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="bg-foreground/[0.04] border border-foreground/10 rounded-2xl px-5 py-4 outline-none focus:ring-1 ring-foreground/20 text-sm"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 ml-1">Review Text</label>
                                <textarea
                                    placeholder="Write the testimonial here..."
                                    value={form.review}
                                    onChange={(e) => setForm({ ...form, review: e.target.value })}
                                    rows={4}
                                    className="bg-foreground/[0.04] border border-foreground/10 rounded-2xl px-5 py-4 outline-none focus:ring-1 ring-foreground/20 text-sm resize-none"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 ml-1">Photo URL / Google Drive Link</label>
                                <div className="relative">
                                    <input
                                        placeholder="Paste link here..."
                                        value={form.image}
                                        onChange={(e) => setForm({ ...form, image: e.target.value })}
                                        className="w-full bg-foreground/[0.04] border border-foreground/10 rounded-2xl px-5 py-4 pl-12 outline-none focus:ring-1 ring-foreground/20 text-xs font-mono"
                                    />
                                    <LinkIcon size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-foreground/30" />
                                </div>
                            </div>

                            <button
                                onClick={addTestimonial}
                                disabled={isSaving || !form.name || !form.review}
                                className="mt-4 w-full py-4 rounded-2xl bg-foreground text-background font-bold text-sm flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform disabled:opacity-50"
                            >
                                <Save size={18} /> Publish Testimonial
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* LIST OF TESTIMONIALS */}
                <div className="lg:col-span-2 space-y-6">
                    <AnimatePresence mode="popLayout">
                        {data.testimonials.map((t: any, i: number) => (
                            <motion.div
                                key={t.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                className="glass-premium p-8 rounded-[3rem] border border-white/5 relative group"
                            >
                                <div className="flex items-start gap-6">
                                    <div className="w-16 h-16 rounded-full bg-foreground/5 border border-white/5 shrink-0 overflow-hidden">
                                        {t.image ? (
                                            <img src={getGoogleDriveDirectLink(t.image)} alt={t.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-foreground/20 font-bold uppercase">{t.name.slice(0, 2)}</div>
                                        )}
                                    </div>

                                    <div className="flex-grow">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-bold text-lg">{t.name}</h3>
                                            <button
                                                onClick={() => deleteTestimonial(t.id)}
                                                className="p-2 text-red-500/80 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                        <div className="relative">
                                            <Quote size={20} className="absolute -left-1 -top-2 text-foreground/5 -z-10" />
                                            <p className="text-foreground/60 text-sm leading-relaxed italic pr-6 group-hover:text-foreground/90 transition-colors">
                                                "{t.review}"
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {data.testimonials.length === 0 && (
                        <div className="py-20 text-center opacity-20 flex flex-col items-center gap-4">
                            <Quote size={60} />
                            <p className="text-xl font-bold uppercase tracking-[0.2em]">No reviews yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
