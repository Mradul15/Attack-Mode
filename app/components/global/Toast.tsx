export type ToastVariant = "success" | "error" | "info";

interface ToastProps {
    message: string;
    variant?: ToastVariant;
    visible?: boolean;
    onClose?: () => void;
}

const variantStyles: Record<ToastVariant, string> = {
    success: "border-green-500/30 bg-green-500/10 text-green-400",
    error: "border-red-500/30 bg-red-500/10 text-red-400",
    info: "border-blue-500/30 bg-blue-500/10 text-blue-400",
};

const icons: Record<ToastVariant, string> = {
    success: "✓",
    error: "✕",
    info: "ℹ",
};

export default function Toast({
    message,
    variant = "success",
    visible = true,
    onClose,
}: ToastProps) {
    if (!visible) return null;

    return (
        <div
            role="status"
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium shadow-lg backdrop-blur-sm transition-all ${variantStyles[variant]}`}
        >
            <span className="text-base">{icons[variant]}</span>
            <span>{message}</span>
            {onClose && (
                <button
                    onClick={onClose}
                    className="ml-2 opacity-60 transition-opacity hover:opacity-100"
                    aria-label="Close toast"
                >
                    ✕
                </button>
            )}
        </div>
    );
}
