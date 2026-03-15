"use client";

import { useEffect, useRef } from "react";

const problems = [
    {
        title: "Runbooks go stale before the incident starts",
        description:
            "The document says one thing, the current systems say another, and nobody wants to discover that mismatch at minute twelve.",
        metric: "143 days since update",
        signal: "procedure drift",
        fragments: ["owner missing", "version mismatch", "manual handoff"],
    },
    {
        title: "Coordination fractures across channels",
        description:
            "Approvals, decisions, and status updates scatter across Slack threads, tickets, screenshots, and side conversations.",
        metric: "11m waiting on sign-off",
        signal: "signal fragmentation",
        fragments: ["who owns comms?", "approval buried", "duplicate work"],
    },
    {
        title: "MTTR climbs while clarity drops",
        description:
            "Teams spend the highest-pressure part of the incident rebuilding context instead of executing the response.",
        metric: "+27% MTTR drift",
        signal: "operational drag",
        fragments: ["context reset", "handoff lag", "report written later"],
    },
];

const noiseFragments = [
    "Slack thread: 183 messages",
    "Jira status diverged",
    "No signed owner on rollback",
    "Customer update still draft",
    "Evidence link missing",
    "Escalation path unclear",
];

const mttrTrend = [34, 41, 54, 67, 89];

export default function ProblemSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const meltdownRef = useRef<HTMLDivElement>(null);
    const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
    const fragmentRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const trendRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let ctx: any = null;
        let cancelled = false;
        const timeoutIds: number[] = [];

        (async () => {
            const gsapMod = await import("gsap");
            const gsap = gsapMod.default;
            const { ScrollTrigger } = await import("gsap/ScrollTrigger");
            gsap.registerPlugin(ScrollTrigger);

            ctx = gsap.context(() => {
                const heading = section.querySelector(".problem-heading");
                const body = section.querySelector(".problem-body");

                if (heading) {
                    gsap.fromTo(
                        heading,
                        { opacity: 0, y: 24, skewX: -3 },
                        {
                            opacity: 1,
                            y: 0,
                            skewX: 0,
                            duration: 1.1,
                            ease: "power3.out",
                            scrollTrigger: {
                                trigger: heading,
                                start: "top 85%",
                                toggleActions: "play none none none",
                            },
                        },
                    );

                    const glitchTimeline = gsap.timeline({
                        scrollTrigger: {
                            trigger: heading,
                            start: "top 78%",
                            toggleActions: "play none none none",
                        },
                        delay: 0.45,
                    });

                    glitchTimeline
                        .to(heading, { x: -4, skewX: 3, duration: 0.05 })
                        .to(heading, { x: 5, skewX: -4, filter: "hue-rotate(28deg)", duration: 0.05 })
                        .to(heading, { x: -2, skewX: 2, duration: 0.05 })
                        .to(heading, { x: 0, skewX: 0, filter: "none", duration: 0.1 });
                }

                if (body) {
                    gsap.fromTo(
                        body,
                        { opacity: 0, y: 16 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.8,
                            delay: 0.1,
                            ease: "power2.out",
                            scrollTrigger: {
                                trigger: body,
                                start: "top 88%",
                                toggleActions: "play none none none",
                            },
                        },
                    );
                }

                fragmentRefs.current.forEach((fragment, index) => {
                    if (!fragment) return;
                    gsap.fromTo(
                        fragment,
                        { opacity: 0, y: 18, rotate: index % 2 === 0 ? -2 : 2 },
                        {
                            opacity: 1,
                            y: 0,
                            rotate: 0,
                            duration: 0.65,
                            delay: index * 0.08,
                            ease: "power2.out",
                            scrollTrigger: {
                                trigger: fragment,
                                start: "top 92%",
                                toggleActions: "play none none none",
                            },
                        },
                    );
                });

                if (meltdownRef.current) {
                    gsap.fromTo(
                        meltdownRef.current,
                        { opacity: 0, y: 34, scale: 0.97, filter: "blur(12px)" },
                        {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            filter: "blur(0px)",
                            duration: 1,
                            ease: "power3.out",
                            scrollTrigger: {
                                trigger: meltdownRef.current,
                                start: "top 82%",
                                toggleActions: "play none none none",
                            },
                        },
                    );
                }

                trendRefs.current.forEach((bar, index) => {
                    if (!bar) return;

                    gsap.fromTo(
                        bar,
                        { scaleY: 0.18, opacity: 0.2, transformOrigin: "bottom center" },
                        {
                            scaleY: 1,
                            opacity: 1,
                            duration: 0.72,
                            delay: index * 0.1,
                            ease: "power2.out",
                            scrollTrigger: {
                                trigger: bar,
                                start: "top 92%",
                                toggleActions: "play none none none",
                            },
                        },
                    );
                });

                panelRefs.current.forEach((panel, index) => {
                    if (!panel) return;

                    const title = panel.querySelector(".problem-panel__title");
                    const metric = panel.querySelector(".problem-panel__metric");

                    gsap.fromTo(
                        panel,
                        {
                            opacity: 0,
                            y: 50 + index * 8,
                            rotate: index === 1 ? -1.4 : index === 2 ? 1.2 : -0.6,
                            scale: 0.96,
                        },
                        {
                            opacity: 1,
                            y: 0,
                            rotate: index === 1 ? -0.6 : index === 2 ? 0.8 : -0.2,
                            scale: 1,
                            duration: 0.95,
                            delay: index * 0.14,
                            ease: "power2.out",
                            scrollTrigger: {
                                trigger: panel,
                                start: "top 86%",
                                toggleActions: "play none none none",
                            },
                        },
                    );

                    if (title) {
                        const titleTimeline = gsap.timeline({
                            scrollTrigger: {
                                trigger: panel,
                                start: "top 82%",
                                toggleActions: "play none none none",
                            },
                            delay: 0.7 + index * 0.18,
                        });

                        titleTimeline
                            .to(title, { x: 3, duration: 0.04 })
                            .to(title, { x: -2, opacity: 0.8, duration: 0.05 })
                            .to(title, { x: 0, opacity: 1, duration: 0.08 });
                    }

                    if (metric) {
                        gsap.fromTo(
                            metric,
                            { opacity: 0, x: -10 },
                            {
                                opacity: 1,
                                x: 0,
                                duration: 0.55,
                                delay: 0.25 + index * 0.15,
                                ease: "power2.out",
                                scrollTrigger: {
                                    trigger: panel,
                                    start: "top 86%",
                                    toggleActions: "play none none none",
                                },
                            },
                        );
                    }
                });

                gsap.to(section, {
                    x: "random(-1, 1, 0.5)",
                    y: "random(-0.5, 0.5, 0.25)",
                    duration: 0.12,
                    repeat: 8,
                    yoyo: true,
                    ease: "none",
                    scrollTrigger: {
                        trigger: section,
                        start: "top 44%",
                        toggleActions: "play none none none",
                    },
                });
            }, section);

            try {
                const mojs = await import("@mojs/core");
                const Mojs = mojs.default || mojs;

                panelRefs.current.forEach((panel, index) => {
                    if (!panel || cancelled) return;
                    const metric = panel.querySelector(".problem-panel__metric") as HTMLElement | null;
                    if (!metric) return;

                    const timeoutId = window.setTimeout(() => {
                        if (cancelled) return;
                        try {
                            const burst = new Mojs.Burst({
                                parent: metric,
                                left: metric.clientWidth,
                                top: metric.clientHeight / 2,
                                radius: { 0: 22 },
                                count: 5,
                                children: {
                                    shape: "line",
                                    radius: { 6: 0 },
                                    stroke: ["#f97316", "#ef4444", "#fb923c"],
                                    strokeWidth: { 2: 0 },
                                    duration: 520,
                                },
                            });
                            burst.play();
                        } catch {
                            // Ignore optional motion failure.
                        }
                    }, 1000 + index * 220);

                    timeoutIds.push(timeoutId);
                });
            } catch {
                // Ignore optional motion failure.
            }
        })();

        return () => {
            cancelled = true;
            timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
            ctx?.revert();
        };
    }, []);

    return (
        <section id="problem" ref={sectionRef} className="landing-problem">
            <div className="landing-problem__intro">
                <span className="landing-kicker">Where incidents break down</span>
                <h2 className="problem-heading landing-section-heading">
                    Incident response fails in the gaps between tools, ownership, and timing.
                </h2>
                <p className="problem-body landing-section-sub">
                    Most teams do not need another document. They need a response surface that
                    keeps everyone aligned while the incident is live, approvals are time-bound,
                    and the clock is still running.
                </p>
            </div>

            <div className="landing-problem__signal-row">
                {noiseFragments.map((fragment, index) => (
                    <span
                        key={fragment}
                        ref={(element) => {
                            fragmentRefs.current[index] = element;
                        }}
                        className="landing-problem__signal"
                    >
                        {fragment}
                    </span>
                ))}
            </div>

            <div className="landing-problem__systems">
                <div ref={meltdownRef} className="landing-problem__meltdown">
                    <div className="landing-problem__meltdown-copy">
                        <span className="landing-problem__meltdown-label">Context degradation</span>
                        <strong>MTTR rises when the response lives in side channels.</strong>
                        <p>
                            Every extra tool hop forces the team to rebuild state: who owns the task,
                            which decision was approved, what was communicated, and what still needs evidence.
                        </p>
                    </div>

                    <div className="landing-problem__meltdown-board">
                        <div className="landing-problem__meltdown-chart">
                            {mttrTrend.map((value, index) => (
                                <div key={value} className="landing-problem__trend-column">
                                    <div
                                        ref={(element) => {
                                            trendRefs.current[index] = element;
                                        }}
                                        className="landing-problem__trend-bar"
                                        style={{ height: `${value}%` }}
                                    />
                                    <span>{`T+${index * 5}m`}</span>
                                </div>
                            ))}
                        </div>

                        <div className="landing-problem__meltdown-notes">
                            {noiseFragments.slice(0, 4).map((fragment) => (
                                <span key={fragment} className="landing-problem__meltdown-note">
                                    {fragment}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="landing-problem__grid">
                    {problems.map((problem, index) => (
                        <div
                            key={problem.title}
                            ref={(element) => {
                                panelRefs.current[index] = element;
                            }}
                            className="problem-panel landing-card"
                        >
                            <div className="problem-panel__top">
                                <span className="problem-panel__metric">{problem.metric}</span>
                                <span className="problem-panel__signal-badge">{problem.signal}</span>
                            </div>
                            <h3 className="problem-panel__title landing-card__title">{problem.title}</h3>
                            <p className="landing-card__desc">{problem.description}</p>
                            <div className="problem-panel__fragments">
                                {problem.fragments.map((fragment) => (
                                    <span key={fragment} className="problem-panel__fragment">
                                        {fragment}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
