interface DomainAllowlistEditorProps {
    domains?: string[];
    onAdd?: (domain: string) => void;
    onRemove?: (domain: string) => void;
    className?: string;
}

const defaultDomains = ["acme-corp.com", "acme-eng.com"];

export default function DomainAllowlistEditor({
    domains = defaultDomains,
    onRemove,
    className = "",
}: DomainAllowlistEditorProps) {
    return (
        <div className={`space-y-3 ${className}`}>
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Add domain (e.g. example.com)"
                    className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-root)] px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none focus:border-[var(--color-accent)]"
                />
                <button className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)]">
                    Add
                </button>
            </div>
            <div className="space-y-1">
                {domains.map((domain) => (
                    <div
                        key={domain}
                        className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] px-3 py-2"
                    >
                        <span className="font-mono text-sm text-[var(--color-text-primary)]">{domain}</span>
                        <button
                            onClick={() => onRemove?.(domain)}
                            className="text-xs text-[var(--color-text-muted)] transition-colors hover:text-red-400"
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
