"use client";

import { useRef, useEffect } from "react";

interface SvgMorphTransitionProps {
    progress: number; // 0-1, triggers morph when > 0.4
}

// Playbook document shape (closed path)
const PLAYBOOK_PATH =
    "M 30 10 L 70 10 L 70 85 L 30 85 Z " +
    "M 38 25 L 62 25 M 38 35 L 58 35 M 38 45 L 55 45 M 38 55 L 60 55";

// Radar / execution target shape (closed path)
const RADAR_PATH =
    "M 50 5 A 45 45 0 1 1 49.99 5 Z " +
    "M 50 20 A 30 30 0 1 1 49.99 20 Z " +
    "M 50 35 A 15 15 0 1 1 49.99 35 Z " +
    "M 50 50 L 50 5 M 5 50 L 95 50";

export default function SvgMorphTransition({ progress }: SvgMorphTransitionProps) {
    const morphRef = useRef<SVGPathElement>(null);
    const morphedRef = useRef(false);

    useEffect(() => {
        if (progress < 0.4 || morphedRef.current || !morphRef.current) return;
        morphedRef.current = true;

        import("kute.js").then((KUTE) => {
            const kute = KUTE.default || KUTE;
            if (!morphRef.current) return;

            // Create a hidden target path for the morph
            const svg = morphRef.current.closest("svg");
            if (!svg) return;

            const targetPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
            targetPath.setAttribute("d", RADAR_PATH);
            targetPath.style.display = "none";
            targetPath.id = "morph-target";
            svg.appendChild(targetPath);

            try {
                if (typeof kute.fromTo === "function") {
                    kute.fromTo(
                        morphRef.current,
                        { path: morphRef.current.getAttribute("d") },
                        { path: RADAR_PATH },
                        { duration: 1200, easing: "easingCubicInOut" }
                    ).start();
                } else if (typeof kute.to === "function") {
                    kute.to(morphRef.current, { path: RADAR_PATH }, { duration: 1200, easing: "easingCubicInOut" }).start();
                } else {
                    // Fallback: direct attribute animation via CSS
                    morphRef.current.style.transition = "d 1.2s cubic-bezier(0.65, 0, 0.35, 1)";
                    morphRef.current.setAttribute("d", RADAR_PATH);
                }
            } catch {
                // Fallback: just swap the path
                morphRef.current.setAttribute("d", RADAR_PATH);
            }

            return () => {
                targetPath.remove();
            };
        });
    }, [progress]);

    const opacity = progress > 0.2 ? Math.min(1, (progress - 0.2) * 3) : 0;
    const scale = 0.6 + progress * 0.4;

    return (
        <div
            className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
            style={{ opacity, transform: `scale(${scale})`, transition: "opacity 0.3s ease" }}
        >
            <svg
                viewBox="0 0 100 100"
                width="120"
                height="120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    ref={morphRef}
                    d={PLAYBOOK_PATH}
                    stroke="#f97316"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="rgba(249,115,22,0.08)"
                    style={{ filter: "drop-shadow(0 0 8px rgba(249,115,22,0.4))" }}
                />
            </svg>
        </div>
    );
}
