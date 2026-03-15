const STEPS = [
    {
        num: "01",
        title: "Define the response graph",
        desc: "Tasks, approvals, owners, and escalation logic are built into the runbook before the incident starts.",
        lane: "Template + approval policy",
        color: "#f97316",
    },
    {
        num: "02",
        title: "Activate Attack Mode",
        desc: "A live cockpit spins up from the runbook with operators, tasks, timers, and context already wired together.",
        lane: "Alert → cockpit activation",
        color: "#fb923c",
    },
    {
        num: "03",
        title: "Drive execution live",
        desc: "Containment, stakeholder updates, approvals, and decisions move through one shared operational surface.",
        lane: "Task lane + decision queue",
        color: "#22c55e",
    },
    {
        num: "04",
        title: "Close the learning loop",
        desc: "The same timeline becomes the report, the evidence set, and the basis for improving the next response.",
        lane: "Timeline → report → runbook",
        color: "#3b82f6",
    },
];

const FEEDS = [
    {
        icon: "💬",
        name: "Slack",
        desc: "Approvals and stakeholder prompts stay attached to the incident",
    },
    {
        icon: "📋",
        name: "Jira",
        desc: "Task state mirrors the execution board without becoming the source of truth",
    },
    {
        icon: "📊",
        name: "Timeline",
        desc: "Evidence, decisions, and updates remain append-only while the response is live",
    },
];

export default function HowItWorksSection() {
    return (
        <section id="how-it-works" className="landing-hiw landing-section">
            <div className="landing-hiw__intro">
                <div>
                    <span className="landing-kicker landing-animate">
                        Execution path
                    </span>
                    <h2
                        className="landing-section-heading landing-animate"
                        style={{ marginTop: 16 }}
                    >
                        The incident becomes a live execution graph
                    </h2>
                </div>
                <p className="landing-section-sub landing-animate">
                    Instead of scrolling through a doc and translating it in real
                    time, the team activates one connected system that already
                    knows the work, the gates, and the reporting path.
                </p>
            </div>

            <div className="landing-hiw__grid landing-animate">
                {STEPS.map((s) => (
                    <div
                        key={s.num}
                        className="landing-card hiw-card"
                        style={
                            {
                                "--card-accent": s.color,
                            } as React.CSSProperties
                        }
                    >
                        <span
                            style={{
                                fontSize: 11,
                                fontWeight: 700,
                                letterSpacing: "0.12em",
                                textTransform: "uppercase",
                                color: s.color,
                            }}
                        >
                            Step {s.num}
                        </span>
                        <h3
                            className="landing-card__title"
                            style={{ marginTop: 10 }}
                        >
                            {s.title}
                        </h3>
                        <p className="landing-card__desc">{s.desc}</p>
                        <span
                            style={{
                                display: "inline-flex",
                                marginTop: 14,
                                padding: "6px 10px",
                                borderRadius: 999,
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                fontSize: 11,
                                color: "rgba(255,255,255,0.56)",
                            }}
                        >
                            {s.lane}
                        </span>
                        <div className="landing-hiw__card-accent" />
                    </div>
                ))}
            </div>

            <div
                className="landing-hiw__feed-strip landing-animate"
                style={{ marginTop: 24 }}
            >
                {FEEDS.map((f) => (
                    <div key={f.name} className="landing-hiw__feed">
                        <span style={{ fontSize: 24 }}>{f.icon}</span>
                        <div>
                            <strong>{f.name}</strong>
                            <p
                                style={{
                                    margin: "4px 0 0",
                                    fontSize: 13,
                                    color: "rgba(218,222,235,0.68)",
                                    lineHeight: 1.6,
                                }}
                            >
                                {f.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
