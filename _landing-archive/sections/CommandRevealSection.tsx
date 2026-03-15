"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { dataFlowAnimation, checkmarkAnimation } from "../effects/lottie-data";

const LottieIcon = dynamic(() => import("../effects/LottieIcon"), { ssr: false });

const revealSignals = [
    "Ownership locks in immediately",
    "Approvals stop stalling in side channels",
    "Timeline, evidence, and reporting stay live",
];

const consoleStreams = [
    { label: "Task routing", value: "IC -> Responder -> Legal", status: "LIVE" },
    { label: "Stakeholder comms", value: "Slack + Jira + Status page", status: "SYNCED" },
    { label: "Evidence trail", value: "Append-only timeline + audit", status: "SEALED" },
];

const commandMetrics = [
    { label: "Containment step", value: "04:18", hasCheckmark: false },
    { label: "Pending sign-off", value: "02", hasCheckmark: true },
    { label: "Operators aligned", value: "05", hasCheckmark: false },
];

interface CommandRevealSectionProps {
    portalComplete?: boolean;
}

export default function CommandRevealSection({ portalComplete = false }: CommandRevealSectionProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const statusRefs = useRef<(HTMLSpanElement | null)[]>([]);

    useEffect(() => {
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

            sr.reveal(".command-reveal__eyebrow", { container: sectionRef.current });
            sr.reveal(".command-reveal__title", { delay: 100, container: sectionRef.current });
            sr.reveal(".command-reveal__body", { delay: 180, container: sectionRef.current });
            sr.reveal(".command-reveal__signal", { interval: 100, delay: 260, container: sectionRef.current });
            sr.reveal(".command-reveal__console", { delay: 200, origin: "right", container: sectionRef.current });
        });

        // Mo.js burst on status badge click — simulates "sign-off" interaction
        statusRefs.current.forEach((badge) => {
            if (!badge) return;
            badge.addEventListener("click", function handleStatusClick(this: HTMLSpanElement, e: MouseEvent) {
                const el = this;
                import("@mojs/core").then((mojs) => {
                    const Mojs = mojs.default || mojs;
                    try {
                        const rect = el.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        const burst = new Mojs.Burst({
                            parent: el,
                            left: x,
                            top: y,
                            radius: { 0: 28 },
                            count: 6,
                            children: {
                                shape: "circle",
                                radius: { 4: 0 },
                                fill: ["#22c55e", "#f97316", "#3b82f6", "#eab308"],
                                opacity: { 1: 0 },
                                duration: 550,
                            },
                        });
                        burst.play();

                        // Brief flash
                        el.style.boxShadow = "0 0 12px rgba(34,197,94,0.6)";
                        setTimeout(() => {
                            el.style.boxShadow = "";
                        }, 400);
                    } catch {
                        // Mo.js optional
                    }
                }).catch(() => {});
            });
        });
    }, []);

    return (
        <section
            id="product"
            ref={sectionRef}
            className={`landing-reveal ${portalComplete ? "landing-reveal--armed" : ""}`}
        >
            <div className="landing-reveal__copy">
                <span className="command-reveal__eyebrow landing-kicker">The control plane</span>
                <h2 className="command-reveal__title landing-section-heading">
                    The playbook stops being a document and becomes a live command surface.
                </h2>
                <p className="command-reveal__body landing-section-sub">
                    Attack Mode is the operating layer between the alert and the outcome. It turns
                    procedure into assigned work, puts approvals in one lane, and keeps reporting
                    attached to the response while the incident is still moving.
                </p>
                <div className="landing-reveal__signals">
                    {revealSignals.map((signal) => (
                        <div key={signal} className="command-reveal__signal landing-reveal__signal">
                            <span className="landing-reveal__signal-dot" />
                            <span>{signal}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="command-reveal__console landing-reveal__console">
                <div className="landing-reveal__console-topbar">
                    <div className="landing-reveal__console-title">
                        <span className="landing-reveal__console-badge">ATTACK MODE</span>
                        <span>Live execution cockpit</span>
                    </div>
                    <LottieIcon animationData={dataFlowAnimation} width={28} height={28} />
                </div>

                <div className="landing-reveal__streams">
                    {consoleStreams.map((stream, i) => (
                        <div key={stream.label} className="landing-reveal__stream">
                            <div>
                                <p className="landing-reveal__stream-label">{stream.label}</p>
                                <p className="landing-reveal__stream-value">{stream.value}</p>
                            </div>
                            <span
                                ref={(el) => { statusRefs.current[i] = el; }}
                                className="landing-reveal__stream-status"
                                style={{ cursor: "pointer", position: "relative", overflow: "visible" }}
                                title="Click to simulate sign-off"
                            >
                                {stream.status}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="landing-reveal__metrics">
                    {commandMetrics.map((metric) => (
                        <div key={metric.label} className="landing-reveal__metric">
                            <span className="landing-reveal__metric-label">
                                {metric.label}
                                {metric.hasCheckmark && (
                                    <span className="landing-reveal__metric-checkmark">
                                        <LottieIcon
                                            animationData={checkmarkAnimation}
                                            width={20}
                                            height={20}
                                            loop={false}
                                        />
                                    </span>
                                )}
                            </span>
                            <span className="landing-reveal__metric-value">{metric.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
