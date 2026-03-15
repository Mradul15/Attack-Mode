const CAPABILITIES = [
    {
        title: "Task routing",
        desc: "Response work instantiates with ownership, timing, and status the second the runbook activates.",
    },
    {
        title: "Approval lane",
        desc: "Gated actions and customer comms stay in one queue with a visible decision trail.",
    },
    {
        title: "Live reporting",
        desc: "Timeline, evidence, and executive updates stay attached to the incident as the team works.",
    },
    {
        title: "System context",
        desc: "Services, integrations, operators, and next steps stay visible in one operational view.",
    },
];

const FLOAT_CARDS = [
    {
        label: "Containment task",
        title: "Rotate compromised tokens",
        status: "IN PROGRESS",
        statusBg: "rgba(249, 115, 22, 0.12)",
        statusColor: "#ffb074",
    },
    {
        label: "Decision required",
        title: "Fail over secondary region?",
        status: "PENDING",
        statusBg: "rgba(251, 191, 36, 0.12)",
        statusColor: "#fcd34d",
    },
    {
        label: "Comms gate",
        title: "Approve customer update",
        status: "AWAITING SIGN-OFF",
        statusBg: "rgba(59, 130, 246, 0.12)",
        statusColor: "#93c5fd",
    },
];

export default function SolutionSection() {
    return (
        <section className="landing-solution landing-section">
            <div className="landing-solution__content">
                <div>
                    <span className="landing-kicker landing-animate">
                        Operational command
                    </span>
                    <h2
                        className="landing-section-heading landing-animate"
                        style={{ marginTop: 16 }}
                    >
                        One cockpit for the work, the decisions, the approvals,
                        and the story of the incident.
                    </h2>
                    <p className="landing-section-sub landing-animate">
                        Attack Mode keeps the team inside one execution surface
                        instead of bouncing between documents, chat, tickets, and
                        updates. Operators can see the work, move it, explain it,
                        and close it without reconstructing context later.
                    </p>

                    <div className="landing-solution__capabilities landing-animate">
                        {CAPABILITIES.map((c) => (
                            <div
                                key={c.title}
                                className="landing-solution__capability"
                            >
                                <span className="landing-solution__capability-dot" />
                                <div>
                                    <strong
                                        style={{
                                            display: "block",
                                            fontSize: 15,
                                            color: "var(--color-text-primary)",
                                            marginBottom: 4,
                                        }}
                                    >
                                        {c.title}
                                    </strong>
                                    <span
                                        style={{
                                            fontSize: 13,
                                            color: "rgba(218,222,235,0.68)",
                                            lineHeight: 1.6,
                                        }}
                                    >
                                        {c.desc}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="landing-solution__dashboard landing-animate">
                    <div className="landing-solution__dashboard-glow" />
                    <div className="landing-solution__dashboard-shell">
                        <div className="landing-solution__dashboard-topbar">
                            <div className="landing-solution__dashboard-brand">
                                <span className="landing-solution__status-dot" />
                                Command dashboard
                            </div>
                            <div className="landing-solution__status-cluster">
                                <span />
                                <span />
                                <span />
                            </div>
                        </div>

                        <div
                            className="landing-solution__card-row"
                            style={{ marginTop: 20 }}
                        >
                            {FLOAT_CARDS.map((c) => (
                                <div
                                    key={c.title}
                                    className="landing-solution__float-card"
                                >
                                    <span
                                        style={{
                                            fontSize: 10,
                                            fontWeight: 700,
                                            letterSpacing: "0.12em",
                                            textTransform: "uppercase" as const,
                                            color: "rgba(255,255,255,0.45)",
                                        }}
                                    >
                                        {c.label}
                                    </span>
                                    <strong>{c.title}</strong>
                                    <span
                                        style={{
                                            display: "inline-flex",
                                            width: "fit-content",
                                            padding: "5px 8px",
                                            borderRadius: 999,
                                            background: c.statusBg,
                                            color: c.statusColor,
                                            fontSize: 10,
                                            fontWeight: 700,
                                            letterSpacing: "0.1em",
                                        }}
                                    >
                                        {c.status}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="landing-solution__dashboard-footer">
                            <span
                                style={{
                                    fontSize: 12,
                                    color: "rgba(255,255,255,0.5)",
                                }}
                            >
                                <strong style={{ color: "#7df0a7" }}>
                                    Live state
                                </strong>{" "}
                                — 5 operators active
                            </span>
                            <span
                                style={{
                                    fontSize: 12,
                                    color: "rgba(255,255,255,0.5)",
                                }}
                            >
                                Timeline: append-only
                            </span>
                            <span
                                style={{
                                    fontSize: 12,
                                    color: "rgba(255,255,255,0.5)",
                                }}
                            >
                                Integrations: Slack / Jira / API
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
