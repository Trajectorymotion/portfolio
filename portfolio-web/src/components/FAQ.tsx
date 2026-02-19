"use client"

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Plus } from "lucide-react";

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQProps {
    faqs: FAQItem[];
}

export function FAQ({ faqs }: FAQProps) {
    const [isMasterOpen, setIsMasterOpen] = useState(false);
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    if (faqs.length === 0) return null;

    return (
        <section className="pt-2 pb-8 px-6 sm:px-10 max-w-4xl mx-auto flex flex-col items-center">
            <div className="w-full max-w-[550px]">
                {/* Master Dropdown Trigger - Rounded Pill with Lower Radius */}
                <motion.div
                    layout
                    className="glass-premium rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_0_20px_rgba(255,255,255,0.02)] cursor-pointer group relative overflow-hidden"
                    onClick={() => setIsMasterOpen(!isMasterOpen)}
                    whileHover={{ scale: 1.01, borderColor: "rgba(255,255,255,0.15)" }}
                    whileTap={{ scale: 0.99 }}
                >
                    {/* Real Glass Texture (Subtle Noise) */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />

                    {/* Liquid Glow Highlight */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                    {/* Minimal Inner Glow */}
                    <div className="absolute inset-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] pointer-events-none" />

                    <div className="px-8 py-3 flex items-center justify-between gap-6 relative z-10">
                        <h2 className="text-sm sm:text-base font-bold text-foreground/90 tracking-tight transition-colors group-hover:text-foreground whitespace-nowrap">
                            Everything you need to know
                        </h2>
                        <motion.div
                            animate={{ rotate: isMasterOpen ? 180 : 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="w-10 h-10 rounded-xl bg-white/5 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:border-white/40 transition-colors shadow-lg"
                        >
                            <ChevronDown className="w-5 h-5 text-foreground/70 group-hover:text-foreground transition-colors" />
                        </motion.div>
                    </div>
                </motion.div>

                {/* FAQ List Content */}
                <AnimatePresence>
                    {isMasterOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0, scale: 0.98 }}
                            animate={{
                                height: "auto",
                                opacity: 1,
                                scale: 1,
                                transition: {
                                    height: { duration: 0.5, ease: [0.23, 1, 0.32, 1] },
                                    opacity: { duration: 0.4, delay: 0.1 },
                                    scale: { duration: 0.4, delay: 0.1 }
                                }
                            }}
                            exit={{
                                height: 0,
                                opacity: 0,
                                scale: 0.98,
                                transition: {
                                    height: { duration: 0.4, ease: [0.23, 1, 0.32, 1] },
                                    opacity: { duration: 0.2 },
                                    scale: { duration: 0.2 }
                                }
                            }}
                            className="overflow-hidden"
                        >
                            <div className="mt-5 px-2 pb-10 flex flex-col gap-3">
                                {faqs.map((faq, index) => (
                                    <FAQItemComponent
                                        key={index}
                                        faq={faq}
                                        isOpen={openIndex === index}
                                        onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}

function FAQItemComponent({ faq, isOpen, onClick }: { faq: FAQItem, isOpen: boolean, onClick: () => void }) {
    return (
        <motion.div
            layout
            initial={false}
            className="glass bg-white/[0.01] border-white/5 overflow-hidden rounded-[1.25rem] shadow-sm group cursor-pointer"
            onClick={onClick}
        >
            <div className="px-6 py-4 flex items-center justify-between gap-4">
                <span className="text-foreground/70 font-semibold text-base sm:text-lg tracking-tight leading-snug group-hover:text-foreground/90 transition-colors">
                    {faq.question}
                </span>
                <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-colors"
                >
                    <Plus className="w-4 h-4 text-foreground/40 group-hover:text-foreground/80 transition-colors" />
                </motion.div>
            </div>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                            height: "auto",
                            opacity: 1,
                            transition: {
                                height: { duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] },
                                opacity: { duration: 0.3, delay: 0.1 }
                            }
                        }}
                        exit={{
                            height: 0,
                            opacity: 0,
                            transition: {
                                height: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] },
                                opacity: { duration: 0.2 }
                            }
                        }}
                    >
                        <div className="px-6 pb-5 pt-1">
                            <motion.p
                                initial={{ filter: "blur(10px)", y: 10, opacity: 0 }}
                                animate={{
                                    filter: "blur(0px)",
                                    y: 0,
                                    opacity: 1,
                                    transition: {
                                        type: "spring",
                                        stiffness: 100,
                                        damping: 15,
                                        mass: 1,
                                        delay: 0.1
                                    }
                                }}
                                className="text-foreground/50 text-sm sm:text-base leading-relaxed font-medium"
                            >
                                {faq.answer}
                            </motion.p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
