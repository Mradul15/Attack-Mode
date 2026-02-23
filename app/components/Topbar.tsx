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
                <div className="topbar__avatar">U</div>
            </div>
        </header>
    );
}
