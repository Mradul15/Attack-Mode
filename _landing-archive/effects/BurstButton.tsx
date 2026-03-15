"use client";

import Link from "next/link";
import { useRef, useCallback, type ReactNode } from "react";

interface BurstButtonProps {
    children: ReactNode;
    className?: string;
    href?: string;
}

export default function BurstButton({ children, className = "", href }: BurstButtonProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const handleClick = useCallback((e: React.MouseEvent) => {
        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        import("@mojs/core").then((mojs) => {
            const Mojs = mojs.default || mojs;

            // Burst of particles from click point
            const burst = new Mojs.Burst({
                parent: container,
                left: x,
                top: y,
                radius: { 0: 60 },
                count: 8,
                children: {
                    shape: "circle",
                    fill: ["#f97316", "#fb923c", "#fbbf24", "#22c55e"],
                    radius: { 6: 0 },
                    duration: 700,
                    easing: "cubic.out",
                    opacity: { 1: 0 },
                },
            });

            // Ring ripple
            const ring = new Mojs.Shape({
                parent: container,
                left: x,
                top: y,
                shape: "circle",
                stroke: "#f97316",
                strokeWidth: { 3: 0 },
                fill: "none",
                radius: { 0: 40 },
                opacity: { 0.6: 0 },
                duration: 600,
                easing: "cubic.out",
            });

            burst.play();
            ring.play();
        });
    }, []);

    return (
        <div ref={containerRef} className="relative" style={{ overflow: "visible" }}>
            {href ? (
                <Link href={href} className={className} onClick={handleClick} style={{ position: "relative", zIndex: 1 }}>
                    {children}
                </Link>
            ) : (
                <div className={className} onClick={handleClick} style={{ position: "relative", zIndex: 1 }}>
                    {children}
                </div>
            )}
        </div>
    );
}
