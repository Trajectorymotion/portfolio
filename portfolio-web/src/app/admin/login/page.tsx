"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { verifyAdminPassword } from "@/lib/actions";

export default function AdminLoginPage() {
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");

        const isValid = await verifyAdminPassword(password);
        if (isValid) {
            // In a real app, we'd set a session cookie here
            // For now, we'll use a simple localStorage flag for client-side persistence
            // and a cookie via a server action if we wanted full protection.
            // Let's set a simple cookie via document.cookie for now.
            document.cookie = `admin_session=true; path=/; max-age=86400`; // 24h
            router.push("/admin/dashboard");
        } else {
            setStatus("error");
            setTimeout(() => setStatus("idle"), 2000);
        }
    };

    return (
        <main className="min-h-screen bg-background flex items-center justify-center px-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full glass-premium p-10 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden"
            >
                {/* Background Glow */}
                <div className="absolute top-[-20%] left-[-10%] w-[30rem] h-[30rem] bg-white/[0.03] blur-[100px] rounded-full pointer-events-none" />

                <div className="relative z-10 text-center mb-10">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground mb-4">Admin Access</h1>
                    <p className="text-foreground/50 text-sm">Enter password to manage your portfolio content.</p>
                </div>

                <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-foreground/70 ml-1">Password</label>
                        <input
                            required
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className={`bg-foreground/[0.04] border ${status === "error" ? "border-red-500/50" : "border-foreground/10"} rounded-2xl px-5 py-4 focus:ring-2 focus:ring-foreground/20 outline-none transition-all placeholder:text-foreground/20 text-foreground font-medium`}
                        />
                        {status === "error" && (
                            <motion.span
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-500 text-xs font-bold mt-1 ml-1"
                            >
                                Invalid password
                            </motion.span>
                        )}
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={status === "loading"}
                        className="liquid-icon py-4 rounded-2xl font-bold relative overflow-hidden group"
                    >
                        {status === "loading" ? (
                            <div className="w-5 h-5 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin mx-auto" />
                        ) : (
                            <span className="text-foreground">Enter Dashboard</span>
                        )}
                    </motion.button>
                </form>
            </motion.div>
        </main>
    );
}
