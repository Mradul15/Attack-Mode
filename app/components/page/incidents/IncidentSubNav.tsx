"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface IncidentSubNavProps {
    incidentId: string;
    /** Counts to display as badges on tabs */
    counts?: {
        activeTasks?: number;
        pendingApprovals?: number;
        timelineEvents?: number;
    };
}

interface Tab {
    key: string;
    label: string;
    href: (id: string) => string;
    match: (pathname: string, id: string) => boolean;
}

const tabs: Tab[] = [
    {
        key: "overview",
        label: "Overview",
        href: (id) => `/incidents/${id}`,
        match: (pathname, id) => pathname === `/incidents/${id}`,
    },
    {
        key: "execute",
        label: "Execute",
        href: (id) => `/incidents/${id}/execute`,
        match: (pathname, id) => pathname === `/incidents/${id}/execute`,
    },
    {
        key: "updates",
        label: "Updates",
        href: (id) => `/incidents/${id}/updates`,
        match: (pathname, id) => pathname === `/incidents/${id}/updates`,
    },
];

export default function IncidentSubNav({ incidentId, counts }: IncidentSubNavProps) {
    const pathname = usePathname();

    return (
        <nav className="flex gap-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-1">
            {tabs.map((tab) => {
                const active = tab.match(pathname, incidentId);
                const badge =
                    tab.key === "execute"
                        ? (counts?.activeTasks ?? 0) + (counts?.pendingApprovals ?? 0)
                        : tab.key === "updates"
                            ? counts?.timelineEvents
                            : undefined;

                return (
                    <Link
                        key={tab.key}
                        href={tab.href(incidentId)}
                        aria-current={active ? "page" : undefined}
                        className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${active
                                ? "bg-[var(--color-bg-active)] text-[var(--color-text-primary)]"
                                : "text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]"
                            }`}
                    >
                        {tab.label}
                        {badge != null && badge > 0 && (
                            <span
                                className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none ${active
                                        ? "bg-[var(--color-accent)]/15 text-[var(--color-accent)]"
                                        : "bg-[var(--color-bg-active)] text-[var(--color-text-muted)]"
                                    }`}
                            >
                                {badge}
                            </span>
                        )}
                    </Link>
                );
            })}
        </nav>
    );
}
