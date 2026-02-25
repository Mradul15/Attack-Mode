interface FiltersBarProps {
    filters?: { label: string; options: string[] }[];
    onSearch?: (query: string) => void;
    className?: string;
}

const defaultFilters = [
    { label: "Status", options: ["All", "Active", "Investigating", "Monitoring", "Resolved", "Closed"] },
    { label: "Severity", options: ["All", "S0", "S1", "S2", "S3", "S4"] },
    { label: "Assignee", options: ["All", "Me", "Unassigned"] },
];

export default function FiltersBar({
    filters = defaultFilters,
    className = "",
}: FiltersBarProps) {
    return (
        <div className={`flex flex-wrap items-center gap-3 ${className}`}>
            <div className="flex-1">
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full max-w-sm rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-root)] px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none focus:border-[var(--color-accent)]"
                    aria-label="Search"
                />
            </div>
            {filters.map((filter) => (
                <select
                    key={filter.label}
                    className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-raised)] px-3 py-2 text-sm text-[var(--color-text-secondary)] outline-none focus:border-[var(--color-accent)]"
                    aria-label={filter.label}
                >
                    {filter.options.map((opt) => (
                        <option key={opt} value={opt}>
                            {filter.label}: {opt}
                        </option>
                    ))}
                </select>
            ))}
        </div>
    );
}
