"use client"

import { useEffect, useState } from "react";
import { Reveal } from "@/components/ui/reveal";
import { BackButton } from "@/components/ui/back-button";
import { TextReveal } from "@/components/ui/text-reveal";

interface Testimonial {
    name: string;
    review: string;
    image: string;
    category: string;
}

const TESTIMONIALS_CSV_URL = "/api/data?type=testimonials";

const getGoogleDriveDirectLink = (url: string) => {
    if (!url || !url.includes('drive.google.com')) return url;
    const idMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
    if (idMatch && idMatch[1]) {
        return `https://lh3.googleusercontent.com/u/0/d/${idMatch[1]}`;
    }
    return url;
};

export default function AllTestimonialsPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const response = await fetch(TESTIMONIALS_CSV_URL);
                const csv = await response.text();
                const rows = csv.split("\n").slice(1);

                const data = rows.map(row => {
                    const cols = row.match(/(".*?"|[^",\r\n]+)(?=\s*,|\s*$)/g);
                    if (!cols || cols.length < 3) return null;
                    return {
                        name: cols[0].replace(/^"|"$/g, '').trim(),
                        review: cols[1].replace(/^"|"$/g, '').trim(),
                        image: cols[2].replace(/^"|"$/g, '').trim(),
                        category: (cols[3] || "Modern Leader").replace(/^"|"$/g, '').trim()
                    };
                }).filter((t): t is Testimonial => t !== null && t.review !== "");

                setTestimonials(data.reverse()); // Newest First (Last Come First Serve)
            } catch (error) {
                console.error("Error fetching testimonials:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTestimonials();
    }, []);

    return (
        <main className="min-h-screen bg-background selection:bg-foreground selection:text-background pb-32 pt-24 sm:pt-32 px-6 sm:px-10">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-8 mb-20">
                    <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                        <BackButton className="mb-8" />
                        <TextReveal
                            text="Client Voices"
                            className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground mb-4"
                        />
                        <p className="text-gray-400 max-w-xl text-lg leading-relaxed">
                            A complete collection of reviews and feedback from directors, brands, and creators I've collaborated with.
                        </p>
                    </div>

                    <div className="hidden sm:flex flex-col items-end">
                        <div className="text-5xl font-serif text-foreground/20 italic select-none">
                            Trust resides here.
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-foreground/10 border-t-foreground rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {testimonials.map((t, i) => (
                            <Reveal key={i} delay={i * 0.05} y={20} width="100%">
                                <div className="glass group relative w-full h-full rounded-[2.5rem] p-8 flex flex-col gap-6 border border-white/5 transition-all duration-500 hover:bg-white/5 hover:border-white/10 hover:scale-[1.02]">
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

                                    <p className="text-foreground/90 text-[15px] sm:text-[17px] leading-relaxed font-medium italic">
                                        "{t.review}"
                                    </p>

                                    <div className="flex items-center gap-4 mt-auto">
                                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center overflow-hidden border border-white/10 shadow-lg relative shrink-0">
                                            {t.image ? (
                                                <img
                                                    src={getGoogleDriveDirectLink(t.image)}
                                                    alt={t.name}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    referrerPolicy="no-referrer"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center w-full h-full text-white/40 text-xs font-bold uppercase">
                                                    {t.name.slice(0, 2)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-foreground font-bold text-base tracking-tight">{t.name}</span>
                                            <span className="text-gray-500 text-[11px] font-bold uppercase tracking-widest opacity-60">{t.category}</span>
                                        </div>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
