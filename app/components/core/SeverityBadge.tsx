export type Severity = "S0" | "S1" | "S2" | "S3" | "S4";

interface SeverityBadgeProps {
    severity: Severity;
    className?: string;
}

const severityConfig: Record<Severity, { label: string; classes: string }> = {
    S0: { label: "Critical", classes: "bg-red-500/15 text-red-400 border-red-500/30" },
    S1: { label: "High", classes: "bg-orange-500/15 text-orange-400 border-orange-500/30" },
    S2: { label: "Medium", classes: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30" },
    S3: { label: "Low", classes: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
    S4: { label: "Info", classes: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30" },
};

export default function SeverityBadge({ severity, className = "" }: SeverityBadgeProps) {
    const config = severityConfig[severity];
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-semibold ${config.classes} ${className}`}
        >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
            {severity} · {config.label}
        </span>
    );
}
