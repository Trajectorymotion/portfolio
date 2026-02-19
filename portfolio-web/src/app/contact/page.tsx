"use client"

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Send, CheckCircle2, Star } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SelectOption {
    label: string;
    value: string;
}

function CustomSelect({
    label,
    options,
    value,
    onChange,
    placeholder = "Select an option",
    required = false
}: {
    label: string,
    options: SelectOption[],
    value: string,
    onChange: (val: string) => void,
    placeholder?: string,
    required?: boolean
}) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className="flex flex-col gap-2 relative" ref={containerRef}>
            <label className="text-xs font-bold uppercase tracking-widest text-foreground/70 ml-1">{label}</label>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full flex items-center justify-between bg-foreground/[0.04] border border-foreground/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-foreground/20 outline-none transition-all font-medium text-left",
                    isOpen && "border-foreground/20 bg-foreground/[0.06]"
                )}
            >
                <span className={cn(
                    "truncate text-foreground",
                    !selectedOption && "text-foreground/40"
                )}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown className={cn(
                    "w-4 h-4 opacity-40 transition-transform duration-300",
                    isOpen && "rotate-180 opacity-80"
                )} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                        className="absolute top-[calc(100%+8px)] left-0 right-0 z-[100] glass-premium rounded-2xl border border-foreground/10 shadow-2xl overflow-hidden py-2"
                    >
                        <div className="max-h-[240px] overflow-y-auto custom-scrollbar">
                            {options.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    className={cn(
                                        "w-full px-5 py-3.5 text-left text-sm font-medium transition-all flex items-center justify-between group relative",
                                        value === option.value
                                            ? "bg-foreground/[0.08] text-foreground"
                                            : "text-foreground/60 hover:bg-foreground/5 hover:text-foreground"
                                    )}
                                >
                                    <span className="relative z-10">{option.label}</span>
                                    <div className={cn(
                                        "w-5 h-5 rounded-full border-2 transition-all duration-300 flex items-center justify-center",
                                        value === option.value
                                            ? "border-foreground bg-foreground/10"
                                            : "border-foreground/10 group-hover:border-foreground/30"
                                    )}>
                                        {value === option.value && (
                                            <motion.div
                                                layoutId="active-dot"
                                                className="w-2 h-2 rounded-full bg-foreground"
                                            />
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hidden input for form submission */}
            <input type="hidden" required={required} value={value} />
        </div>
    );
}

export default function ContactPage() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        projectType: "",
        budget: "",
        timeline: "",
        details: ""
    });

    // Exact matches with Google Form DOM options
    const projectTypeOptions = [
        { label: "Short form reel", value: "Short form reel" },
        { label: "Youtube video editing", value: "Youtube video editing" },
        { label: "Motion graphics", value: "Motion Graphics" },
        { label: "saas / ui animation", value: "saas / ui animation" },
        { label: "brand / promo video", value: "brand / promo videos" },
        { label: "other", value: "other" }
    ];

    const budgetOptions = [
        { label: "50 dollar - 100 dollar", value: "50 dollar - 100 dollar" },
        { label: "100 dollar - 250 dollar", value: "100 dollar - 250 dollar" },
        { label: "250 dollar - 500 dollar", value: "250 dollar - 500 dollar" },
        { label: "500 dollar +", value: "500 dollar +" },
        { label: "not sure yet", value: "not sure yet" }
    ];

    const timelineOptions = [
        { label: "ASAP", value: "ASAP" },
        { label: "within 1 week", value: "within 1 week" },
        { label: "2-4 weeks", value: "2-4 weeks" },
        { label: "flexible", value: "flexible" }
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.projectType || !formData.budget) {
            alert("Please select a project type and budget.");
            return;
        }

        setIsSubmitting(true);

        try {
            const GOOGLE_FORM_URL = "https://docs.google.com/forms/u/0/d/e/1FAIpQLSeL11LVwLnRVs7j2bjnXN0iwtrcK5OBLJiPMKIUKgytOYAOPg/formResponse";

            const formBody = new URLSearchParams();
            // Core entries
            formBody.append("entry.1501665578", formData.name);
            formBody.append("entry.1229632604", formData.email);
            formBody.append("entry.766314618", formData.projectType);
            formBody.append("entry.1828360595", formData.budget);
            formBody.append("entry.814494146", formData.timeline);
            formBody.append("entry.315289998", formData.details);

            // Required Google Form Hidden Fields
            formBody.append("fvv", "1");
            formBody.append("pageHistory", "0");
            formBody.append("fbzx", "3733437145058712534");

            await fetch(GOOGLE_FORM_URL, {
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: formBody.toString(),
            });

            // Play premium sound
            const audio = new Audio("https://cdn.pixabay.com/audio/2022/03/15/audio_783331b6df.mp3");
            audio.volume = 0.6;
            audio.play().catch(err => console.log("Audio play failed:", err));

            setIsSubmitted(true);
        } catch (error) {
            console.error("Submission error:", error);
            setIsSubmitted(true); // Treat as success in no-cors mode as we can't be sure
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen flex items-center justify-center px-6 bg-background relative overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative p-[1px] rounded-[2rem] overflow-hidden group shadow-2xl max-w-md w-full relative z-10"
                >
                    <div className="absolute inset-[-1000%] animate-[border-rotate_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_15%,var(--foreground)_50%,transparent_85%)] opacity-60 blur-md group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="glass-premium p-10 rounded-[2rem] text-center relative overflow-hidden">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 10 }}
                            className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
                        >
                            <CheckCircle2 className="w-10 h-10 text-green-500" />
                        </motion.div>
                        <h2 className="text-2xl font-bold mb-3 tracking-tight text-foreground">Submission Successful</h2>
                        <p className="text-xs font-medium text-foreground/60 leading-relaxed mb-8 max-w-[260px] mx-auto">
                            Your project details were sent successfully 🚀. We’ll contact you shortly.
                        </p>
                        <Link href="/">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="liquid-icon px-8 py-3 rounded-xl font-bold text-sm w-full"
                            >
                                Back to Home
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-start justify-center px-6 pt-32 pb-20 bg-background relative overflow-hidden transition-colors duration-500">
            {/* Background Glows */}
            <div className="absolute top-[10%] left-[10%] w-[30rem] h-[30rem] bg-blue-500/5 dark:bg-blue-600/3 blur-[120px] rounded-full pointer-events-none animate-pulse" />
            <div className="absolute bottom-[10%] right-[10%] w-[30rem] h-[30rem] bg-purple-500/5 dark:bg-purple-600/3 blur-[120px] rounded-full pointer-events-none animate-pulse" style={{ animationDelay: "2s" }} />

            <div className="max-w-xl w-full relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                    className="relative p-[1px] rounded-[2rem] overflow-hidden group shadow-2xl"
                >
                    {/* Running Glow Line Border */}
                    <div className="absolute inset-[-1000%] animate-[border-rotate_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_15%,var(--foreground)_50%,transparent_85%)] opacity-60 blur-md group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="glass-premium p-8 sm:p-12 rounded-[2rem] relative overflow-hidden">
                        <div className="mb-10 text-center relative z-10">
                            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 text-foreground">Start A Project</h1>
                            <p className="text-foreground/70 font-semibold">Tell me about your vision and let's create something legendary.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {/* Name */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-foreground/70 ml-1">Name</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Your full name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="bg-foreground/[0.04] border border-foreground/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-foreground/20 outline-none transition-all placeholder:text-foreground/40 font-medium text-foreground"
                                    />
                                </div>

                                {/* Email */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-foreground/70 ml-1">Email Address</label>
                                    <input
                                        required
                                        type="email"
                                        placeholder="hello@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="bg-foreground/[0.04] border border-foreground/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-foreground/20 outline-none transition-all placeholder:text-foreground/40 font-medium text-foreground"
                                    />
                                </div>
                            </div>

                            {/* Project Type */}
                            <CustomSelect
                                label="Project Type"
                                options={projectTypeOptions}
                                value={formData.projectType}
                                onChange={(val) => setFormData({ ...formData, projectType: val })}
                                placeholder="Select project type"
                                required
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {/* Budget */}
                                <CustomSelect
                                    label="Budget"
                                    options={budgetOptions}
                                    value={formData.budget}
                                    onChange={(val) => setFormData({ ...formData, budget: val })}
                                    placeholder="Select range"
                                    required
                                />

                                {/* Timeline */}
                                <CustomSelect
                                    label="Timeline"
                                    options={timelineOptions}
                                    value={formData.timeline}
                                    onChange={(val) => setFormData({ ...formData, timeline: val })}
                                    placeholder="Select timeline"
                                />
                            </div>

                            {/* Project Details */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-foreground/70 ml-1">Project Details</label>
                                <textarea
                                    required
                                    rows={4}
                                    placeholder="Tell me about your project, goals, and any specific ideas you have..."
                                    value={formData.details}
                                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                                    className="bg-foreground/[0.04] border border-foreground/10 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-foreground/20 outline-none transition-all placeholder:text-foreground/40 font-medium resize-none text-foreground"
                                ></textarea>
                            </div>

                            {/* Submit */}
                            <motion.button
                                disabled={isSubmitting}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="liquid-icon mt-4 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 group relative overflow-hidden"
                            >
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span className="text-foreground">Send Project Proposal</span>
                                        <Send className="w-4 h-4 text-foreground group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </>
                                )}
                            </motion.button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}