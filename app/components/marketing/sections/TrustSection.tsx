"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

const STATS = [
    { value: 47, suffix: "min", label: "Average MTTR", sub: "across all incidents" },
    { value: 99.9, suffix: "%", label: "Platform uptime", sub: "SLA guaranteed" },
    { value: 5000, suffix: "+", label: "Incidents resolved", sub: "by teams like yours", format: true },
    { value: 2, prefix: "< ", suffix: "min", label: "Time to activate", sub: "from alert to cockpit" },
];

const PILLARS = [
    {
        title: "Append-only accountability",
        desc: "Actions, decisions, approvals, and generated updates stay attached to the incident record.",
    },
    {
        title: "Role-scoped execution",
        desc: "Operators only see and move the work they are allowed to touch while command still has one source of truth.",
    },
    {
        title: "Runbook-to-report loop",
        desc: "The same execution record that drives the incident also becomes the post-incident report and learning surface.",
    },
];

const INTEGRATIONS = [
    { icon: "💬", name: "Slack" },
    { icon: "📋", name: "Jira" },
    { icon: "📟", name: "PagerDuty" },
    { icon: "📊", name: "Datadog" },
    { icon: "🐙", name: "GitHub" },
    { icon: "🔔", name: "Opsgenie" },
];

export default function TrustSection() {
    const headingRef = useRef<HTMLHeadingElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = headingRef.current;
        const statsEl = statsRef.current;
        if (!el || !statsEl) return;

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
        if (prefersReducedMotion) return;

        let cancelled = false;

        Promise.all([
            import("animejs"),
            import("gsap/ScrollTrigger"),
            import("gsap"),
        ]).then(([anime, stMod, gsapMod]) => {
            if (cancelled) return;

            const gsap = gsapMod.default;
            const ScrollTrigger = stMod.ScrollTrigger;
            gsap.registerPlugin(ScrollTrigger);

            // Word-by-word heading reveal
            const text = el.textContent || "";
            const words = text.split(/\s+/);
            el.innerHTML = words
                .map(
                    (w) =>
                        `<span class="landing-trust__word" style="display:inline-block;opacity:0;transform:translateY(12px)">${w}</span>`
                )
                .join('<span style="display:inline-block;width:0.3em"></span>');

            ScrollTrigger.create({
                trigger: el,
                start: "top 60%",
                once: true,
                onEnter: () => {
                    anime.animate(".landing-trust__word", {
                        opacity: [0, 1],
                        translateY: [12, 0],
                        delay: anime.stagger(80),
                        duration: 500,
                        ease: "outExpo",
                    });
                },
            });

            // Counter animation for stats
            const valueEls = statsEl.querySelectorAll(".landing-stat__value");
            valueEls.forEach((valEl, i) => {
                const stat = STATS[i];
                const obj = { val: 0 };

                ScrollTrigger.create({
                    trigger: valEl,
                    start: "top 90%",
                    once: true,
                    onEnter: () => {
                        gsap.to(obj, {
                            val: stat.value,
                            duration: 1.5,
                            ease: "power2.out",
                            onUpdate: () => {
                                const prefix = stat.prefix || "";
                                const suffix = stat.suffix || "";
                                let display: string;
                                if (stat.format) {
                                    display = Math.round(obj.val).toLocaleString();
                                } else if (suffix === "%") {
                                    display = obj.val.toFixed(1);
                                } else {
                                    display = Math.round(obj.val).toString();
                                }
                                (valEl as HTMLElement).textContent =
                                    prefix + display + suffix;
                            },
                        });
                    },
                });
            });
        });

        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <section id="trust" className="landing-trust landing-section">
            <div className="landing-trust__intro">
                <div>
                    <span className="landing-kicker landing-animate">
                        Built for live operations
                    </span>
                    <h2
                        ref={headingRef}
                        className="landing-section-heading"
                        style={{ marginTop: 16 }}
                    >
                        Built for teams that can&apos;t afford downtime
                    </h2>
                </div>
                <p className="landing-section-sub landing-animate">
                    Attack Mode is designed for the moment clarity matters most:
                    active incidents, cross-functional sign-off, and reporting
                    that cannot wait until the end.
                </p>
            </div>

            <div ref={statsRef} className="landing-trust__stats landing-animate">
                {STATS.map((s) => (
                    <div key={s.label} className="landing-stat">
                        <span className="landing-stat__value">
                            {s.prefix || ""}0{s.suffix}
                        </span>
                        <span className="landing-stat__label">{s.label}</span>
                        <span className="landing-stat__sub">{s.sub}</span>
                    </div>
                ))}
            </div>

            <div className="landing-trust__pillars landing-animate">
                {PILLARS.map((p) => (
                    <div key={p.title} className="landing-trust__pillar">
                        <span className="landing-trust__pillar-mark">◆</span>
                        <h3 className="landing-card__title">{p.title}</h3>
                        <p className="landing-card__desc">{p.desc}</p>
                    </div>
                ))}
            </div>

            <div className="landing-trust__integrations landing-animate">
                <p
                    style={{
                        margin: "0 0 18px",
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.45)",
                    }}
                >
                    Integrations
                </p>
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 12,
                        justifyContent: "center",
                    }}
                >
                    {INTEGRATIONS.map((int) => (
                        <div
                            key={int.name}
                            className="landing-integration-badge"
                        >
                            <span style={{ fontSize: 20 }}>{int.icon}</span>
                            <span
                                style={{
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: "var(--color-text-primary)",
                                }}
                            >
                                {int.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="landing-trust__cta landing-animate">
                <h3
                    className="landing-section-heading"
                    style={{ textAlign: "center" }}
                >
                    Ready to take command?
                </h3>
                <p
                    className="landing-section-sub"
                    style={{
                        textAlign: "center",
                        maxWidth: 520,
                        margin: "12px auto 0",
                    }}
                >
                    Stop managing incidents in spreadsheets and Slack threads.
                    Start executing with Attack Mode.
                </p>
                <div
                    style={{
                        display: "flex",
                        gap: 14,
                        justifyContent: "center",
                        marginTop: 28,
                    }}
                >
                    <Link href="/signup" className="landing-btn-primary">
                        Start Free Trial
                    </Link>
                    <Link href="/sign-in" className="landing-btn-secondary">
                        Log In
                    </Link>
                </div>
            </div>
        </section>
    );
}
