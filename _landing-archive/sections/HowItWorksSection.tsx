"use client";

import { useRef, useEffect, type CSSProperties } from "react";
import dynamic from "next/dynamic";
import { dataFlowAnimation } from "../effects/lottie-data";

const LottieIcon = dynamic(() => import("../effects/LottieIcon"), { ssr: false });

const steps = [
    {
        number: "01",
        title: "Define the response graph",
        description: "Tasks, approvals, owners, and escalation logic are built into the runbook before the incident starts.",
        accent: "#f97316",
        lottieKey: "playbook" as const,
        lane: "Template + approval policy",
    },
    {
        number: "02",
        title: "Activate Attack Mode",
        description: "A live cockpit spins up from the runbook with operators, tasks, timers, and context already wired together.",
        accent: "#fb923c",
        lottieKey: "activate" as const,
        lane: "Alert -> cockpit activation",
    },
    {
        number: "03",
        title: "Drive execution live",
        description: "Containment, stakeholder updates, approvals, and decisions move through one shared operational surface.",
        accent: "#22c55e",
        lottieKey: "execute" as const,
        lane: "Task lane + decision queue",
    },
    {
        number: "04",
        title: "Close the learning loop",
        description: "The same timeline becomes the report, the evidence set, and the basis for improving the next response.",
        accent: "#3b82f6",
        lottieKey: "learn" as const,
        lane: "Timeline -> report -> runbook",
    },
];

const dataFlows = [
    { label: "Slack", detail: "Approvals and stakeholder prompts stay attached to the incident" },
    { label: "Jira", detail: "Task state mirrors the execution board without becoming the source of truth" },
    { label: "Timeline", detail: "Evidence, decisions, and updates remain append-only while the response is live" },
];

const stepAnimations: Record<string, object> = {
    playbook: {
        v: "5.5.7", fr: 30, ip: 0, op: 60, w: 48, h: 48, nm: "Playbook", ddd: 0, assets: [],
        layers: [{
            ddd: 0, ind: 1, ty: 4, nm: "Doc", sr: 1,
            ks: {
                o: { a: 0, k: 100 },
                s: { a: 1, k: [
                    { t: 0, s: [100, 100, 100], e: [105, 105, 100] },
                    { t: 30, s: [105, 105, 100], e: [100, 100, 100] },
                    { t: 60, s: [100, 100, 100] },
                ]},
                p: { a: 0, k: [24, 24, 0] },
                r: { a: 1, k: [
                    { t: 0, s: [0], e: [3] },
                    { t: 30, s: [3], e: [0] },
                    { t: 60, s: [0] },
                ]},
                a: { a: 0, k: [0, 0, 0] },
            },
            ao: 0,
            shapes: [
                { ty: "rc", s: { a: 0, k: [20, 26] }, p: { a: 0, k: [0, 0] }, r: { a: 0, k: 3 }, nm: "Rect" },
                { ty: "st", c: { a: 0, k: [0.976, 0.451, 0.086, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 2 }, lc: 2, lj: 2, nm: "Stroke" },
                { ty: "fl", c: { a: 0, k: [0.976, 0.451, 0.086, 0.1] }, o: { a: 0, k: 100 }, nm: "Fill" },
            ],
            ip: 0, op: 60, st: 0,
        }],
    },
    activate: {
        v: "5.5.7", fr: 30, ip: 0, op: 60, w: 48, h: 48, nm: "Activate", ddd: 0, assets: [],
        layers: [{
            ddd: 0, ind: 1, ty: 4, nm: "Activate", sr: 1,
            ks: {
                o: { a: 0, k: 100 },
                s: { a: 1, k: [
                    { t: 0, s: [90, 90, 100], e: [112, 112, 100] },
                    { t: 30, s: [112, 112, 100], e: [100, 100, 100] },
                    { t: 60, s: [100, 100, 100] },
                ]},
                p: { a: 0, k: [24, 24, 0] },
                r: { a: 0, k: 0 },
                a: { a: 0, k: [0, 0, 0] },
            },
            ao: 0,
            shapes: [
                { ty: "el", s: { a: 0, k: [22, 22] }, p: { a: 0, k: [0, 0] }, nm: "Circle" },
                { ty: "st", c: { a: 0, k: [0.984, 0.573, 0.235, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 2 }, lc: 2, lj: 2, nm: "Stroke" },
                { ty: "fl", c: { a: 0, k: [0.984, 0.573, 0.235, 0.12] }, o: { a: 0, k: 100 }, nm: "Fill" },
            ],
            ip: 0, op: 60, st: 0,
        }],
    },
    execute: {
        v: "5.5.7", fr: 30, ip: 0, op: 45, w: 48, h: 48, nm: "Execute", ddd: 0, assets: [],
        layers: [{
            ddd: 0, ind: 1, ty: 4, nm: "Execute", sr: 1,
            ks: {
                o: { a: 0, k: 100 },
                s: { a: 1, k: [
                    { t: 0, s: [0, 0, 100], e: [110, 110, 100] },
                    { t: 20, s: [110, 110, 100], e: [100, 100, 100] },
                    { t: 30, s: [100, 100, 100] },
                ]},
                p: { a: 0, k: [24, 24, 0] },
                r: { a: 0, k: 0 },
                a: { a: 0, k: [0, 0, 0] },
            },
            ao: 0,
            shapes: [
                { ty: "el", s: { a: 0, k: [24, 24] }, p: { a: 0, k: [0, 0] }, nm: "Circle" },
                { ty: "fl", c: { a: 0, k: [0.133, 0.773, 0.369, 0.15] }, o: { a: 0, k: 100 }, nm: "Fill" },
                { ty: "st", c: { a: 0, k: [0.133, 0.773, 0.369, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 2 }, lc: 2, lj: 2, nm: "Stroke" },
            ],
            ip: 0, op: 45, st: 0,
        }],
    },
    learn: {
        v: "5.5.7", fr: 30, ip: 0, op: 60, w: 48, h: 48, nm: "Learn", ddd: 0, assets: [],
        layers: [{
            ddd: 0, ind: 1, ty: 4, nm: "Learn", sr: 1,
            ks: {
                o: { a: 0, k: 100 },
                s: { a: 0, k: [100, 100, 100] },
                p: { a: 0, k: [24, 24, 0] },
                r: { a: 1, k: [
                    { t: 0, s: [0], e: [360] },
                    { t: 60, s: [360] },
                ]},
                a: { a: 0, k: [0, 0, 0] },
            },
            ao: 0,
            shapes: [
                { ty: "el", s: { a: 0, k: [20, 20] }, p: { a: 0, k: [0, 0] }, nm: "Ring" },
                { ty: "st", c: { a: 0, k: [0.231, 0.510, 0.965, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 2 }, lc: 2, lj: 2, nm: "Stroke" },
            ],
            ip: 0, op: 60, st: 0,
        }],
    },
};

export default function HowItWorksSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
    const feedRefs = useRef<(HTMLDivElement | null)[]>([]);
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        const cleanups: Array<() => void> = [];

        import("scrollreveal").then((mod) => {
            const ScrollReveal = mod.default;
            if (!sectionRef.current) return;

            const sr = ScrollReveal({
                distance: "42px",
                duration: 950,
                easing: "cubic-bezier(0.16, 1, 0.3, 1)",
                origin: "bottom",
                reset: false,
            });

            sr.reveal(".hiw-heading", { container: sectionRef.current });
            sr.reveal(".hiw-node", { interval: 120, container: sectionRef.current });
            sr.reveal(".hiw-feed", { interval: 120, delay: 220, container: sectionRef.current });
        });

        if (svgRef.current) {
            const paths = svgRef.current.querySelectorAll(".hiw-trace");
            paths.forEach((path) => {
                const element = path as SVGPathElement;
                const length = element.getTotalLength();
                element.style.strokeDasharray = `${length}`;
                element.style.strokeDashoffset = `${length}`;
            });

            const svgElement = svgRef.current;
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (!entry.isIntersecting) return;

                        import("animejs").then(({ animate }) => {
                            const tracePaths = svgElement.querySelectorAll(".hiw-trace");
                            tracePaths.forEach((path, index) => {
                                const element = path as SVGPathElement;
                                const length = element.getTotalLength();
                                animate(element, {
                                    strokeDashoffset: [length, 0],
                                    duration: 1250,
                                    delay: index * 180,
                                    easing: "easeInOutQuad",
                                });
                            });

                            const dots = svgElement.querySelectorAll(".hiw-dot");
                            dots.forEach((dot, index) => {
                                animate(dot, {
                                    opacity: [0, 1],
                                    scale: [0, 1],
                                    duration: 420,
                                    delay: 200 + index * 130,
                                    easing: "easeOutBack",
                                });
                            });
                        }).catch(() => {
                            const tracePaths = svgElement.querySelectorAll(".hiw-trace");
                            tracePaths.forEach((path) => {
                                (path as SVGPathElement).style.strokeDashoffset = "0";
                            });
                        });

                        observer.disconnect();
                    });
                },
                { threshold: 0.22 },
            );

            observer.observe(svgElement);
        }

        import("popmotion").then(({ animate }) => {
            nodeRefs.current.forEach((node) => {
                if (!node) return;

                const handleEnter = () => {
                    animate({
                        from: 0,
                        to: -8,
                        type: "spring",
                        stiffness: 280,
                        damping: 18,
                        onUpdate: (value: number) => {
                            node.style.transform = `translateY(${value}px) ${node.dataset.tilt || ""}`;
                        },
                    });
                };

                const handleMove = (event: MouseEvent) => {
                    const rect = node.getBoundingClientRect();
                    const x = (event.clientX - rect.left) / rect.width - 0.5;
                    const y = (event.clientY - rect.top) / rect.height - 0.5;
                    const rotateY = x * 9;
                    const rotateX = -y * 7;
                    node.dataset.tilt = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                    node.style.transform = `translateY(-8px) perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                };

                const handleLeave = () => {
                    node.dataset.tilt = "";
                    animate({
                        from: -8,
                        to: 0,
                        type: "spring",
                        stiffness: 280,
                        damping: 20,
                        onUpdate: (value: number) => {
                            node.style.transform = `translateY(${value}px)`;
                        },
                    });
                };

                node.addEventListener("mouseenter", handleEnter);
                node.addEventListener("mousemove", handleMove);
                node.addEventListener("mouseleave", handleLeave);

                cleanups.push(() => {
                    node.removeEventListener("mouseenter", handleEnter);
                    node.removeEventListener("mousemove", handleMove);
                    node.removeEventListener("mouseleave", handleLeave);
                });
            });
        });

        return () => {
            cleanups.forEach((cleanup) => cleanup());
        };
    }, []);

    return (
        <section id="how-it-works" ref={sectionRef} className="landing-hiw landing-hiw--mission-control">
            <div className="landing-hiw__intro">
                <div>
                    <span className="landing-kicker">Execution path</span>
                    <h2 className="hiw-heading landing-section-heading">
                        The incident becomes a live execution graph
                    </h2>
                </div>
                <p className="landing-section-sub">
                    Instead of scrolling through a doc and translating it in real time, the team
                    activates one connected system that already knows the work, the gates, and the reporting path.
                </p>
            </div>

            <div className="landing-hiw__theater">
                <svg
                    ref={svgRef}
                    viewBox="0 0 960 520"
                    className="landing-hiw__map"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path className="hiw-trace" d="M 480 260 C 400 220, 310 170, 220 140" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
                    <path className="hiw-trace" d="M 480 260 C 560 220, 650 170, 740 150" stroke="#fb923c" strokeWidth="2.5" strokeLinecap="round" />
                    <path className="hiw-trace" d="M 480 260 C 560 298, 650 350, 748 374" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" />
                    <path className="hiw-trace" d="M 480 260 C 392 310, 302 354, 212 366" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
                    <circle className="hiw-dot" cx="480" cy="260" r="10" fill="#f97316" opacity="0" />
                    <circle className="hiw-dot" cx="220" cy="140" r="8" fill="#f97316" opacity="0" />
                    <circle className="hiw-dot" cx="740" cy="150" r="8" fill="#fb923c" opacity="0" />
                    <circle className="hiw-dot" cx="748" cy="374" r="8" fill="#22c55e" opacity="0" />
                    <circle className="hiw-dot" cx="212" cy="366" r="8" fill="#3b82f6" opacity="0" />
                </svg>

                <div className="landing-hiw__core">
                    <span className="landing-hiw__core-kicker">Attack Mode core</span>
                    <strong>Alert to command in under two minutes</strong>
                    <p>
                        Tasks, approvals, stakeholder updates, and evidence stay inside one live response graph.
                    </p>
                </div>

                {steps.map((step, index) => (
                    <div
                        key={step.number}
                        ref={(element) => {
                            nodeRefs.current[index] = element;
                        }}
                        className={`hiw-node hiw-card hiw-node--${index + 1}`}
                        style={{ "--card-accent": step.accent } as CSSProperties}
                    >
                        <div className="landing-card__icon-row">
                            <LottieIcon
                                animationData={stepAnimations[step.lottieKey]}
                                width={42}
                                height={42}
                                loop
                            />
                            <span className="landing-card__number" style={{ color: step.accent }}>
                                {step.number}
                            </span>
                        </div>
                        <span className="hiw-node__lane">{step.lane}</span>
                        <h3 className="landing-card__title">{step.title}</h3>
                        <p className="landing-card__desc">{step.description}</p>
                        <span className="landing-hiw__card-accent" />
                    </div>
                ))}
            </div>

            <div className="landing-hiw__feed-strip">
                {dataFlows.map((flow, index) => (
                    <div
                        key={flow.label}
                        ref={(element) => {
                            feedRefs.current[index] = element;
                        }}
                        className="hiw-feed landing-hiw__feed"
                    >
                        <LottieIcon animationData={dataFlowAnimation} width={28} height={28} />
                        <div>
                            <strong>{flow.label}</strong>
                            <p>{flow.detail}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
