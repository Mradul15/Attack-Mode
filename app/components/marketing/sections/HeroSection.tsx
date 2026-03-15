"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

export default function HeroSection() {
    const headlineRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        const el = headlineRef.current;
        if (!el) return;

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
        if (prefersReducedMotion) return;

        let cancelled = false;

        import("animejs").then((anime) => {
            if (cancelled || !el) return;

            const text = el.textContent || "";
            const words = text.split(/\s+/);
            el.innerHTML = words
                .map(
                    (w) =>
                        `<span class="landing-hero__word" style="display:inline-block;opacity:0;transform:translateY(12px)">${w}</span>`
                )
                .join('<span style="display:inline-block;width:0.3em"></span>');

            anime.animate(".landing-hero__word", {
                opacity: [0, 1],
                translateY: [12, 0],
                delay: anime.stagger(80, { start: 400 }),
                duration: 500,
                ease: "outExpo",
            });
        });

        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <section className="landing-hero landing-section">
            <div className="landing-hero__content landing-hero__content--centered">
                <span className="landing-kicker landing-animate">
                    Chaos to command
                </span>

                <h1 ref={headlineRef} className="landing-hero__headline">
                    Static playbooks fail under pressure.
                </h1>

                <p className="landing-hero__sub landing-animate">
                    Attack Mode is the live command layer that converts response
                    plans into execution. Instead of translating a document in
                    the middle of the incident, the team moves through one
                    operational cockpit.
                </p>

                <div className="landing-hero__actions landing-animate">
                    <Link href="/signup" className="landing-btn-primary">
                        Enter Attack Mode
                    </Link>
                    <a href="#product" className="landing-btn-secondary">
                        See the cockpit
                    </a>
                </div>

                <div className="landing-hero__signal-stack landing-animate">
                    <div className="landing-hero__signal-strip">
                        <span className="landing-hero__signal-label">
                            Alert flood
                        </span>
                        <span className="landing-hero__signal-value">
                            183 bridge messages in 12 minutes
                        </span>
                    </div>
                    <div className="landing-hero__signal-strip">
                        <span className="landing-hero__signal-label">
                            Approval drift
                        </span>
                        <span className="landing-hero__signal-value">
                            Legal sign-off waiting in a side thread
                        </span>
                    </div>
                    <div className="landing-hero__signal-strip">
                        <span className="landing-hero__signal-label">
                            Ownership gap
                        </span>
                        <span className="landing-hero__signal-value">
                            Rollback owner changed after the runbook was written
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
