"use client";

import { usePathname } from "next/navigation";

const routeLabels: Record<string, string> = {
    "/": "Dashboard",
    "/incidents": "Incidents",
    "/incidents/create": "Create Incident",
    "/runbooks": "Runbooks",
    "/runbooks/create": "Create Runbook",
    "/integrations": "Integrations",
    "/integrations/slack": "Slack",
    "/integrations/jira": "Jira",
    "/people": "People & Access",
    "/people/roles": "Roles & Permissions",
    "/people/sessions": "Sessions & Devices",
    "/audit-logs": "Audit Logs",
    "/settings": "Settings",
    "/settings/security": "Security",
    "/settings/api": "API & Webhooks",
    "/forbidden": "Forbidden",
    "/rate-limited": "Rate Limited",
};

function getBreadcrumbs(pathname: string): { label: string; href: string }[] {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) return [{ label: "Dashboard", href: "/" }];

    const crumbs: { label: string; href: string }[] = [];
    let path = "";

    for (const seg of segments) {
        path += `/${seg}`;
        const label = routeLabels[path] || seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " ");
        crumbs.push({ label, href: path });
    }

    return crumbs;
}

export default function Topbar() {
    const pathname = usePathname();
    const breadcrumbs = getBreadcrumbs(pathname);

    return (
        <header className="app-shell__topbar topbar">
            <div className="topbar__breadcrumb">
                {breadcrumbs.map((crumb, i) => (
                    <span key={crumb.href}>
                        {i > 0 && <span className="topbar__breadcrumb-separator">/</span>}
                        {i === breadcrumbs.length - 1 ? (
                            <span className="topbar__breadcrumb-current"> {crumb.label}</span>
                        ) : (
                            <span> {crumb.label} </span>
                        )}
                    </span>
                ))}
            </div>

            <div className="topbar__actions">
                {/* Search placeholder */}
                <button
                    className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-root)] px-3 py-1.5 text-xs text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-bg-active)]"
                    aria-label="Search"
                >
                    <span>🔍</span>
                    <span>Search...</span>
                    <kbd className="ml-4 rounded border border-[var(--color-border)] px-1.5 py-0.5 text-[10px] font-mono text-[var(--color-text-muted)]">⌘K</kbd>
                </button>

                {/* Create button */}
                <a
                    href="/incidents/create"
                    className="flex items-center gap-1.5 rounded-lg bg-[var(--color-accent)] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)]"
                >
                    <span>+</span>
                    Create
                </a>

                {/* Notifications placeholder */}
                <button
                    className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] text-sm text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-hover)]"
                    aria-label="Notifications"
                >
                    🔔
                    <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white">
                        3
                    </span>
                </button>

                {/* User menu */}
                <div className="topbar__avatar" title="User Menu">U</div>
            </div>
        </header>
    );
}
