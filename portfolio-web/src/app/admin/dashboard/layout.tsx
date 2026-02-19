"use client"

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Video,
    MessageSquare,
    HelpCircle,
    LogOut,
    ExternalLink
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();

    const menuItems = [
        { label: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
        { label: "Work & Videos", href: "/admin/dashboard/work", icon: Video },
        { label: "Testimonials", href: "/admin/dashboard/testimonials", icon: MessageSquare },
        { label: "FAQ", href: "/admin/dashboard/faq", icon: HelpCircle },
    ];

    const handleLogout = () => {
        document.cookie = "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
        router.push("/admin/login");
    };

    return (
        <div className="min-h-screen bg-background flex flex-col sm:flex-row">
            <aside className="w-full sm:w-72 sm:min-h-screen bg-background border-r border-white/5 p-6 flex flex-col z-20">
                <div className="flex items-center justify-between mb-10 px-2">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full liquid-icon overflow-hidden border border-foreground/10 bg-white dark:bg-black shadow-sm relative">
                            <img src="/favicontm.png" alt="Profile" className="w-full h-full object-cover scale-110 translate-y-1" />
                        </div>
                        <span className="font-bold tracking-tight text-foreground text-sm whitespace-nowrap">Trajectory motion</span>
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
                                    flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300
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

                <div className="mt-auto pt-6 flex flex-col gap-2">
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
            <main className="flex-grow p-6 sm:p-10 relative overflow-hidden">
                {/* Background Glows to match site */}
                <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-foreground/5 blur-[120px] rounded-full pointer-events-none -z-10" />

                <div className="max-w-6xl mx-auto relative z-10">
                    {children}
                </div>
            </main>
        </div >
    );
}
