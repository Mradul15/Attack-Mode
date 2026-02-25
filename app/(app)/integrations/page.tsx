import IntegrationCard from "@/app/components/page/integrations/IntegrationCard";

const integrations = [
    { name: "Slack", description: "Channel creation, notifications, and bot commands", health: "connected" as const, lastSync: "2m ago", icon: "💬" },
    { name: "Jira", description: "Ticket creation and status syncing", health: "connected" as const, lastSync: "5m ago", icon: "🎫" },
    { name: "PagerDuty", description: "On-call scheduling and escalation policies", health: "connected" as const, lastSync: "10m ago", icon: "📟" },
    { name: "Datadog", description: "Monitoring dashboards and alert triggers", health: "degraded" as const, lastSync: "1h ago", icon: "📊" },
    { name: "GitHub", description: "Pull requests and deployment tracking", health: "connected" as const, lastSync: "3m ago", icon: "🐙" },
    { name: "Statuspage", description: "Public status page updates", health: "disconnected" as const, icon: "📢" },
];

export default function IntegrationsPage() {
    return (
        <div className="max-w-[1400px]">
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">Integrations</h1>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                    Connect third-party services to your incident workflows.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {integrations.map((integration) => (
                    <IntegrationCard key={integration.name} {...integration} />
                ))}
            </div>
        </div>
    );
}
