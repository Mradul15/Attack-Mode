"use client";

import { useRef, useEffect } from "react";

export default function GridBackground() {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        const svg = svgRef.current;
        if (!svg) return;

        // Animate the grid mask radial gradient — slow breathing pulse
        const mask = svg.querySelector("#grid-fade") as SVGRadialGradientElement;
        if (!mask) return;

        let raf: number;
        const startTime = Date.now();

        function animate() {
            const elapsed = (Date.now() - startTime) * 0.001;

            // Pulse the mask radius between 50% and 70%
            const r = 55 + Math.sin(elapsed * 0.3) * 10;
            mask?.setAttribute("r", `${r}%`);

            // Shift the center slightly for organic drift
            const cx = 50 + Math.sin(elapsed * 0.15) * 3;
            const cy = 30 + Math.cos(elapsed * 0.2) * 4;
            mask?.setAttribute("cx", `${cx}%`);
            mask?.setAttribute("cy", `${cy}%`);

            // Pulse the grid line opacity
            const gridPattern = svg?.querySelector("#landing-grid path") as SVGPathElement;
            if (gridPattern) {
                const opacity = 0.025 + Math.sin(elapsed * 0.5) * 0.01;
                gridPattern.setAttribute("stroke", `rgba(255,255,255,${opacity})`);
            }

            raf = requestAnimationFrame(animate);
        }

        animate();

        return () => {
            cancelAnimationFrame(raf);
        };
    }, []);

    return (
        <div className="landing-grid-bg">
            <svg
                ref={svgRef}
                className="absolute inset-0 h-full w-full"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <pattern
                        id="landing-grid"
                        width="40"
                        height="40"
                        patternUnits="userSpaceOnUse"
                    >
                        <path
                            d="M 40 0 L 0 0 0 40"
                            fill="none"
                            stroke="rgba(255,255,255,0.03)"
                            strokeWidth="0.5"
                        />
                    </pattern>
                    <radialGradient id="grid-fade" cx="50%" cy="30%" r="60%">
                        <stop offset="0%" stopColor="white" stopOpacity="1" />
                        <stop offset="100%" stopColor="white" stopOpacity="0" />
                    </radialGradient>
                    <mask id="grid-mask">
                        <rect width="100%" height="100%" fill="url(#grid-fade)" />
                    </mask>
                </defs>
                <rect
                    width="100%"
                    height="100%"
                    fill="url(#landing-grid)"
                    mask="url(#grid-mask)"
                />
            </svg>
        </div>
    );
}
