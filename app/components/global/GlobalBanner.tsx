export type BannerVariant = "warning" | "error" | "info";

interface GlobalBannerProps {
    message: string;
    variant?: BannerVariant;
    dismissible?: boolean;
    onDismiss?: () => void;
}

const variantStyles: Record<BannerVariant, string> = {
    warning: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
    error: "bg-red-500/10 border-red-500/30 text-red-400",
    info: "bg-blue-500/10 border-blue-500/30 text-blue-400",
};

export default function GlobalBanner({
    message,
    variant = "info",
    dismissible = true,
    onDismiss,
}: GlobalBannerProps) {
    return (
        <div
            role="alert"
            className={`flex items-center justify-between gap-3 border-b px-6 py-2.5 text-sm font-medium ${variantStyles[variant]}`}
        >
            <div className="flex items-center gap-2">
                <span className="text-xs">⚠</span>
                <span>{message}</span>
            </div>
            {dismissible && (
                <button
                    onClick={onDismiss}
                    className="rounded p-1 opacity-60 transition-opacity hover:opacity-100"
                    aria-label="Dismiss banner"
                >
                    ✕
                </button>
            )}
        </div>
    );
}
