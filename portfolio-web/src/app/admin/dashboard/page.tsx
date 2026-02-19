"use client"

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getContent, updateContent } from "@/lib/actions";
import { Save, TrendingUp, Users, RefreshCw } from "lucide-react";

export default function AdminDashboard() {
    const [data, setData] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [stats, setStats] = useState({ views: "", clients: "" });

    useEffect(() => {
        async function load() {
            const content = await getContent();
            if (content) {
                setData(content);
                setStats(content.stats);
            }
        }
        load();
    }, []);

    const handleSave = async () => {
        if (!data) return;
        setIsSaving(true);

        const updatedData = {
            ...data,
            stats: stats
        };

        const result = await updateContent(updatedData);
        if (result.success) {
            setData(updatedData);
            // Show success toast (simplified)
            alert("Stats updated successfully!");
        } else {
            alert("Error updating stats: " + result.error);
        }
        setIsSaving(false);
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
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Dashboard Overview</h1>
                    <p className="text-foreground/40 mt-1 uppercase tracking-widest text-[9px] font-bold">Manage your core site metrics</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background font-bold text-xs uppercase tracking-widest shadow-lg shadow-foreground/5 disabled:opacity-50 transition-all"
                >
                    {isSaving ? (
                        <RefreshCw className="animate-spin" size={14} />
                    ) : (
                        <Save size={14} />
                    )}
                    <span>Save Changes</span>
                </motion.button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Views Stat */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-premium p-6 sm:p-8 rounded-[1.5rem] border border-white/5 relative group"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                            <TrendingUp size={24} />
                        </div>
                        <h2 className="text-xl font-bold">Views Generated</h2>
                    </div>

                    <div className="flex flex-col">
                        <input
                            type="text"
                            value={stats.views}
                            onChange={(e) => setStats({ ...stats, views: e.target.value })}
                            className="bg-foreground/[0.04] border border-foreground/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-foreground/20 outline-none transition-all text-2xl font-bold text-foreground"
                        />
                    </div>
                </motion.div>

                {/* Clients Stat */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-premium p-6 sm:p-8 rounded-[1.5rem] border border-white/5 relative group"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <Users size={24} />
                        </div>
                        <h2 className="text-xl font-bold">Clients Worked With</h2>
                    </div>

                    <div className="flex flex-col">
                        <input
                            type="text"
                            value={stats.clients}
                            onChange={(e) => setStats({ ...stats, clients: e.target.value })}
                            className="bg-foreground/[0.04] border border-foreground/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-foreground/20 outline-none transition-all text-2xl font-bold text-foreground"
                        />
                    </div>
                </motion.div>
            </div>

            {/* Quick Tips */}
            <div className="glass-premium p-6 sm:p-8 rounded-[1.25rem] border border-white/5 bg-white/[0.02]">
                <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/40 mb-4 ml-1">Dashboard Tip</h3>
                <p className="text-foreground/70 text-sm leading-relaxed">
                    Updating these numbers will instantly change the values shown in the <span className="text-foreground font-bold">StatsCard</span> on your homepage.
                    Use suffixes like <span className="bg-foreground/10 px-1.5 py-0.5 rounded font-mono text-foreground font-bold italic">M</span> or <span className="bg-foreground/10 px-1.5 py-0.5 rounded font-mono text-foreground font-bold italic">k</span> to keep it clean.
                </p>
            </div>
        </div>
    );
}
