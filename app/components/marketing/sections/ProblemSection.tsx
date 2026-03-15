"use client";

import { useEffect, useRef } from "react";

const NOISE_FRAGMENTS = [
    "Slack thread: 183 messages",
    "Jira status diverged",
    "No signed owner on rollback",
    "Customer update still draft",
    "Evidence link missing",
    "Escalation path unclear",
];

const PROBLEMS = [
    {
        title: "Runbooks go stale before the incident starts",
        desc: "Procedures written months ago no longer match the system topology, the team roster, or the approval chain. The document is technically there, but operationally irrelevant.",
        metric: "143 days since update",
        signal: "procedure drift",
        fragments: ["owner missing", "version mismatch", "manual handoff"],
    },
    {
        title: "Coordination fractures across channels",
        desc: "Decisions happen in DMs. Approvals get buried in threads. Status updates live in a doc nobody refreshes. The team is moving, but not together.",
        metric: "11m waiting on sign-off",
        signal: "signal fragmentation",
        fragments: ["who owns comms?", "approval buried", "duplicate work"],
    },
    {
        title: "MTTR climbs while clarity drops",
        desc: "Every tool hop forces the team to rebuild context: who owns the task, which decision was approved, what was communicated. The clock keeps running.",
        metric: "+27% MTTR drift",
        signal: "operational drag",
        fragments: ["context reset", "handoff lag", "report written later"],
    },
];

const TREND_DATA = [34, 41, 54, 67, 89];

export default function ProblemSection() {
    const headingRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        const el = headingRef.current;
        if (!el) return;

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
        if (prefersReducedMotion) return;

        let cancelled = false;

        Promise.all([import("animejs"), import("gsap/ScrollTrigger"), import("gsap")]).then(
            ([anime, stMod, gsapMod]) => {
                if (cancelled || !el) return;

                const gsap = gsapMod.default;
                const ScrollTrigger = stMod.ScrollTrigger;
                gsap.registerPlugin(ScrollTrigger);

                const text = el.textContent || "";
                const words = text.split(/\s+/);
                el.innerHTML = words
                    .map(
                        (w) =>
                            `<span class="landing-problem__word" style="display:inline-block;opacity:0;transform:translateY(12px)">${w}</span>`
                    )
                    .join('<span style="display:inline-block;width:0.3em"></span>');

                ScrollTrigger.create({
                    trigger: el,
                    start: "top 60%",
                    once: true,
                    onEnter: () => {
                        anime.animate(".landing-problem__word", {
                            opacity: [0, 1],
                            translateY: [12, 0],
                            delay: anime.stagger(80),
                            duration: 500,
                            ease: "outExpo",
                        });
                    },
                });
            }
        );

        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <section className="landing-problem landing-section">
            <div className="landing-problem__intro">
                <div>
                    <span className="landing-kicker landing-animate">
                        Where incidents break down
                    </span>
                    <h2
                        ref={headingRef}
                        className="landing-section-heading"
                        style={{ marginTop: 16 }}
                    >
                        Incident response fails in the gaps between tools,
                        ownership, and timing.
                    </h2>
                </div>
                <p className="landing-section-sub landing-animate">
                    Most teams do not need another document. They need a
                    response surface that keeps everyone aligned while the
                    incident is live, approvals are time-bound, and the clock is
                    still running.
                </p>
            </div>

            <div
                className="landing-problem__signal-row landing-animate"
                style={{ marginTop: 34 }}
            >
                {NOISE_FRAGMENTS.map((f) => (
                    <span key={f} className="landing-problem__signal">
                        {f}
                    </span>
                ))}
            </div>

            <div
                className="landing-problem__grid landing-animate"
                style={{ marginTop: 28 }}
            >
                {PROBLEMS.map((p) => (
                    <div key={p.title} className="landing-card problem-panel">
                        <div className="problem-panel__top">
                            <h3 className="landing-card__title">{p.title}</h3>
                            <span className="problem-panel__metric">
                                {p.metric}
                            </span>
                        </div>
                        <p className="landing-card__desc">{p.desc}</p>
                        <div className="problem-panel__fragments">
                            {p.fragments.map((f) => (
                                <span
                                    key={f}
                                    className="problem-panel__fragment"
                                >
                                    {f}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div
                className="landing-problem__meltdown landing-animate"
                style={{ marginTop: 28 }}
            >
                <div className="landing-problem__meltdown-copy">
                    <span
                        className="landing-kicker"
                        style={{ marginBottom: 12 }}
                    >
                        Context degradation
                    </span>
                    <strong>
                        MTTR rises when the response lives in side channels.
                    </strong>
                    <p className="landing-section-sub">
                        Every extra tool hop forces the team to rebuild state:
                        who owns the task, which decision was approved, what was
                        communicated, and what still needs evidence.
                    </p>
                </div>
                <div className="landing-problem__meltdown-board">
                    <div className="landing-problem__meltdown-chart">
                        {TREND_DATA.map((val, i) => (
                            <div
                                key={i}
                                className="landing-problem__trend-bar"
                                style={{ height: `${val}%` }}
                            >
                                <span className="landing-problem__trend-label">
                                    {val}%
                                </span>
                            </div>
                        ))}
                    </div>
                    <p
                        style={{
                            margin: 0,
                            fontSize: 12,
                            color: "rgba(255,255,255,0.45)",
                            textAlign: "center",
                        }}
                    >
                        MTTR trend — last 5 incidents
                    </p>
                </div>
            </div>
        </section>
    );
}
