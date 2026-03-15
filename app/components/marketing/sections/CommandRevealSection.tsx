export default function CommandRevealSection() {
    const STREAMS = [
        {
            label: "Task routing",
            value: "IC → Responder → Legal",
            status: "LIVE",
            statusColor: "rgba(34, 197, 94, 0.12)",
            statusText: "#7df0a7",
        },
        {
            label: "Stakeholder comms",
            value: "Slack + Jira + Status page",
            status: "SYNCED",
            statusColor: "rgba(34, 197, 94, 0.12)",
            statusText: "#7df0a7",
        },
        {
            label: "Evidence trail",
            value: "Append-only timeline + audit",
            status: "SEALED",
            statusColor: "rgba(34, 197, 94, 0.12)",
            statusText: "#7df0a7",
        },
    ];

    const METRICS = [
        { label: "Containment step", value: "04:18" },
        { label: "Pending sign-off", value: "02" },
        { label: "Operators aligned", value: "05" },
    ];

    return (
        <section
            id="product"
            className="landing-section"
            style={{ maxWidth: 1240, margin: "0 auto", padding: "120px 24px" }}
        >
            <div className="landing-reveal">
                <div>
                    <span className="landing-kicker landing-animate">
                        The control plane
                    </span>
                    <h2
                        className="landing-section-heading landing-animate"
                        style={{ marginTop: 16 }}
                    >
                        The playbook stops being a document and becomes a live
                        command surface.
                    </h2>
                    <p className="landing-section-sub landing-animate">
                        Attack Mode is the operating layer between the alert and
                        the outcome. It turns procedure into assigned work, puts
                        approvals in one lane, and keeps reporting attached to
                        the response while the incident is still moving.
                    </p>

                    <div className="landing-reveal__signals landing-animate">
                        {[
                            "Ownership locks in immediately",
                            "Approvals stop stalling in side channels",
                            "Timeline, evidence, and reporting stay live",
                        ].map((s) => (
                            <div key={s} className="landing-reveal__signal">
                                <span className="landing-reveal__signal-dot" />
                                <span style={{ fontSize: 14, color: "rgba(255,255,255,0.82)" }}>
                                    {s}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="landing-reveal__console landing-animate">
                    <div className="landing-reveal__console-topbar">
                        <div className="landing-reveal__console-title">
                            <span className="landing-reveal__console-badge">
                                ATTACK MODE
                            </span>
                            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.78)" }}>
                                Incident Command
                            </span>
                        </div>
                    </div>

                    <div className="landing-reveal__streams">
                        {STREAMS.map((s) => (
                            <div key={s.label} className="landing-reveal__stream">
                                <div>
                                    <p className="landing-reveal__stream-label">
                                        {s.label}
                                    </p>
                                    <p className="landing-reveal__stream-value">
                                        {s.value}
                                    </p>
                                </div>
                                <span
                                    className="landing-reveal__stream-status"
                                    style={{
                                        background: s.statusColor,
                                        color: s.statusText,
                                    }}
                                >
                                    {s.status}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="landing-reveal__metrics">
                        {METRICS.map((m) => (
                            <div key={m.label} className="landing-reveal__metric">
                                <p className="landing-reveal__metric-label">
                                    {m.label}
                                </p>
                                <span className="landing-reveal__metric-value">
                                    {m.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
