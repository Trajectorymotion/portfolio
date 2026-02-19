"use client"

import { motion, useInView, Variants } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface TextRevealProps {
    text: string;
    className?: string;
    delay?: number;
    stagger?: number;
}

export function TextReveal({ text, className, delay = 0, stagger = 0.05 }: TextRevealProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "0px" });

    const words = text.split(" ");

    const container: Variants = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: stagger, delayChildren: delay * i },
        }),
    };

    const child: Variants = {
        visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
        hidden: {
            opacity: 0,
            y: 20,
            filter: "blur(10px)",
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
    };

    return (
        <motion.div
            ref={ref}
            variants={container}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className={cn("flex flex-wrap", className)}
        >
            {words.map((word, index) => {
                const isAccent = word.startsWith("[") && word.endsWith("]");
                const cleanWord = isAccent ? word.slice(1, -1) : word;

                return (
                    <motion.span
                        variants={child}
                        key={index}
                        className={cn(
                            "mr-[0.25em] inline-block",
                            isAccent && "font-serif text-gray-400 font-light"
                        )}
                    >
                        {cleanWord}
                    </motion.span>
                );
            })}
        </motion.div>
    );
}
