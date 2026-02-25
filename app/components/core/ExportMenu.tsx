"use client";

import { useState } from "react";

interface ExportMenuProps {
    formats?: string[];
    onExport?: (format: string) => void;
    className?: string;
}

export default function ExportMenu({
    formats = ["CSV", "JSON", "PDF"],
    onExport,
    className = "",
}: ExportMenuProps) {
    const [open, setOpen] = useState(false);

    return (
        <div className={`relative ${className}`}>
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-raised)] px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-hover)]"
                aria-label="Export options"
            >
                <span>↓</span>
                Export
            </button>
            {open && (
                <div className="absolute right-0 top-full z-20 mt-1 min-w-[120px] rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] py-1 shadow-xl">
                    {formats.map((fmt) => (
                        <button
                            key={fmt}
                            onClick={() => {
                                onExport?.(fmt);
                                setOpen(false);
                            }}
                            className="block w-full px-3 py-2 text-left text-sm text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]"
                        >
                            {fmt}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
