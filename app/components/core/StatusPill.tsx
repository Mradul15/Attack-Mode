export type Status = "active" | "resolved" | "investigating" | "monitoring" | "closed" | "draft" | "published";

interface StatusPillProps {
    status: Status;
    className?: string;
}

const statusStyles: Record<Status, string> = {
    active: "bg-red-500/15 text-red-400",
    investigating: "bg-orange-500/15 text-orange-400",
    monitoring: "bg-yellow-500/15 text-yellow-400",
    resolved: "bg-green-500/15 text-green-400",
    closed: "bg-zinc-500/15 text-zinc-400",
    draft: "bg-zinc-500/15 text-zinc-400",
    published: "bg-green-500/15 text-green-400",
};

export default function StatusPill({ status, className = "" }: StatusPillProps) {
    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusStyles[status]} ${className}`}
        >
            {status}
        </span>
    );
}
