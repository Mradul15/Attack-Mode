import IntegrationStatusIndicator from "@/app/components/core/IntegrationStatusIndicator";

const services = [
    { name: "API Gateway", health: "connected" as const, latency: "12ms" },
    { name: "Database Cluster", health: "degraded" as const, latency: "340ms" },
    { name: "Cache Layer", health: "connected" as const, latency: "2ms" },
    { name: "Queue Service", health: "connected" as const, latency: "8ms" },
];

interface SystemHealthCardProps {
    className?: string;
}

export default function SystemHealthCard({ className = "" }: SystemHealthCardProps) {
    const healthyCount = services.filter((s) => s.health === "connected").length;

    return (
        <div className={`rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5 ${className}`}>
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">System Health</h3>
                <span className="text-xs text-[var(--color-text-muted)]">
                    {healthyCount}/{services.length} healthy
                </span>
            </div>
            <div className="space-y-3 stagger-children">
                {services.map((svc) => (
                    <div key={svc.name} className="flex items-center justify-between">
                        <IntegrationStatusIndicator name={svc.name} health={svc.health} />
                        <span className="font-mono text-xs text-[var(--color-text-muted)]">{svc.latency}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
