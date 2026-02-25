interface VersionSelectorProps {
    versions?: { id: string; label: string; date: string; author: string; current?: boolean }[];
    className?: string;
}

const defaultVersions = [
    { id: "v3", label: "v3.0", date: "Jan 15, 2024", author: "Alice Chen", current: true },
    { id: "v2", label: "v2.1", date: "Dec 20, 2023", author: "Bob Park" },
    { id: "v1", label: "v1.0", date: "Nov 5, 2023", author: "Carol Wu" },
];

export default function VersionSelector({
    versions = defaultVersions,
    className = "",
}: VersionSelectorProps) {
    return (
        <div className={`rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5 ${className}`}>
            <h3 className="mb-3 text-sm font-semibold text-[var(--color-text-primary)]">Versions</h3>
            <div className="space-y-2">
                {versions.map((v) => (
                    <div
                        key={v.id}
                        className={`flex items-center justify-between rounded-lg border px-3 py-2.5 cursor-pointer transition-colors ${v.current
                                ? "border-[var(--color-accent)]/30 bg-[var(--color-accent)]/5"
                                : "border-[var(--color-border)] bg-[var(--color-bg-root)] hover:bg-[var(--color-bg-hover)]"
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-semibold text-[var(--color-text-primary)]">{v.label}</span>
                            {v.current && <span className="rounded bg-[var(--color-accent)]/15 px-1.5 py-0.5 text-xs font-medium text-[var(--color-accent)]">Current</span>}
                        </div>
                        <span className="text-xs text-[var(--color-text-muted)]">{v.author} · {v.date}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
