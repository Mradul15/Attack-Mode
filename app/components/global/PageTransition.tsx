"use client";

import { usePathname } from "next/navigation";
import { useRef, useEffect, useState, type ReactNode } from "react";

interface PageTransitionProps {
    children: ReactNode;
}

/**
 * Route-level crossfade transition.
 * On pathname change: current content fades out, new content fades in.
 * Uses GSAP for smooth, performant animation.
 */
export default function PageTransition({ children }: PageTransitionProps) {
    const pathname = usePathname();
    const stageRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const [displayChildren, setDisplayChildren] = useState(children);
    const previousPathname = useRef(pathname);
    const isFirstRender = useRef(true);

    useEffect(() => {
        // Skip animation on first render
        if (isFirstRender.current) {
            isFirstRender.current = false;
            previousPathname.current = pathname;
            return;
        }

        // Only animate when pathname actually changes
        if (pathname === previousPathname.current) {
            setDisplayChildren(children);
            return;
        }

        previousPathname.current = pathname;
        const stage = stageRef.current;
        const overlay = overlayRef.current;
        if (!stage || !overlay) {
            setDisplayChildren(children);
            return;
        }

        import("gsap").then((gsapMod) => {
            const gsap = gsapMod.default;

            gsap.killTweensOf([stage, overlay]);
            gsap.set(overlay, {
                display: "block",
                clipPath: "inset(100% 0 0 0)",
                opacity: 1,
            });

            const timeline = gsap.timeline({
                onComplete: () => {
                    gsap.set(overlay, { display: "none" });
                },
            });

            timeline
                .to(overlay, {
                    clipPath: "inset(0% 0 0 0)",
                    duration: 0.32,
                    ease: "power4.in",
                })
                .to(
                    stage,
                    {
                        opacity: 0.08,
                        y: 18,
                        scale: 0.985,
                        filter: "blur(8px)",
                        duration: 0.2,
                        ease: "power2.in",
                    },
                    "<",
                )
                .add(() => {
                    setDisplayChildren(children);
                })
                .fromTo(
                    stage,
                    { opacity: 0, y: 24, scale: 0.99, filter: "blur(12px)" },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        filter: "blur(0px)",
                        duration: 0.38,
                        ease: "power3.out",
                    },
                )
                .to(
                    overlay,
                    {
                        clipPath: "inset(0 0 100% 0)",
                        duration: 0.42,
                        ease: "power4.out",
                    },
                    "-=0.24",
                );
        }).catch(() => {
            setDisplayChildren(children);
        });
    }, [pathname, children]);

    return (
        <div style={{ position: "relative" }}>
            <div
                ref={stageRef}
                style={{ willChange: "opacity, transform, filter" }}
            >
                {displayChildren}
            </div>
            <div
                ref={overlayRef}
                aria-hidden="true"
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 160,
                    display: "none",
                    pointerEvents: "none",
                    background:
                        "linear-gradient(180deg, rgba(7,9,15,0.95) 0%, rgba(33,12,8,0.9) 48%, rgba(7,9,15,0.96) 100%)",
                    boxShadow: "inset 0 0 160px rgba(249, 115, 22, 0.12)",
                }}
            />
        </div>
    );
}
