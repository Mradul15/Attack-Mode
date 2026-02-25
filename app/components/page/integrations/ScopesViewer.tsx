interface ScopesViewerProps {
    scopes?: { name: string; description: string; granted: boolean }[];
    className?: string;
}

const defaultScopes = [
    { name: "channels:read", description: "View channel information", granted: true },
    { name: "channels:write", description: "Create and archive channels", granted: true },
    { name: "users:read", description: "View user information", granted: true },
    { name: "chat:write", description: "Send messages", granted: false },
];

export default function ScopesViewer({
    scopes = defaultScopes,
    className = "",
}: ScopesViewerProps) {
    return (
        <div className={`rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5 ${className}`}>
            <h3 className="mb-3 text-sm font-semibold text-[var(--color-text-primary)]">Permission Scopes</h3>
            <div className="space-y-2">
                {scopes.map((scope) => (
                    <div key={scope.name} className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-root)] px-3 py-2.5">
                        <div>
                            <span className="font-mono text-sm text-[var(--color-text-primary)]">{scope.name}</span>
                            <p className="text-xs text-[var(--color-text-muted)]">{scope.description}</p>
                        </div>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${scope.granted ? "bg-green-500/15 text-green-400" : "bg-zinc-500/15 text-zinc-400"}`}>
                            {scope.granted ? "Granted" : "Not granted"}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
