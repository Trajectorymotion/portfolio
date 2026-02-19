"use client"

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getContent, updateContent } from "@/lib/actions";
import {
    Plus,
    Trash2,
    RefreshCw,
    Save,
    HelpCircle,
    ChevronDown,
    MessageCircle
} from "lucide-react";

export default function FAQAdmin() {
    const [data, setData] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [form, setForm] = useState({ question: "", answer: "" });
    const [expandedItem, setExpandedItem] = useState<string | null>(null);

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

    const addFAQ = () => {
        if (!form.question || !form.answer) return;

        const newFAQ = {
            id: Math.random().toString(36).substr(2, 9),
            question: form.question,
            answer: form.answer
        };

        const updated = {
            ...data,
            faqs: [...data.faqs, newFAQ]
        };
        handleSave(updated);
        setForm({ question: "", answer: "" });
    };

    const deleteFAQ = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!confirm("Delete this FAQ item?")) return;
        const updated = {
            ...data,
            faqs: data.faqs.filter((f: any) => f.id !== id)
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
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">FAQ Knowledge Base</h1>
                    <p className="text-foreground/40 uppercase tracking-widest text-[9px] font-bold mt-1">Manage common questions & answers</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* ADD FAQ FORM */}
                <div className="lg:col-span-1">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-premium p-8 rounded-[1.5rem] border border-white/10 sticky top-10"
                    >
                        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <Plus size={20} /> New Question
                        </h2>

                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 ml-1">Question</label>
                                <input
                                    placeholder="e.g. How do we start?"
                                    value={form.question}
                                    onChange={(e) => setForm({ ...form, question: e.target.value })}
                                    className="bg-foreground/[0.04] border border-foreground/10 rounded-2xl px-5 py-4 outline-none focus:ring-1 ring-foreground/20 text-sm font-bold"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 ml-1">Answer</label>
                                <textarea
                                    placeholder="Provide a clear, helpful answer..."
                                    value={form.answer}
                                    onChange={(e) => setForm({ ...form, answer: e.target.value })}
                                    rows={6}
                                    className="bg-foreground/[0.04] border border-foreground/10 rounded-2xl px-5 py-4 outline-none focus:ring-1 ring-foreground/20 text-sm resize-none leading-relaxed"
                                />
                            </div>

                            <button
                                onClick={addFAQ}
                                disabled={isSaving || !form.question || !form.answer}
                                className="mt-2 w-full py-4 rounded-2xl bg-foreground text-background font-bold text-sm flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform disabled:opacity-50 shadow-xl shadow-foreground/5"
                            >
                                <Save size={18} /> Add to FAQ
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* LIST OF FAQS */}
                <div className="lg:col-span-2 space-y-4">
                    <AnimatePresence mode="popLayout">
                        {data.faqs.map((faq: any, i: number) => {
                            const isExpanded = expandedItem === faq.id;

                            return (
                                <motion.div
                                    key={faq.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    onClick={() => setExpandedItem(isExpanded ? null : faq.id)}
                                    className={`glass-premium p-6 sm:p-8 rounded-[1.25rem] border border-white/5 cursor-pointer transition-all duration-300 ${isExpanded ? 'bg-white/[0.03]' : 'hover:bg-white/[0.01]'}`}
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isExpanded ? 'bg-foreground text-background' : 'bg-foreground/5 text-foreground/30'}`}>
                                                <HelpCircle size={18} />
                                            </div>
                                            <h3 className={`font-bold transition-colors ${isExpanded ? 'text-foreground' : 'text-foreground/80'}`}>
                                                {faq.question}
                                            </h3>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <button
                                                onClick={(e) => deleteFAQ(e, faq.id)}
                                                className="p-2 text-red-500/80 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                            <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                                <ChevronDown size={18} className="text-foreground/20" />
                                            </div>
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                                className="overflow-hidden"
                                            >
                                                <div className="pt-6 mt-6 border-t border-white/5">
                                                    <p className="text-foreground/60 text-sm leading-relaxed whitespace-pre-line">
                                                        {faq.answer}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>

                    {data.faqs.length === 0 && (
                        <div className="py-20 text-center opacity-20 flex flex-col items-center gap-4 border border-dashed border-white/10 rounded-[1.5rem]">
                            <MessageCircle size={60} />
                            <p className="text-xl font-bold uppercase tracking-[0.2em]">No questions listed</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
