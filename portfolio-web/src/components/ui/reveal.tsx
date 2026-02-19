"use client"

import React, { useEffect, useRef } from "react";
import { motion, useInView, useAnimation, Variant } from "framer-motion";

interface RevealProps {
    children: React.ReactNode;
    width?: "fit-content" | "100%";
    delay?: number;
    duration?: number;
    y?: number;
    overflow?: "hidden" | "visible";
}

export const Reveal = ({
    children,
    width = "fit-content",
    delay = 0.2,
    duration = 0.5,
    y = 75,
    overflow = "hidden"
}: RevealProps) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    const mainControls = useAnimation();

    useEffect(() => {
        if (isInView) {
            mainControls.start("visible");
        }
    }, [isInView, mainControls]);

    return (
        <div ref={ref} style={{ position: "relative", width, overflow }}>
            <motion.div
                variants={{
                    hidden: { opacity: 0, y: y },
                    visible: { opacity: 1, y: 0 },
                }}
                initial="hidden"
                animate={mainControls}
                transition={{ duration: duration, delay: delay, ease: [0.33, 1, 0.68, 1] }}
            >
                {children}
            </motion.div>
        </div>
    );
};
