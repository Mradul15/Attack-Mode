"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import GridBackground from "./sections/GridBackground";
import HeroSection from "./sections/HeroSection";
import ProblemSection from "./sections/ProblemSection";
import SolutionSection from "./sections/SolutionSection";
import HowItWorksSection from "./sections/HowItWorksSection";
import TrustSection from "./sections/TrustSection";
import CommandRevealSection from "./sections/CommandRevealSection";

const CinematicIntro = dynamic(() => import("./effects/CinematicIntro"), { ssr: false });

function SceneFallback() {
    return <div className="landing-scene-fallback" />;
}

const ChaosScene = dynamic(() => import("./scenes/ChaosScene"), {
    ssr: false,
    loading: SceneFallback,
});
const EscalationScene = dynamic(() => import("./scenes/EscalationScene"), {
    ssr: false,
    loading: SceneFallback,
});
const PortalTransition = dynamic(() => import("./scenes/PortalTransition"), {
    ssr: false,
    loading: SceneFallback,
});
const SvgMorphTransition = dynamic(() => import("./scenes/SvgMorphTransition"), {
    ssr: false,
    loading: SceneFallback,
});

const landingPhases = [
    { label: "Chaos", detail: "Fragmented signals outrun the playbook" },
    { label: "Escalation", detail: "Approvals stall while context fractures" },
    { label: "Portal", detail: "Noise collapses into one execution layer" },
    { label: "Command", detail: "The cockpit becomes the live operating surface" },
];

export default function LandingExperience() {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [introComplete, setIntroComplete] = useState(false);
    const [chaosIntensity, setChaosIntensity] = useState(1);
    const [escalationProgress, setEscalationProgress] = useState(0);
    const [portalProgress, setPortalProgress] = useState(0);
    const [revealProgress, setRevealProgress] = useState(0);
    const [portalComplete, setPortalComplete] = useState(false);

    const handleIntroComplete = useCallback(() => {
        setIntroComplete(true);
    }, []);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let ctx: any = null;

        import("gsap").then(async (gsapMod) => {
            const gsap = gsapMod.default;
            const { ScrollTrigger } = await import("gsap/ScrollTrigger");
            gsap.registerPlugin(ScrollTrigger);

            ctx = gsap.context(() => {
                ScrollTrigger.create({
                    trigger: ".landing-phase-1",
                    start: "top top",
                    end: "bottom top",
                    scrub: 0.55,
                    onUpdate: (self) => {
                        setChaosIntensity(1 - self.progress * 0.62);
                    },
                });

                ScrollTrigger.create({
                    trigger: ".landing-phase-2",
                    start: "top center",
                    end: "bottom center",
                    scrub: 0.55,
                    onUpdate: (self) => {
                        setEscalationProgress(self.progress);
                    },
                });

                ScrollTrigger.create({
                    trigger: ".landing-phase-3",
                    start: "top center",
                    end: "bottom center",
                    scrub: 0.35,
                    onUpdate: (self) => {
                        setPortalProgress(self.progress);
                        if (self.progress > 0.96) {
                            setPortalComplete(true);
                        }
                    },
                });

                ScrollTrigger.create({
                    trigger: ".landing-phase-4",
                    start: "top bottom",
                    end: "top top",
                    scrub: 0.6,
                    onUpdate: (self) => {
                        setRevealProgress(self.progress);
                    },
                    onEnter: () => {
                        import("velocity-animate").then((mod) => {
                            const velocity = mod.default || mod;
                            const element = document.querySelector(".landing-phase-4");
                            if (element && typeof velocity === "function") {
                                velocity(
                                    element,
                                    { backgroundColor: "#07090f" },
                                    { duration: 1200, easing: "easeOutQuad" },
                                );
                            }
                        }).catch(() => {
                            // Optional polish only.
                        });
                    },
                });

                // Cinematic entrance for Phase 4 sections
                // Each section fades in as it enters the viewport, fully reversible on scroll-up
                const phase4Sections = document.querySelectorAll(".landing-phase-4__section");
                phase4Sections.forEach((section, i) => {
                    if (i === 0) return; // First section enters naturally

                    gsap.fromTo(section,
                        { opacity: 0, y: 50, filter: "blur(4px)" },
                        {
                            opacity: 1,
                            y: 0,
                            filter: "blur(0px)",
                            ease: "power2.out",
                            scrollTrigger: {
                                trigger: section,
                                start: "top 90%",
                                end: "top 55%",
                                scrub: 0.4,
                            },
                        },
                    );
                });
            }, wrapperRef);
        });

        return () => {
            ctx?.revert();
        };
    }, []);

    const stageOpacity = Math.max(0.18, 1 - revealProgress * 0.82);
    const escalationOpacity = Math.min(1, escalationProgress * 1.2 + portalProgress * 0.3);
    const portalOpacity = Math.min(1, Math.max(0, portalProgress * 1.5 - 0.1));
    const activePhaseIndex = revealProgress > 0.14 ? 3 : portalProgress > 0.16 ? 2 : escalationProgress > 0.08 ? 1 : 0;
    const phaseProgress = [
        1 - chaosIntensity,
        escalationProgress,
        portalProgress,
        revealProgress,
    ];
    const heroOverlayStyle = {
        opacity: Math.max(0.2, 1 - escalationProgress * 0.85),
        transform: `translate3d(0, ${escalationProgress * -56}px, 0) scale(${1 - escalationProgress * 0.05})`,
        transition: "opacity 180ms ease, transform 180ms ease",
    };
    const problemOverlayStyle = {
        opacity: Math.max(0.18, Math.min(1, 0.28 + escalationProgress * 1.08) * (1 - portalProgress * 0.68)),
        transform: `translate3d(0, ${(1 - escalationProgress) * 42 - portalProgress * 34}px, 0) scale(${0.96 + escalationProgress * 0.04})`,
        transition: "opacity 180ms ease, transform 180ms ease",
    };

    return (
        <div ref={wrapperRef} className="landing-experience">
            {!introComplete && <CinematicIntro onComplete={handleIntroComplete} />}

            <div className="landing-experience__stage" style={{ opacity: stageOpacity }}>
                <div className="landing-stage__layer landing-stage__layer--chaos">
                    <ChaosScene intensity={Math.max(0.18, chaosIntensity)} />
                </div>

                <div className="landing-stage__layer landing-stage__layer--escalation" style={{ opacity: escalationOpacity }}>
                    <EscalationScene progress={Math.max(escalationProgress, portalProgress * 0.5)} />
                </div>

                <div className="landing-stage__layer landing-stage__layer--portal" style={{ opacity: portalOpacity }}>
                    <PortalTransition progress={portalProgress} onComplete={() => setPortalComplete(true)} />
                </div>

                <SvgMorphTransition progress={portalProgress} />

                <div
                    className="landing-stage__wash"
                    style={{
                        opacity: 0.24 + escalationProgress * 0.26,
                        background: `radial-gradient(circle at 50% 40%, rgba(249,115,22,${0.12 + portalProgress * 0.22}), transparent 58%)`,
                    }}
                />
            </div>

            <aside className="landing-storyrail" aria-label="Landing narrative phases">
                <div className="landing-storyrail__inner">
                    {landingPhases.map((phase, index) => (
                        <div
                            key={phase.label}
                            className={`landing-storyrail__item ${index === activePhaseIndex ? "landing-storyrail__item--active" : ""}`}
                        >
                            <div className="landing-storyrail__marker">
                                <span className="landing-storyrail__marker-fill" style={{ transform: `scaleY(${Math.max(0.16, phaseProgress[index])})` }} />
                            </div>
                            <div className="landing-storyrail__copy">
                                <span className="landing-storyrail__index">{`0${index + 1}`}</span>
                                <strong>{phase.label}</strong>
                                <p>{phase.detail}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </aside>

            <section className="landing-phase landing-phase-1" style={{ minHeight: "128vh" }}>
                <div className="landing-phase__overlay" style={heroOverlayStyle}>
                    <HeroSection />
                </div>
            </section>

            <section className="landing-phase landing-phase-2" style={{ minHeight: "112vh" }}>
                <div className="landing-phase__overlay" style={problemOverlayStyle}>
                    <ProblemSection />
                </div>
            </section>

            <section className="landing-phase landing-phase-3" style={{ minHeight: "112vh" }}>
                <div className="landing-phase__overlay landing-portal-text">
                    <div
                        className="landing-portal-text__inner"
                        style={{
                            opacity: portalProgress > 0.22 && portalProgress < 0.94 ? 1 : 0,
                            transform: `scale(${0.84 + portalProgress * 0.28}) translateY(${(1 - portalProgress) * 18}px)`,
                            transition: "opacity 0.3s ease, transform 0.18s ease",
                        }}
                    >
                        <span className="landing-kicker landing-portal-text__kicker">Noise collapses</span>
                        <h2 className="landing-portal-text__headline">
                            ATTACK MODE
                        </h2>
                        <p className="landing-portal-text__sub">
                            Turn incident response into execution
                        </p>
                    </div>
                </div>
            </section>

            <div className={`landing-phase-4 ${portalComplete ? "landing-phase-4--live" : ""}`}>
                <GridBackground />
                <div className="landing-phase-4__content">
                    <div className="landing-phase-4__section">
                        <CommandRevealSection portalComplete={portalComplete} />
                    </div>
                    <div className="landing-phase-4__section">
                        <SolutionSection />
                    </div>
                    <div className="landing-phase-4__section">
                        <HowItWorksSection />
                    </div>
                    <div className="landing-phase-4__section">
                        <TrustSection />
                    </div>
                </div>

                <footer className="landing-footer">
                    <div className="landing-footer__inner">
                        <div className="landing-footer__brand">
                            <span className="landing-footer__brand-mark">⚡</span>
                            <div>
                                <p className="landing-footer__brand-name">Attack Mode</p>
                                <p className="landing-footer__brand-copy">Response plans, converted into live execution.</p>
                            </div>
                        </div>
                        <div className="landing-footer__links">
                            <a href="#product">Product</a>
                            <a href="#how-it-works">How It Works</a>
                            <a href="#trust">Trust</a>
                            <Link href="/login">Log In</Link>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
