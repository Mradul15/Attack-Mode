interface SecretRevealOnceModalProps {
    open: boolean;
    title?: string;
    secret?: string;
    onClose: () => void;
}

export default function SecretRevealOnceModal({
    open,
    title = "Secret Value",
    secret = "sk-••••••••••••••••••••••••••••3f7a",
    onClose,
}: SecretRevealOnceModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-6 shadow-2xl">
                <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">{title}</h2>
                <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                    This secret will only be shown once. Copy it now.
                </p>
                <div className="mt-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-root)] p-3 font-mono text-sm text-[var(--color-text-primary)]">
                    {secret}
                </div>
                <div className="mt-4 flex justify-end gap-3">
                    <button className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-raised)] px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-hover)]">
                        Copy
                    </button>
                    <button
                        onClick={onClose}
                        className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)]"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}
