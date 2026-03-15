export type IntegrationHealth = "connected" | "degraded" | "disconnected";

interface IntegrationStatusIndicatorProps {
    name: string;
    health: IntegrationHealth;
    lastSync?: string;
    className?: string;
}

const healthStyles: Record<IntegrationHealth, { dot: string; text: string; label: string }> = {
    connected: { dot: "bg-green-400", text: "text-green-400", label: "Connected" },
    degraded: { dot: "bg-yellow-400", text: "text-yellow-400", label: "Degraded" },
    disconnected: { dot: "bg-red-400", text: "text-red-400", label: "Disconnected" },
};

export default function IntegrationStatusIndicator({
    name,
    health,
    lastSync,
    className = "",
}: IntegrationStatusIndicatorProps) {
    const style = healthStyles[health];

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <span className={`inline-block h-2 w-2 rounded-full ${style.dot} ${health === "connected" ? "animate-pulse-glow" : ""}`} />
            <span className="text-sm font-medium text-[var(--color-text-primary)]">{name}</span>
            <span className={`text-xs font-medium ${style.text}`}>{style.label}</span>
            {lastSync && (
                <span className="text-xs text-[var(--color-text-muted)]">· Synced {lastSync}</span>
            )}
        </div>
    );
}
