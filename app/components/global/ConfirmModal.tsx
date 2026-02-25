interface ConfirmModalProps {
    open: boolean;
    title: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    destructive?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmModal({
    open,
    title,
    description,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    destructive = false,
    onConfirm,
    onCancel,
}: ConfirmModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
            <div className="relative w-full max-w-md rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-6 shadow-2xl">
                <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">{title}</h2>
                {description && (
                    <p className="mt-2 text-sm text-[var(--color-text-muted)]">{description}</p>
                )}
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-raised)] px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-hover)]"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${destructive
                                ? "bg-red-500/90 text-white hover:bg-red-500"
                                : "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]"
                            }`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
