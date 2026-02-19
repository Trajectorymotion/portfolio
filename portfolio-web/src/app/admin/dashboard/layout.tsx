"use client"

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Video,
    MessageSquare,
    HelpCircle,
    LogOut,
    ExternalLink,
    Star,
    Settings,
    Menu,
    X,
    ChevronDown
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { getContent } from "@/lib/actions";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [settings, setSettings] = useState<any>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        async function load() {
            const content = await getContent();
            if (content?.settings) setSettings(content.settings);
        }
        load();
    }, []);

    const menuItems = [
        { label: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
        { label: "Work & Videos", href: "/admin/dashboard/work", icon: Video },
        { label: "Testimonials", href: "/admin/dashboard/testimonials", icon: MessageSquare },
        { label: "Social Links", href: "/admin/dashboard/socials", icon: Star },
        { label: "FAQ", href: "/admin/dashboard/faq", icon: HelpCircle },
        { label: "Global Settings", href: "/admin/dashboard/settings", icon: Settings },
    ];

    const handleLogout = () => {
        document.cookie = "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
        router.push("/admin/login");
    };

    const activeItem = menuItems.find(item => item.href === pathname);

    return (
        <div className="min-h-screen bg-background flex flex-col sm:flex-row">
            {/* Mobile Floating Pill Navbar */}
            <div className="sm:hidden sticky top-4 z-50 px-4 pointer-events-none">
                <header className="flex items-center justify-between p-3 bg-background/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl pointer-events-auto">
                    <div className="flex items-center gap-3 ml-1">
                        <div className="w-9 h-9 rounded-full liquid-icon overflow-hidden border border-white/10 bg-white/5 relative">
                            <img src={settings?.logo_url || "/favicontm.png"} alt="Logo" className="w-full h-full object-cover" />
                        </div>
                        <span className="font-bold tracking-tight text-foreground text-[10px] uppercase tracking-widest opacity-80">{settings?.site_name || "Trajectory motion"}</span>
                    </div>

                    <div className="flex items-center gap-2 pr-1">
                        <ThemeToggle />
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="w-10 h-10 flex items-center justify-center rounded-xl liquid-icon text-foreground"
                        >
                            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </header>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 sm:hidden"
                        />
                        <motion.div
                            initial={{ y: "-20%", opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: "-20%", opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-24 left-4 right-4 bg-background/95 backdrop-blur-2xl border border-white/10 z-40 p-6 pb-8 flex flex-col sm:hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[2rem]"
                        >
                            <nav className="flex flex-col gap-1 relative z-10">
                                {menuItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = pathname === item.href;

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`
                                                flex items-center gap-3 px-4 py-4 rounded-xl transition-all duration-300
                                                ${isActive
                                                    ? "bg-foreground/10 text-foreground scale-[1.02]"
                                                    : "text-foreground/50 hover:bg-foreground/5 hover:text-foreground/80"}
                                            `}
                                        >
                                            <Icon size={18} className={isActive ? "text-foreground" : "text-foreground/40"} />
                                            <span className="font-bold text-sm tracking-tight">{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </nav>

                            <div className="mt-6 pt-6 flex flex-col gap-2 border-t border-white/5 relative z-10">
                                <div className="grid grid-cols-2 gap-3">
                                    <a
                                        href="/"
                                        target="_blank"
                                        className="flex items-center justify-center gap-2 py-3 rounded-xl bg-foreground/[0.04] border border-white/5 text-foreground/70 hover:text-foreground transition-all text-sm font-bold"
                                    >
                                        <ExternalLink size={16} />
                                        <span>Website</span>
                                    </a>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-all text-sm font-bold"
                                    >
                                        <LogOut size={16} />
                                        <span>Log Out</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar */}
            <aside className="hidden sm:flex w-72 min-h-screen bg-background border-r border-white/5 p-6 flex-col z-20 sticky top-0">
                <div className="flex items-center justify-between mb-10 px-2">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full liquid-icon overflow-hidden border border-foreground/10 bg-white dark:bg-black shadow-sm relative">
                            <img src={settings?.logo_url || "/favicontm.png"} alt="Logo" className="w-full h-full object-cover" />
                        </div>
                        <span className="font-bold tracking-tight text-foreground text-sm whitespace-nowrap">{settings?.site_name || "Trajectory motion"}</span>
                    </div>
                    <ThemeToggle />
                </div>

                <nav className="flex flex-col gap-2 flex-grow">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`
                                    flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 relative
                                    ${isActive
                                        ? "bg-foreground/10 text-foreground"
                                        : "text-foreground/50 hover:bg-foreground/5 hover:text-foreground/80"}
                                `}
                            >
                                <Icon size={20} />
                                <span className="font-medium text-sm">{item.label}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="active-pill"
                                        className="absolute left-0 w-1 h-6 bg-foreground rounded-r-full"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto pt-6 flex flex-col gap-2 border-t border-white/5">
                    <a
                        href="/"
                        target="_blank"
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl text-foreground/50 hover:text-foreground/80 transition-all text-sm group"
                    >
                        <ExternalLink size={20} />
                        <span>View Website</span>
                    </a>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 hover:text-red-600 hover:bg-red-500/5 transition-all text-sm group"
                    >
                        <LogOut size={20} />
                        <span>Log Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow p-6 pt-20 sm:pt-10 relative overflow-hidden">
                {/* Background Glows to match site */}
                <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-foreground/5 blur-[120px] rounded-full pointer-events-none -z-10" />

                <div className="max-w-6xl mx-auto relative z-10">
                    {children}
                </div>
            </main>
        </div >
    );
}
