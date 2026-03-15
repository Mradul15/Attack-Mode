"use client";

import { useEffect, useRef } from "react";

const capabilities = [
    {
        title: "Task routing",
        description: "Response work instantiates with ownership, timing, and status the second the runbook activates.",
    },
    {
        title: "Approval lane",
        description: "Gated actions and customer comms stay in one queue with a visible decision trail.",
    },
    {
        title: "Live reporting",
        description: "Timeline, evidence, and executive updates stay attached to the incident as the team works.",
    },
    {
        title: "System context",
        description: "Services, integrations, operators, and next steps stay visible in one operational view.",
    },
];

const floatingCards = [
    {
        title: "Containment task",
        detail: "Rotate compromised tokens",
        status: "IN PROGRESS",
    },
    {
        title: "Decision required",
        detail: "Fail over secondary region?",
        status: "PENDING",
    },
    {
        title: "Comms gate",
        detail: "Approve customer update",
        status: "AWAITING SIGN-OFF",
    },
];

export default function SolutionSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        let stageCleanup = () => undefined;

        import("scrollreveal").then((mod) => {
            const ScrollReveal = mod.default;
            if (!sectionRef.current) return;

            const sr = ScrollReveal({
                distance: "30px",
                duration: 900,
                easing: "cubic-bezier(0.16, 1, 0.3, 1)",
                origin: "bottom",
                reset: false,
            });

            sr.reveal(".solution-heading", { container: sectionRef.current });
            sr.reveal(".solution-text", { delay: 140, container: sectionRef.current });
            sr.reveal(".solution-capability", { interval: 90, delay: 220, container: sectionRef.current });
            sr.reveal(".solution-dashboard", { delay: 180, origin: "right", container: sectionRef.current });
        });

        if (svgRef.current) {
            const paths = svgRef.current.querySelectorAll(".trace-line");
            paths.forEach((path) => {
                const line = path as SVGPathElement;
                const length = line.getTotalLength();
                line.style.strokeDasharray = `${length}`;
                line.style.strokeDashoffset = `${length}`;
            });

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (!entry.isIntersecting || !svgRef.current) return;

                        import("animejs").then(({ animate }) => {
                            const lines = svgRef.current?.querySelectorAll(".trace-line") ?? [];
                            lines.forEach((line, index) => {
                                const element = line as SVGPathElement;
                                const length = element.getTotalLength();
                                animate(element, {
                                    strokeDashoffset: [length, 0],
                                    duration: 1350,
                                    delay: index * 180,
                                    easing: "easeInOutQuad",
                                });
                            });
                        }).catch(() => {
                            const lines = svgRef.current?.querySelectorAll(".trace-line") ?? [];
                            lines.forEach((line) => {
                                (line as SVGPathElement).style.strokeDashoffset = "0";
                            });
                        });

                        observer.disconnect();
                    });
                },
                { threshold: 0.3 },
            );

            observer.observe(svgRef.current);
        }

        import("popmotion").then(({ animate }) => {
            const stage = stageRef.current;
            const cards = cardRefs.current.filter((card): card is HTMLDivElement => card !== null);
            if (!stage || cards.length === 0) return;

            cards.forEach((card, index) => {
                animate({
                    from: 32 + index * 10,
                    to: 0,
                    type: "spring",
                    stiffness: 180,
                    damping: 18,
                    onUpdate: (value: number) => {
                        card.dataset.floatY = `${value.toFixed(2)}`;
                        const drift = Number(card.dataset.driftX ?? "0");
                        card.style.transform = `translate3d(${drift}px, ${value}px, 0)`;
                    },
                });
            });

            const handleMove = (event: MouseEvent) => {
                const rect = stage.getBoundingClientRect();
                const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
                const offsetY = (event.clientY - rect.top) / rect.height - 0.5;

                cards.forEach((card, index) => {
                    const driftX = offsetX * (index + 1) * 10;
                    const driftY = offsetY * (index + 1) * 8;
                    const baseY = Number(card.dataset.floatY ?? "0");
                    card.dataset.driftX = driftX.toFixed(2);
                    card.style.transform = `translate3d(${driftX}px, ${baseY + driftY}px, 0) rotateX(${(-offsetY * 6).toFixed(2)}deg) rotateY(${(offsetX * 8).toFixed(2)}deg)`;
                });
            };

            const handleLeave = () => {
                cards.forEach((card) => {
                    const baseY = Number(card.dataset.floatY ?? "0");
                    animate({
                        from: Number(card.dataset.driftX ?? "0"),
                        to: 0,
                        type: "spring",
                        stiffness: 220,
                        damping: 20,
                        onUpdate: (value: number) => {
                            card.dataset.driftX = value.toFixed(2);
                            card.style.transform = `translate3d(${value}px, ${baseY}px, 0)`;
                        },
                    });
                });
            };

            stage.addEventListener("mousemove", handleMove);
            stage.addEventListener("mouseleave", handleLeave);
            stageCleanup = () => {
                stage.removeEventListener("mousemove", handleMove);
                stage.removeEventListener("mouseleave", handleLeave);
            };
        });

        return () => {
            stageCleanup();
        };
    }, []);

    return (
        <section ref={sectionRef} className="landing-solution">
            <div className="landing-solution__content">
                <div className="landing-solution__text-side">
                    <span className="landing-kicker">Operational command</span>
                    <h2 className="solution-heading landing-section-heading">
                        One cockpit for the work, the decisions, the approvals, and the story of the incident.
                    </h2>
                    <p className="solution-text landing-section-sub">
                        Attack Mode keeps the team inside one execution surface instead of bouncing
                        between documents, chat, tickets, and updates. Operators can see the work,
                        move it, explain it, and close it without reconstructing context later.
                    </p>

                    <div className="landing-solution__capabilities">
                        {capabilities.map((capability) => (
                            <div key={capability.title} className="solution-capability landing-solution__capability">
                                <span className="landing-solution__capability-dot" />
                                <div>
                                    <h3>{capability.title}</h3>
                                    <p>{capability.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="solution-dashboard landing-solution__dashboard">
                    <div className="landing-solution__dashboard-glow" />
                    <div className="landing-solution__dashboard-shell">
                        <div className="landing-solution__dashboard-topbar">
                            <div className="landing-solution__dashboard-brand">
                                <span className="landing-solution__status-dot" />
                                <span>Command dashboard</span>
                            </div>
                            <div className="landing-solution__status-cluster">
                                <span />
                                <span />
                                <span />
                            </div>
                        </div>

                        <svg
                            ref={svgRef}
                            viewBox="0 0 420 300"
                            className="landing-solution__diagram"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <rect x="16" y="28" width="112" height="48" rx="14" fill="rgba(249,115,22,0.08)" stroke="rgba(249,115,22,0.26)" />
                            <rect x="148" y="98" width="128" height="56" rx="14" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" />
                            <rect x="298" y="184" width="92" height="50" rx="14" fill="rgba(34,197,94,0.08)" stroke="rgba(34,197,94,0.18)" />
                            <rect x="40" y="196" width="112" height="46" rx="14" fill="rgba(59,130,246,0.08)" stroke="rgba(59,130,246,0.18)" />

                            <path className="trace-line" d="M 128 52 C 168 52, 174 112, 212 112" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
                            <path className="trace-line" d="M 212 154 C 232 186, 282 202, 298 208" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
                            <path className="trace-line" d="M 148 132 C 116 132, 96 188, 96 196" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />

                            <circle cx="212" cy="112" r="6" fill="#f97316" />
                            <circle cx="298" cy="208" r="6" fill="#22c55e" />
                            <circle cx="96" cy="196" r="6" fill="#3b82f6" />

                            <text x="34" y="54" fill="rgba(255,255,255,0.8)" fontSize="12">Runbook activation</text>
                            <text x="170" y="126" fill="rgba(255,255,255,0.8)" fontSize="12">Execution board</text>
                            <text x="314" y="212" fill="rgba(255,255,255,0.82)" fontSize="12">Report output</text>
                            <text x="58" y="222" fill="rgba(255,255,255,0.8)" fontSize="12">Stakeholder updates</text>
                        </svg>

                        <div className="landing-solution__dashboard-footer">
                            <div>
                                <span className="landing-solution__footer-label">Live state</span>
                                <strong>5 operators active</strong>
                            </div>
                            <div>
                                <span className="landing-solution__footer-label">Timeline</span>
                                <strong>append-only</strong>
                            </div>
                            <div>
                                <span className="landing-solution__footer-label">Integrations</span>
                                <strong>Slack / Jira / API</strong>
                            </div>
                        </div>
                    </div>

                    <div ref={stageRef} className="landing-solution__card-row">
                        {floatingCards.map((card, index) => (
                            <div
                                key={card.title}
                                ref={(element) => {
                                    cardRefs.current[index] = element;
                                }}
                                className="landing-solution__float-card"
                            >
                                <span className="landing-solution__float-card-title">{card.title}</span>
                                <strong>{card.detail}</strong>
                                <span className="landing-solution__float-card-status">{card.status}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
