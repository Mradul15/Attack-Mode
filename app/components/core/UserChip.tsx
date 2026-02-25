interface UserChipProps {
    name: string;
    avatarUrl?: string;
    role?: string;
    size?: "sm" | "md";
    className?: string;
}

export default function UserChip({
    name,
    avatarUrl,
    role,
    size = "md",
    className = "",
}: UserChipProps) {
    const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    const sizeClasses = size === "sm" ? "h-6 w-6 text-[10px]" : "h-7 w-7 text-xs";

    return (
        <div className={`inline-flex items-center gap-2 ${className}`}>
            {avatarUrl ? (
                <img
                    src={avatarUrl}
                    alt={name}
                    className={`${sizeClasses} rounded-full object-cover`}
                />
            ) : (
                <div
                    className={`${sizeClasses} flex items-center justify-center rounded-full bg-[var(--color-bg-active)] text-[var(--color-text-secondary)] font-semibold`}
                >
                    {initials}
                </div>
            )}
            <div className="flex flex-col">
                <span className="text-sm font-medium text-[var(--color-text-primary)] leading-tight">
                    {name}
                </span>
                {role && (
                    <span className="text-xs text-[var(--color-text-muted)] leading-tight">{role}</span>
                )}
            </div>
        </div>
    );
}
