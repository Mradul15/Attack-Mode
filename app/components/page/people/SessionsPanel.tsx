import SessionList from "@/app/components/security/SessionList";

interface SessionsPanelProps {
    className?: string;
}

export default function SessionsPanel({ className = "" }: SessionsPanelProps) {
    return (
        <div className={`rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5 ${className}`}>
            <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Active Sessions</h3>
                <button className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/20">
                    Revoke All Others
                </button>
            </div>
            <SessionList />
        </div>
    );
}
