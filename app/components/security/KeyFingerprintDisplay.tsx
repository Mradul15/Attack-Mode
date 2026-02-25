interface KeyFingerprintDisplayProps {
    fingerprint?: string;
    algorithm?: string;
    createdAt?: string;
    className?: string;
}

export default function KeyFingerprintDisplay({
    fingerprint = "SHA256:nThbg6kXUpJWGl7E1IGOCspRo...T8Q",
    algorithm = "RSA-4096",
    createdAt = "2024-01-10",
    className = "",
}: KeyFingerprintDisplayProps) {
    return (
        <div
            className={`rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4 ${className}`}
        >
            <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                <span>🔑</span>
                <span>{algorithm}</span>
                <span>·</span>
                <span>Created {createdAt}</span>
            </div>
            <code className="mt-2 block break-all font-mono text-sm text-[var(--color-text-secondary)]">
                {fingerprint}
            </code>
        </div>
    );
}
