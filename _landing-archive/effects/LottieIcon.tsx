"use client";

import { useRef, useEffect } from "react";

interface LottieIconProps {
    /** Inline Lottie JSON data */
    animationData: object;
    width?: number;
    height?: number;
    loop?: boolean;
    className?: string;
}

export default function LottieIcon({
    animationData,
    width = 48,
    height = 48,
    loop = true,
    className = "",
}: LottieIconProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let anim: { destroy: () => void } | null = null;

        import("lottie-web").then((lottie) => {
            const lottieLib = lottie.default || lottie;
            if (!container) return;

            anim = lottieLib.loadAnimation({
                container,
                renderer: "svg",
                loop,
                autoplay: true,
                animationData,
            });
        });

        return () => {
            anim?.destroy();
        };
    }, [animationData, loop]);

    return (
        <div
            ref={containerRef}
            className={className}
            style={{ width, height, display: "inline-flex" }}
        />
    );
}
