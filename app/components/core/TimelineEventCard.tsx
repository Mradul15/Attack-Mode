export type TimelineEventType = "status_change" | "message" | "action" | "escalation" | "resolution";

interface TimelineEventCardProps {
    type: TimelineEventType;
    actor: string;
    message: string;
    timestamp: string;
    className?: string;
}

const typeIndicator: Record<TimelineEventType, { color: string; icon: string }> = {
    status_change: { color: "bg-blue-400", icon: "⟳" },
    message: { color: "bg-zinc-400", icon: "💬" },
    action: { color: "bg-orange-400", icon: "⚡" },
    escalation: { color: "bg-red-400", icon: "🔺" },
    resolution: { color: "bg-green-400", icon: "✓" },
};

export default function TimelineEventCard({
    type,
    actor,
    message,
    timestamp,
    className = "",
}: TimelineEventCardProps) {
    const indicator = typeIndicator[type];

    return (
        <div className={`flex gap-3 ${className}`}>
            <div className="flex flex-col items-center">
                <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs ${indicator.color}/15 text-[var(--color-text-primary)]`}
                >
                    {indicator.icon}
                </div>
                <div className="w-px flex-1 bg-[var(--color-border)]" />
            </div>
            <div className="pb-6">
                <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                    <span className="font-medium text-[var(--color-text-secondary)]">{actor}</span>
                    <span>·</span>
                    <span>{timestamp}</span>
                </div>
                <p className="mt-1 text-sm text-[var(--color-text-primary)]">{message}</p>
            </div>
        </div>
    );
}
