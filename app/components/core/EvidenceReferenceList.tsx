interface EvidenceItem {
    id: string;
    label: string;
    type: "link" | "file" | "screenshot" | "log";
    url?: string;
}

interface EvidenceReferenceListProps {
    items: EvidenceItem[];
    className?: string;
}

const typeIcons: Record<EvidenceItem["type"], string> = {
    link: "🔗",
    file: "📄",
    screenshot: "📸",
    log: "📋",
};

const defaultItems: EvidenceItem[] = [
    { id: "1", label: "Grafana dashboard snapshot", type: "link", url: "#" },
    { id: "2", label: "Error logs (2024-01-15)", type: "log", url: "#" },
    { id: "3", label: "Post-mortem draft", type: "file", url: "#" },
];

export default function EvidenceReferenceList({
    items = defaultItems,
    className = "",
}: EvidenceReferenceListProps) {
    return (
        <div className={`space-y-2 ${className}`}>
            {items.map((item) => (
                <a
                    key={item.id}
                    href={item.url || "#"}
                    className="flex items-center gap-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] px-3 py-2.5 text-sm text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-bg-active)] hover:text-[var(--color-text-primary)]"
                >
                    <span>{typeIcons[item.type]}</span>
                    <span>{item.label}</span>
                </a>
            ))}
        </div>
    );
}
