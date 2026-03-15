"use client";

import { useEffect, useRef } from "react";
import HeroSection from "./sections/HeroSection";
import ProblemSection from "./sections/ProblemSection";
import CommandRevealSection from "./sections/CommandRevealSection";
import SolutionSection from "./sections/SolutionSection";
import HowItWorksSection from "./sections/HowItWorksSection";
import TrustSection from "./sections/TrustSection";
import FooterSection from "./sections/FooterSection";

interface LandingExperienceProps {
    active: boolean;
}

export default function LandingExperience({ active }: LandingExperienceProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const cleanupRef = useRef<(() => void)[]>([]);

    useEffect(() => {
        if (!active || !containerRef.current) return;

        let cancelled = false;

        Promise.all([
            import("gsap"),
            import("gsap/ScrollTrigger"),
        ]).then(([gsapMod, stMod]) => {
            if (cancelled) return;

            const gsap = gsapMod.default;
            const ScrollTrigger = stMod.ScrollTrigger;
            gsap.registerPlugin(ScrollTrigger);

            const prefersReducedMotion = window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;

            if (prefersReducedMotion) {
                containerRef.current
                    ?.querySelectorAll(".landing-section, .landing-animate")
                    .forEach((el) => {
                        (el as HTMLElement).style.opacity = "1";
                        (el as HTMLElement).style.transform = "none";
                        (el as HTMLElement).style.filter = "none";
                    });
                return;
            }

            const container = containerRef.current;
            if (!container) return;

            const isMobile = window.matchMedia("(hover: none)").matches;
            const sections = container.querySelectorAll(".landing-section");

            // ── 1. Per-section scrubbed emergence ──
            sections.forEach((section, index) => {
                // Hero (index 0) — visible immediately after intro
                if (index === 0) {
                    (section as HTMLElement).style.opacity = "1";
                    return;
                }

                const fromVars: Record<string, unknown> = {
                    opacity: 0,
                    scale: 0.97,
                    y: 30,
                };
                const toVars: Record<string, unknown> = {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    ease: "none",
                };

                if (!isMobile) {
                    fromVars.filter = "blur(8px)";
                    toVars.filter = "blur(0px)";
                    (section as HTMLElement).style.willChange = "filter, opacity, transform";
                }

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: section,
                        start: "top bottom",
                        end: "top 30%",
                        scrub: 0.6,
                    },
                });

                tl.fromTo(section, fromVars, toVars);

                cleanupRef.current.push(() => {
                    tl.scrollTrigger?.kill();
                    tl.kill();
                });

                // will-change cleanup
                ScrollTrigger.create({
                    trigger: section,
                    start: "top 25%",
                    once: true,
                    onEnter: () => {
                        (section as HTMLElement).style.willChange = "auto";
                    },
                });
            });

            // ── 2. Staggered children via scroll offset ──
            sections.forEach((section, sectionIndex) => {
                const children = section.querySelectorAll(".landing-animate");
                if (children.length === 0) return;

                // Hero children: simple stagger on load
                if (sectionIndex === 0) {
                    gsap.fromTo(
                        children,
                        { opacity: 0, y: 20 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.7,
                            ease: "power2.out",
                            stagger: 0.12,
                            delay: 0.2,
                        }
                    );
                    return;
                }

                children.forEach((child, i) => {
                    const startPct = Math.max(85 - i * 5, 40);
                    const endPct = Math.max(startPct - 25, 15);

                    const childTl = gsap.timeline({
                        scrollTrigger: {
                            trigger: section,
                            start: `top ${startPct}%`,
                            end: `top ${endPct}%`,
                            scrub: 0.6,
                        },
                    });

                    childTl.fromTo(
                        child,
                        { opacity: 0, y: 20 },
                        { opacity: 1, y: 0, ease: "none" }
                    );

                    cleanupRef.current.push(() => {
                        childTl.scrollTrigger?.kill();
                        childTl.kill();
                    });
                });
            });

            // ── 3. Parallax depth layers ──
            container.querySelectorAll(".landing-kicker").forEach((el) => {
                const st = ScrollTrigger.create({
                    trigger: el,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                    onUpdate: (self: { progress: number }) => {
                        gsap.set(el, { y: self.progress * -40 });
                    },
                });
                cleanupRef.current.push(() => st.kill());
            });

            const floatEls = container.querySelectorAll(
                ".landing-hero__signal-strip, .landing-solution__float-card, .landing-reveal__signal"
            );
            floatEls.forEach((el, i) => {
                const offset = 15 + (i % 3) * 10;
                const st = ScrollTrigger.create({
                    trigger: el,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                    onUpdate: (self: { progress: number }) => {
                        gsap.set(el, { y: (self.progress - 0.5) * offset });
                    },
                });
                cleanupRef.current.push(() => st.kill());
            });

            // ── 4. Scroll-tracking ambient glow ──
            const glowEl = container.querySelector(".landing-scroll-glow") as HTMLElement;
            if (glowEl) {
                const st = ScrollTrigger.create({
                    trigger: container,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: true,
                    onUpdate: (self: { progress: number }) => {
                        glowEl.style.setProperty("--glow-y", `${self.progress * 100}%`);
                    },
                });
                cleanupRef.current.push(() => st.kill());
            }
        });

        return () => {
            cancelled = true;
            cleanupRef.current.forEach((fn) => fn());
            cleanupRef.current = [];
        };
    }, [active]);

    return (
        <div
            ref={containerRef}
            className="landing-experience"
            style={{ opacity: active ? 1 : 0, transition: "opacity 0.6s ease" }}
        >
            <div className="landing-scroll-glow" />
            <HeroSection />
            <ProblemSection />
            <CommandRevealSection />
            <SolutionSection />
            <HowItWorksSection />
            <TrustSection />
            <FooterSection />
        </div>
    );
}
