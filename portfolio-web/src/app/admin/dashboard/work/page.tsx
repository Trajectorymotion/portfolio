"use client"

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getContent, updateContent } from "@/lib/actions";
import {
    Plus,
    Trash2,
    Edit2,
    Video,
    Folder,
    ChevronRight,
    ChevronLeft,
    Save,
    X,
    ExternalLink,
    RefreshCw,
    Play
} from "lucide-react";

export default function WorkAdmin() {
    const [data, setData] = useState<any>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [editModal, setEditModal] = useState<{ type: 'category' | 'video', id?: string, categoryId?: string } | null>(null);

    // Form States
    const [catForm, setCatForm] = useState({ title: "", description: "" });
    const [vidForm, setVidForm] = useState({ title: "", url: "", thumbnail: "" });

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
            setEditModal(null);
        } else {
            alert("Error: " + result.error);
        }
        setIsSaving(false);
    };

    // Category Handlers
    const addCategory = () => {
        if (!catForm.title) return;
        const newCat = {
            id: catForm.title.toLowerCase().replace(/\s+/g, '-'),
            title: catForm.title,
            description: catForm.description,
            videos: []
        };
        const updated = { ...data, categories: [...data.categories, newCat] };
        handleSave(updated);
        setCatForm({ title: "", description: "" });
    };

    const deleteCategory = (id: string) => {
        if (!confirm("Are you sure? This will delete all videos in this category.")) return;
        const updated = { ...data, categories: data.categories.filter((c: any) => c.id !== id) };
        if (selectedCategory === id) setSelectedCategory(null);
        handleSave(updated);
    };

    // Video Handlers
    const addVideo = (catId: string) => {
        if (!vidForm.title || !vidForm.url) return;

        // Auto-generate thumbnail
        let thumbnail = vidForm.thumbnail;
        if (!thumbnail) {
            const match = vidForm.url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
            if (match && match[1]) {
                thumbnail = `https://i.ytimg.com/vi/${match[1]}/hqdefault.jpg`;
            }
        }

        const newVid = {
            id: Math.random().toString(36).substr(2, 9),
            title: vidForm.title,
            url: vidForm.url,
            thumbnail: thumbnail
        };

        const updated = {
            ...data,
            categories: data.categories.map((c: any) =>
                c.id === catId ? { ...c, videos: [...c.videos, newVid] } : c
            )
        };
        handleSave(updated);
        setVidForm({ title: "", url: "", thumbnail: "" });
    };

    const deleteVideo = (catId: string, vidId: string) => {
        const updated = {
            ...data,
            categories: data.categories.map((c: any) =>
                c.id === catId ? { ...c, videos: c.videos.filter((v: any) => v.id !== vidId) } : c
            )
        };
        handleSave(updated);
    };

    if (!data) return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <RefreshCw className="animate-spin text-foreground/20" size={40} />
        </div>
    );

    const category = data.categories.find((c: any) => c.id === selectedCategory);

    return (
        <div className="space-y-8 sm:space-y-12">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                        {selectedCategory ? "Category Edits" : "Work Categories"}
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                        {selectedCategory && (
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className="text-foreground/40 hover:text-foreground flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest transition-colors"
                            >
                                <ChevronLeft size={12} /> Back to Categories
                            </button>
                        )}
                        {!selectedCategory && <p className="text-foreground/40 uppercase tracking-widest text-[9px] font-bold">Manage your portfolio playlists</p>}
                    </div>
                </div>
            </header>

            {!selectedCategory ? (
                // CATEGORIES VIEW
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.categories.map((cat: any, i: number) => (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="glass-premium p-6 rounded-[1.25rem] border border-white/5 flex flex-col group relative overflow-hidden"
                        >
                            <div className="flex items-start justify-between mb-3 relative z-10">
                                {(() => {
                                    const colors = [
                                        "bg-blue-500/10 text-blue-500",
                                        "bg-purple-500/10 text-purple-500",
                                        "bg-rose-500/10 text-rose-500",
                                        "bg-amber-500/10 text-amber-500",
                                        "bg-emerald-500/10 text-emerald-500",
                                        "bg-indigo-500/10 text-indigo-500"
                                    ];
                                    const colorClass = colors[i % colors.length];
                                    return (
                                        <div className={`w-10 h-10 rounded-xl ${colorClass} flex items-center justify-center`}>
                                            <Folder size={20} />
                                        </div>
                                    );
                                })()}
                                <button
                                    onClick={() => deleteCategory(cat.id)}
                                    className="p-2 text-red-500/80 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <h3 className="text-lg font-bold mb-1 relative z-10">{cat.title}</h3>
                            <p className="text-foreground/40 text-[13px] mb-4 line-clamp-2 relative z-10">{cat.description}</p>

                            <div className="flex items-center justify-between mt-auto relative z-10">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/30">
                                    {cat.videos.length} Videos
                                </span>
                                <button
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className="flex items-center gap-1 text-xs font-bold text-foreground/70 hover:text-foreground transition-all group/btn"
                                >
                                    Manage <ChevronRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
                                </button>
                            </div>

                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        </motion.div>
                    ))}

                    {/* ADD CATEGORY CARD */}
                    <div className="glass-premium p-8 rounded-[1.25rem] border border-dashed border-white/10 flex flex-col gap-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/40 ml-1">Add New Category</h3>
                        <input
                            placeholder="Category Title"
                            value={catForm.title}
                            onChange={(e) => setCatForm({ ...catForm, title: e.target.value })}
                            className="bg-foreground/[0.04] border border-foreground/5 rounded-xl px-4 py-3 outline-none focus:ring-1 ring-foreground/20 text-sm"
                        />
                        <textarea
                            placeholder="Description"
                            value={catForm.description}
                            onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                            rows={2}
                            className="bg-foreground/[0.04] border border-foreground/5 rounded-xl px-4 py-3 outline-none focus:ring-1 ring-foreground/20 text-sm resize-none"
                        />
                        <button
                            onClick={addCategory}
                            className="mt-2 w-full py-3 rounded-xl bg-foreground text-background font-bold text-xs flex items-center justify-center gap-2"
                        >
                            <Plus size={16} /> Create Category
                        </button>
                    </div>
                </div>
            ) : (
                // VIDEOS VIEW
                <div className="space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {category?.videos.map((vid: any, i: number) => (
                            <motion.div
                                key={vid.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className="glass-premium rounded-[1rem] overflow-hidden border border-white/5 group relative"
                            >
                                <div className="aspect-video relative overflow-hidden bg-foreground/10">
                                    <img
                                        src={vid.thumbnail}
                                        alt={vid.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Play className="text-white fill-white" size={40} />
                                    </div>
                                </div>
                                <div className="p-5 flex flex-col gap-3">
                                    <div>
                                        <h4 className="font-bold text-sm truncate mb-1">{vid.title}</h4>
                                        <a href={vid.url} target="_blank" className="text-foreground/30 text-[10px] font-bold uppercase tracking-widest hover:text-foreground transition-colors flex items-center gap-1">
                                            View on YouTube <ExternalLink size={10} />
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                                        <button
                                            onClick={() => {
                                                if (confirm(`Delete "${vid.title}"?`)) {
                                                    deleteVideo(category.id, vid.id);
                                                }
                                            }}
                                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest"
                                        >
                                            <Trash2 size={12} /> Delete
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {/* ADD VIDEO CARD */}
                        <div className="glass-premium p-6 rounded-[1rem] border border-dashed border-white/10 flex flex-col gap-3">
                            <div className="flex items-center gap-2 mb-2">
                                <Video size={16} className="text-foreground/40" />
                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Add New Video</h3>
                            </div>
                            <input
                                placeholder="Video Title"
                                value={vidForm.title}
                                onChange={(e) => setVidForm({ ...vidForm, title: e.target.value })}
                                className="bg-foreground/[0.04] border border-foreground/5 rounded-xl px-4 py-3 outline-none focus:ring-1 ring-foreground/20 text-xs"
                            />
                            <input
                                placeholder="YouTube URL"
                                value={vidForm.url}
                                onChange={(e) => setVidForm({ ...vidForm, url: e.target.value })}
                                className="bg-foreground/[0.04] border border-foreground/5 rounded-xl px-4 py-3 outline-none focus:ring-1 ring-foreground/20 text-xs font-mono"
                            />
                            <input
                                placeholder="Custom Thumbnail URL (Optional)"
                                value={vidForm.thumbnail}
                                onChange={(e) => setVidForm({ ...vidForm, thumbnail: e.target.value })}
                                className="bg-foreground/[0.04] border border-foreground/5 rounded-xl px-4 py-3 outline-none focus:ring-1 ring-foreground/20 text-xs font-mono"
                            />
                            <button
                                onClick={() => addVideo(category.id)}
                                className="mt-2 w-full py-3 rounded-xl bg-foreground text-background font-bold text-xs flex items-center justify-center gap-2"
                            >
                                <Plus size={16} /> Add Video
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
