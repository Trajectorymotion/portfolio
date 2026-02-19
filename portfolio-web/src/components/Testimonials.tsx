"use client"

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpLeft } from "lucide-react";
import { DifferenceCard } from "./DifferenceCard";
import { ContactCard } from "./ContactCard";
import { FAQ } from "./FAQ";

interface Testimonial {
    name: string;
    review: string;
    image: string;
    category: string;
}

const TESTIMONIALS_CSV_URL = "/api/data?type=testimonials";

/**
 * Utility to convert Google Drive sharing links to direct image links
 */
const getGoogleDriveDirectLink = (url: string) => {
    if (!url || !url.includes('drive.google.com')) return url;

    // Extract ID from different Google Drive link formats
    const idMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
        url.match(/id=([a-zA-Z0-9_-]+)/);

    if (idMatch && idMatch[1]) {
        // Updated direct link format for Google Drive images
        return `https://lh3.googleusercontent.com/u/0/d/${idMatch[1]}`;
    }
    return url;
};

export function Testimonials() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const response = await fetch(TESTIMONIALS_CSV_URL);
                const csv = await response.text();
                const rows = csv.split("\n").slice(1); // Skip header

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

                setTestimonials(data);
            } catch (error) {
                console.error("Error fetching testimonials:", error);
            }
        };

        fetchTestimonials();
    }, []);

    // Memoize row for performance
    const firstRow = useMemo(() => [...testimonials, ...testimonials], [testimonials]);

    if (testimonials.length === 0) return null;

    return (
        <section className="pt-2 pb-8 overflow-hidden bg-background/50 relative">
            <div className="max-w-7xl mx-auto px-6 sm:px-10 mb-4 relative z-10">
                <div className="flex flex-col items-center text-center">
                    <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
                        Client Voices
                    </h2>
                    <p className="text-gray-400 max-w-2xl text-lg leading-relaxed">
                        What directors and brands say about working with me.
                    </p>
                </div>
            </div>

            {/* View All Button */}
            <div className="flex justify-center mt-6 mb-10 relative z-10">
                <Link href="/testimonials">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="glass px-6 py-2.5 rounded-xl text-foreground font-semibold hover:bg-white/10 transition-all text-sm flex items-center gap-2 border border-white/25 group shadow-xl"
                    >
                        <span>View All Reviews</span>
                        <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-colors">
                            <ArrowUpLeft className="w-3 h-3 text-foreground transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={3} />
                        </div>
                    </motion.div>
                </Link>
            </div>

            <div className="relative flex flex-col gap-10">
                {/* Gradient Fades for Strips - Localized to rows */}
                <div className="absolute inset-y-0 left-0 w-32 sm:w-64 bg-gradient-to-r from-background to-transparent z-20 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-32 sm:w-64 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none" />

                {/* Single Strip Marquee */}
                <div className="flex overflow-hidden">
                    <div className="flex gap-6 animate-marquee hover:[animation-play-state:paused] whitespace-nowrap">
                        {firstRow.map((t, i) => (
                            <TestimonialCard key={`row1-${i}`} testimonial={t} />
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex flex-col relative z-30">
                {/* FAQ */}
                <FAQ />

                {/* Difference Card */}
                <DifferenceCard />

                {/* Contact Card */}
                <ContactCard />
            </div>
        </section >
    );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
    const imageUrl = getGoogleDriveDirectLink(testimonial.image);

    return (
        <div
            className="glass group relative w-[320px] sm:w-[450px] rounded-[2.5rem] p-8 flex flex-col gap-5 border border-white/5 transition-all duration-500 hover:scale-[1.02] hover:bg-white/5 flex-shrink-0 cursor-default"
            style={{ willChange: "transform" }}
        >
            {/* Liquid Background highlight */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

            <p className="text-foreground/90 text-sm sm:text-[17px] leading-relaxed font-medium italic whitespace-normal">
                "{testimonial.review}"
            </p>

            <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center overflow-hidden border border-white/10 shadow-lg relative group-hover:border-white/20 transition-colors">
                    {testimonial.image ? (
                        <img
                            src={imageUrl}
                            alt={testimonial.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                                // Fallback if image fails to load
                                (e.target as HTMLImageElement).style.display = 'none';
                                (e.target as any).parentElement.innerHTML = `<div class="flex items-center justify-center w-full h-full text-white/40 text-xs font-bold uppercase">${testimonial.name.slice(0, 2)}</div>`;
                            }}
                        />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full text-white/40 text-xs font-bold uppercase">
                            {testimonial.name.slice(0, 2)}
                        </div>
                    )}
                </div>
                <div className="flex flex-col">
                    <span className="text-foreground font-bold text-base tracking-tight">{testimonial.name}</span>
                    <span className="text-gray-500 text-[11px] font-bold uppercase tracking-widest opacity-60">{testimonial.category}</span>
                </div>
            </div>
        </div>
    );
}
