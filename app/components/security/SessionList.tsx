interface Session {
    id: string;
    device: string;
    location: string;
    lastActive: string;
    current?: boolean;
}

interface SessionListProps {
    sessions?: Session[];
    onRevoke?: (sessionId: string) => void;
    className?: string;
}

const defaultSessions: Session[] = [
    { id: "1", device: "Chrome on macOS", location: "San Francisco, CA", lastActive: "Now", current: true },
    { id: "2", device: "Firefox on Windows", location: "New York, NY", lastActive: "2 hours ago" },
    { id: "3", device: "Mobile Safari on iOS", location: "Austin, TX", lastActive: "1 day ago" },
];

export default function SessionList({
    sessions = defaultSessions,
    onRevoke,
    className = "",
}: SessionListProps) {
    return (
        <div className={`space-y-2 ${className}`}>
            {sessions.map((session) => (
                <div
                    key={session.id}
                    className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] px-4 py-3"
                >
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-[var(--color-text-primary)]">
                                {session.device}
                            </span>
                            {session.current && (
                                <span className="rounded-full bg-green-500/15 px-2 py-0.5 text-xs font-medium text-green-400">
                                    Current
                                </span>
                            )}
                        </div>
                        <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                            {session.location} · {session.lastActive}
                        </p>
                    </div>
                    {!session.current && (
                        <button
                            onClick={() => onRevoke?.(session.id)}
                            className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/20"
                        >
                            Revoke
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}
