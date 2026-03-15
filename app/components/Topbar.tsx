"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useMe } from "@/lib/auth/auth-context";
import type { Role } from "@/lib/types";

const allRoles: Role[] = ["Admin", "IC", "Responder", "Observer", "Legal/Comms"];

const routeLabels: Record<string, string> = {
    "/dashboard": "Dashboard",
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
        const label =
            routeLabels[path] ||
            seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " ");
        crumbs.push({ label, href: path });
    }

    return crumbs;
}

const roleColors: Record<Role, string> = {
    Admin: "text-red-400",
    IC: "text-orange-400",
    Responder: "text-blue-400",
    Observer: "text-zinc-400",
    "Legal/Comms": "text-purple-400",
};

interface TopbarProps {
    onOpenGlossary?: () => void;
}

export default function Topbar({ onOpenGlossary }: TopbarProps) {
    const pathname = usePathname();
    const breadcrumbs = getBreadcrumbs(pathname);
    const { user, role, setRole, signOut } = useMe();
    const [menuOpen, setMenuOpen] = useState(false);

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
                    <kbd className="ml-4 rounded border border-[var(--color-border)] px-1.5 py-0.5 text-[10px] font-mono text-[var(--color-text-muted)]">
                        ⌘K
                    </kbd>
                </button>

                {/* Create button */}
                <Link
                    href="/incidents/create"
                    className="flex items-center gap-1.5 rounded-lg bg-[var(--color-accent)] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)]"
                >
                    <span>+</span>
                    Create
                </Link>

                {/* Glossary */}
                {onOpenGlossary && (
                    <button
                        onClick={onOpenGlossary}
                        className="flex h-8 items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-2.5 text-xs text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-hover)]"
                        aria-label="Glossary"
                    >
                        <span className="text-sm">📖</span>
                        <span className="hidden sm:inline">Glossary</span>
                    </button>
                )}

                {/* Notifications */}
                <button
                    className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] text-sm text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-hover)]"
                    aria-label="Notifications"
                >
                    🔔
                    <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white">
                        3
                    </span>
                </button>

                {/* User menu with role switcher */}
                <div className="relative">
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] px-2.5 py-1.5 transition-colors hover:bg-[var(--color-bg-hover)]"
                    >
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-bg-active)] text-xs font-semibold text-[var(--color-text-secondary)]">
                            {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                        </div>
                        <div className="hidden text-left sm:block">
                            <p className="text-xs font-medium text-[var(--color-text-primary)] leading-tight">
                                {user.name}
                            </p>
                            <p className={`text-[10px] font-semibold leading-tight ${roleColors[role]}`}>
                                {role}
                            </p>
                        </div>
                    </button>

                    {menuOpen && (
                        <div className="absolute right-0 top-full z-30 mt-1 w-56 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] py-2 shadow-xl">
                            <div className="border-b border-[var(--color-border)] px-3 pb-2">
                                <p className="text-xs text-[var(--color-text-muted)]">{user.email}</p>
                            </div>

                            <div className="border-b border-[var(--color-border)] px-3 py-2">
                                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                                    🔧 Dev Role Switcher
                                </p>
                                {allRoles.map((r) => (
                                    <button
                                        key={r}
                                        onClick={() => {
                                            setRole(r);
                                            setMenuOpen(false);
                                        }}
                                        className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors ${r === role
                                            ? "bg-[var(--color-accent)]/10 font-semibold text-[var(--color-accent)]"
                                            : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]"
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-2 w-2 rounded-full ${r === role ? "bg-[var(--color-accent)]" : "bg-[var(--color-bg-active)]"
                                                }`}
                                        />
                                        {r}
                                    </button>
                                ))}
                            </div>

                            <div className="px-3 pt-2">
                                <button
                                    onClick={() => signOut()}
                                    className="w-full rounded-md px-2 py-1.5 text-left text-xs text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-hover)]"
                                >
                                    Sign out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
