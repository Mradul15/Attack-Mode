"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";

const BurstButton = dynamic(() => import("../effects/BurstButton"), { ssr: false });

const signalStrips = [
    { label: "Alert flood", value: "183 bridge messages in 12 minutes" },
    { label: "Approval drift", value: "Legal sign-off waiting in a side thread" },
    { label: "Ownership gap", value: "Rollback owner changed after the runbook was written" },
];

export default function HeroSection() {
    const eyebrowRef = useRef<HTMLSpanElement>(null);
    const headlineRef = useRef<HTMLHeadingElement>(null);
    const subRef = useRef<HTMLParagraphElement>(null);
    const actionsRef = useRef<HTMLDivElement>(null);
    const stripRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        import("animejs").then(({ animate }) => {
            const run = animate;

            if (eyebrowRef.current) {
                run(eyebrowRef.current, {
                    opacity: [0, 1],
                    translateY: [18, 0],
                    duration: 900,
                    ease: "outExpo",
                });
            }

            if (headlineRef.current) {
                run(headlineRef.current, {
                    opacity: [0, 1],
                    translateY: [40, 0],
                    duration: 1300,
                    ease: "outExpo",
                    delay: 120,
                });
            }

            if (subRef.current) {
                run(subRef.current, {
                    opacity: [0, 1],
                    translateY: [24, 0],
                    duration: 1100,
                    ease: "outExpo",
                    delay: 260,
                });
            }

            if (actionsRef.current) {
                run(actionsRef.current, {
                    opacity: [0, 1],
                    translateY: [22, 0],
                    duration: 900,
                    ease: "outExpo",
                    delay: 380,
                });
            }

            stripRefs.current.forEach((strip, index) => {
                if (!strip) return;
                run(strip, {
                    opacity: [0, 1],
                    translateX: [-18, 0],
                    duration: 820,
                    ease: "outExpo",
                    delay: 520 + index * 120,
                });
            });
        });
    }, []);

    return (
        <section className="landing-hero">
            <div className="landing-hero__content landing-hero__content--centered">
                <span ref={eyebrowRef} className="landing-kicker landing-hero__eyebrow" style={{ opacity: 0 }}>
                    Chaos to command
                </span>
                <h1 ref={headlineRef} className="landing-hero__headline" style={{ opacity: 0 }}>
                    Static playbooks fail
                    <br />
                    under pressure.
                </h1>
                <p ref={subRef} className="landing-hero__sub" style={{ opacity: 0 }}>
                    Attack Mode is the live command layer that converts response plans into
                    execution. Instead of translating a document in the middle of the incident,
                    the team moves through one operational cockpit.
                </p>
                <div ref={actionsRef} className="landing-hero__actions" style={{ opacity: 0 }}>
                    <BurstButton href="/signup" className="landing-btn-primary landing-btn-lg">
                        Enter Attack Mode
                    </BurstButton>
                    <a href="#product" className="landing-btn-secondary">
                        See the cockpit
                    </a>
                </div>

                <div className="landing-hero__signal-stack">
                    {signalStrips.map((strip, index) => (
                        <div
                            key={strip.label}
                            ref={(element) => {
                                stripRefs.current[index] = element;
                            }}
                            className="landing-hero__signal-strip"
                            style={{ opacity: 0 }}
                        >
                            <span>{strip.label}</span>
                            <strong>{strip.value}</strong>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
