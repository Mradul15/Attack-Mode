"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import IntroText, { IntroTextRefs } from "./overlays/IntroText";
import FlashOverlay from "./overlays/FlashOverlay";
import type { IntroCanvasControls } from "./canvas/IntroCanvas";

const IntroCanvas = dynamic(() => import("./canvas/IntroCanvas"), { ssr: false });

interface IntroExperienceProps {
    onComplete: () => void;
}

export default function IntroExperience({ onComplete }: IntroExperienceProps) {
    const [done, setDone] = useState(false);
    const onCompleteRef = useRef(onComplete);
    onCompleteRef.current = onComplete;

    const canvasRef = useRef<IntroCanvasControls>(null);
    const textRef = useRef<IntroTextRefs>(null);
    const flashRef = useRef<HTMLDivElement>(null);

    // Scroll lock while intro plays
    useEffect(() => {
        if (done) return;
        window.scrollTo(0, 0);
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, [done]);

    // GSAP timeline — single source of truth for all animation
    useEffect(() => {
        if (done) return;

        let cancelled = false;
        let tl: gsap.core.Timeline | null = null;

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        import("gsap").then((gsapMod) => {
            if (cancelled) return;
            const gsap = gsapMod.default;

            const canvas = canvasRef.current;
            const text = textRef.current;
            const flash = flashRef.current;

            if (!text?.title || !text?.tagline || !flash) return;

            // Reduced motion: simple text fade-in, no particles
            if (prefersReducedMotion || !canvas) {
                tl = gsap.timeline({
                    onComplete: () => {
                        if (!cancelled) {
                            setDone(true);
                            onCompleteRef.current();
                        }
                    },
                });
                tl.to(text.title, {
                    opacity: 1, scale: 1, duration: 1.2, ease: "power2.out",
                }, 0.3);
                tl.to(text.tagline, {
                    opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
                }, 0.8);
                tl.to({}, { duration: 0.5 }); // brief hold
                return;
            }

            // Full cinematic timeline
            const particles = canvas.particles;
            const ripple = canvas.ripple;

            tl = gsap.timeline({
                onComplete: () => {
                    if (!cancelled) {
                        setDone(true);
                        onCompleteRef.current();
                    }
                },
            });

            // ─── Beat 1: Void (0–0.8s) ───
            tl.to(particles, {
                glow: 0.05,
                duration: 0.8,
                ease: "power2.inOut",
            }, 0);

            // ─── Beat 2: Signal Fragmentation (0.8–2.2s) ───
            tl.to(particles, {
                convergence: 0.3,
                duration: 1.4,
                ease: "power1.in",
            }, 0.8);
            tl.to(particles, {
                glow: 0.18,
                duration: 1.4,
                ease: "power1.inOut",
            }, 0.8);

            // ─── Beat 3: Escalation Ripple (2.2–3.4s) ───
            // First ripple
            tl.to(ripple, {
                radius: 0.5,
                duration: 1.2,
                ease: "power1.out",
            }, 2.2);
            tl.to(ripple, {
                strength: 1.0,
                duration: 0.4,
                ease: "power2.out",
            }, 2.2);
            tl.to(ripple, {
                strength: 0,
                duration: 0.5,
                ease: "power1.in",
            }, 2.6);
            // Second ripple (stronger)
            tl.to(ripple, {
                radius: 0.1,
                strength: 0,
                duration: 0.01,
            }, 3.0);
            tl.to(ripple, {
                radius: 0.6,
                duration: 0.8,
                ease: "power1.out",
            }, 3.02);
            tl.to(ripple, {
                strength: 1.4,
                duration: 0.3,
                ease: "power2.out",
            }, 3.02);
            tl.to(ripple, {
                strength: 0,
                duration: 0.5,
                ease: "power1.in",
            }, 3.32);
            // Particles accelerate inward
            tl.to(particles, {
                convergence: 0.6,
                duration: 1.2,
                ease: "power1.in",
            }, 2.2);
            tl.to(particles, {
                glow: 0.35,
                duration: 1.2,
                ease: "power2.inOut",
            }, 2.2);

            // ─── Beat 4: Compression (3.4–4.2s) ───
            tl.to(particles, {
                convergence: 1.0,
                duration: 0.8,
                ease: "power4.in",
            }, 3.4);
            tl.to(particles, {
                glow: 0.65,
                duration: 0.8,
                ease: "power3.in",
            }, 3.4);
            tl.to(canvas, {
                shake: 1,
                duration: 0.6,
                ease: "power2.in",
            }, 3.6);

            // ─── Beat 5: Flash + Blast + Reveal (4.2–5.8s) ───
            // Flash — sharp white spike
            tl.to(flash, {
                opacity: 0.9,
                duration: 0.12,
                ease: "power3.in",
            }, 4.2);
            tl.to(flash, {
                opacity: 0,
                duration: 0.5,
                ease: "power2.out",
            }, 4.32);
            // Shake subsides during flash
            tl.to(canvas, {
                shake: 0,
                duration: 0.2,
                ease: "power1.out",
            }, 4.2);

            // BLAST — particles explode outward from center
            // They reappear bright right as flash clears
            tl.to(particles, {
                particleFade: 0,
                duration: 0.1,
            }, 4.2);
            tl.to(particles, {
                particleFade: 0.85,
                duration: 0.2,
                ease: "power2.out",
            }, 4.35);
            tl.to(particles, {
                burst: 1,
                duration: 1.2,
                ease: "power2.out",
            }, 4.35);
            // Particles fade out as they fly away
            tl.to(particles, {
                particleFade: 0,
                duration: 0.8,
                ease: "power1.in",
            }, 4.9);

            // Glow — bright burst then settles
            tl.to(particles, {
                glow: 0.8,
                duration: 0.15,
                ease: "power2.out",
            }, 4.3);
            tl.to(particles, {
                glow: 0.2,
                duration: 1.2,
                ease: "power2.out",
            }, 4.5);

            // ATTACK MODE — punches in from small scale at the blast epicenter
            tl.to(text.title, {
                opacity: 1,
                scale: 1,
                duration: 0.5,
                ease: "back.out(1.7)",
            }, 4.45);
            // Tagline slides up after title lands
            tl.to(text.tagline, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: "power2.out",
            }, 5.0);

            // ─── Beat 6: Settle (5.6–6.4s) ───
            tl.to({}, { duration: 0.8 }); // Hold — let the moment land
        });

        return () => {
            cancelled = true;
            tl?.kill();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [done]);

    if (done) return null;

    return (
        <div className="intro-experience">
            <IntroCanvas ref={canvasRef} />
            <IntroText ref={textRef} />
            <FlashOverlay ref={flashRef} />
        </div>
    );
}
