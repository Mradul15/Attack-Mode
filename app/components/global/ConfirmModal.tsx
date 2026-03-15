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
            <div className="glass-elevated relative w-full max-w-md rounded-xl p-6 animate-scale-in">
                <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">{title}</h2>
                {description && (
                    <p className="mt-2 text-sm text-[var(--color-text-muted)]">{description}</p>
                )}
                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onCancel} className="btn-secondary text-sm">
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`btn-primary text-sm ${destructive
                                ? "!bg-red-500/90 hover:!bg-red-500 hover:!shadow-[0_0_20px_rgba(239,68,68,0.15)]"
                                : ""
                            }`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
