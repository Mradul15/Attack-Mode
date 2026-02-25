interface BreakGlassActivationModalProps {
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function BreakGlassActivationModal({
    open,
    onConfirm,
    onCancel,
}: BreakGlassActivationModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
            <div className="relative w-full max-w-md rounded-xl border border-red-500/30 bg-[var(--color-bg-surface)] p-6 shadow-2xl">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-2xl">
                    🚨
                </div>
                <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
                    Break Glass Access
                </h2>
                <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                    This will grant emergency elevated access. All actions will be audited and security will
                    be notified immediately. This should only be used in critical situations.
                </p>
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-raised)] px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-hover)]"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="rounded-lg bg-red-500/90 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-500"
                    >
                        Activate Break Glass
                    </button>
                </div>
            </div>
        </div>
    );
}
