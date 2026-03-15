"use client";

import { useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { dataFlowAnimation } from "../effects/lottie-data";

const LottieIcon = dynamic(() => import("../effects/LottieIcon"), { ssr: false });
const BurstButton = dynamic(() => import("../effects/BurstButton"), { ssr: false });

const trustPillars = [
    {
        title: "Append-only accountability",
        description: "Actions, decisions, approvals, and generated updates stay attached to the incident record.",
    },
    {
        title: "Role-scoped execution",
        description: "Operators only see and move the work they are allowed to touch while command still has one source of truth.",
    },
    {
        title: "Runbook-to-report loop",
        description: "The same execution record that drives the incident also becomes the post-incident report and learning surface.",
    },
];

const stats = [
    { value: "47min", label: "Average MTTR", sub: "across all incidents", numericValue: 47, suffix: "min" },
    { value: "99.9%", label: "Platform uptime", sub: "SLA guaranteed", numericValue: 99.9, suffix: "%" },
    { value: "5,000+", label: "Incidents resolved", sub: "by teams like yours", numericValue: 5000, suffix: "+" },
    { value: "< 2min", label: "Time to activate", sub: "from alert to cockpit", numericValue: 2, prefix: "< ", suffix: "min" },
];

const integrations = [
    { name: "Slack", icon: "💬", hasLottie: true },
    { name: "Jira", icon: "📋", hasLottie: true },
    { name: "PagerDuty", icon: "📟", hasLottie: false },
    { name: "Datadog", icon: "📊", hasLottie: false },
    { name: "GitHub", icon: "🐙", hasLottie: false },
    { name: "Opsgenie", icon: "🔔", hasLottie: false },
];

export default function TrustSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const statValueRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const pillarRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let ctx: any = null;

        (async () => {
            // ScrollReveal for base entrance
            const srMod = await import("scrollreveal");
            const ScrollReveal = srMod.default;
            const sr = ScrollReveal({
                distance: "30px",
                duration: 800,
                easing: "cubic-bezier(0.16, 1, 0.3, 1)",
                origin: "bottom",
                reset: false,
            });

            sr.reveal(".trust-heading", { container: section });
            sr.reveal(".trust-stat", { interval: 100, container: section });
            sr.reveal(".trust-integration", { interval: 80, delay: 300, container: section });
            sr.reveal(".trust-cta", { delay: 500, container: section });

            // GSAP counter animation for stat values
            const gsapMod = await import("gsap");
            const gsap = gsapMod.default;
            const { ScrollTrigger } = await import("gsap/ScrollTrigger");
            gsap.registerPlugin(ScrollTrigger);

            ctx = gsap.context(() => {
                // Animate stat counters
                statValueRefs.current.forEach((el, index) => {
                    if (!el) return;
                    const stat = stats[index];
                    const obj = { val: 0 };

                    gsap.to(obj, {
                        val: stat.numericValue,
                        duration: 1.8,
                        delay: index * 0.12,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: el,
                            start: "top 88%",
                            toggleActions: "play none none none",
                        },
                        onUpdate: () => {
                            const formatted = stat.numericValue >= 1000
                                ? Math.round(obj.val).toLocaleString()
                                : stat.numericValue % 1 !== 0
                                    ? obj.val.toFixed(1)
                                    : Math.round(obj.val).toString();
                            el.textContent = `${stat.prefix || ""}${formatted}${stat.suffix}`;
                        },
                    });
                });

                // Pillar cards — staggered scale entrance with glow
                pillarRefs.current.forEach((pillar, index) => {
                    if (!pillar) return;

                    gsap.fromTo(pillar,
                        { opacity: 0, y: 40, scale: 0.95 },
                        {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            duration: 0.8,
                            delay: index * 0.15,
                            ease: "power3.out",
                            scrollTrigger: {
                                trigger: pillar,
                                start: "top 88%",
                                toggleActions: "play none none none",
                            },
                        },
                    );
                });
            }, section);

            // Popmotion hover lift for pillar cards
            const popMod = await import("popmotion");
            const { animate } = popMod;
            pillarRefs.current.forEach((pillar) => {
                if (!pillar) return;
                const handleEnter = () => {
                    animate({
                        from: 0,
                        to: -6,
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                        onUpdate: (v: number) => {
                            pillar.style.transform = `translateY(${v}px)`;
                        },
                    });
                };
                const handleLeave = () => {
                    animate({
                        from: -6,
                        to: 0,
                        type: "spring",
                        stiffness: 300,
                        damping: 22,
                        onUpdate: (v: number) => {
                            pillar.style.transform = `translateY(${v}px)`;
                        },
                    });
                };
                pillar.addEventListener("mouseenter", handleEnter);
                pillar.addEventListener("mouseleave", handleLeave);
            });
        })();

        return () => {
            ctx?.revert();
        };
    }, []);

    return (
        <section id="trust" ref={sectionRef} className="landing-trust">
            <div className="landing-trust__intro">
                <div>
                    <span className="landing-kicker">Built for live operations</span>
                    <h2 className="trust-heading landing-section-heading">
                        Built for teams that can&apos;t afford downtime
                    </h2>
                </div>
                <p className="landing-section-sub">
                    Attack Mode is designed for the moment clarity matters most: active incidents,
                    cross-functional sign-off, and reporting that cannot wait until the end.
                </p>
            </div>

            {/* Stats with animated counters */}
            <div className="landing-trust__stats">
                {stats.map((s, index) => (
                    <div key={s.label} className="trust-stat landing-stat">
                        <span
                            ref={(el) => { statValueRefs.current[index] = el; }}
                            className="landing-stat__value"
                        >
                            {s.value}
                        </span>
                        <span className="landing-stat__label">{s.label}</span>
                        <span className="landing-stat__sub">{s.sub}</span>
                    </div>
                ))}
            </div>

            <div className="landing-trust__pillars">
                {trustPillars.map((pillar, index) => (
                    <div
                        key={pillar.title}
                        ref={(el) => { pillarRefs.current[index] = el; }}
                        className="trust-integration landing-trust__pillar"
                    >
                        <span className="landing-trust__pillar-mark">◆</span>
                        <h3>{pillar.title}</h3>
                        <p>{pillar.description}</p>
                    </div>
                ))}
            </div>

            {/* Integrations strip with Lottie data flow animations */}
            <div className="landing-trust__integrations">
                <p className="text-sm text-[var(--color-text-muted)] mb-6 text-center">
                    Integrates with the tools you already use
                </p>
                <div className="landing-trust__integration-grid">
                    {integrations.map((int) => (
                        <div key={int.name} className="trust-integration landing-integration-badge">
                            <div className="relative">
                                <span className="text-2xl">{int.icon}</span>
                                {int.hasLottie && (
                                    <div className="absolute -top-1 -right-1">
                                        <LottieIcon
                                            animationData={dataFlowAnimation}
                                            width={20}
                                            height={20}
                                        />
                                    </div>
                                )}
                            </div>
                            <span className="text-xs text-[var(--color-text-secondary)]">{int.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Final CTA with Mo.js burst particles */}
            <div className="trust-cta landing-trust__cta">
                <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-3">
                    Ready to take command?
                </h3>
                <p className="text-sm text-[var(--color-text-muted)] mb-8 max-w-md mx-auto">
                    Stop managing incidents in spreadsheets and Slack threads. Start executing with Attack Mode.
                </p>
                <div className="flex items-center justify-center gap-4">
                    <BurstButton href="/signup" className="landing-btn-primary landing-btn-lg">
                        Start Free Trial
                    </BurstButton>
                    <BurstButton href="/sign-in" className="landing-btn-secondary">
                        Log In
                    </BurstButton>
                </div>
            </div>
        </section>
    );
}
