"use client";

import { useState } from "react";
import { TERMINOLOGY } from "@/lib/ui/terminology";

interface GlossaryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function GlossaryModal({ isOpen, onClose }: GlossaryModalProps) {
    const [search, setSearch] = useState("");

    if (!isOpen) return null;

    const filtered = search.trim()
        ? TERMINOLOGY.filter(
              (t) =>
                  t.friendly.toLowerCase().includes(search.toLowerCase()) ||
                  t.canonical.toLowerCase().includes(search.toLowerCase()) ||
                  t.definition.toLowerCase().includes(search.toLowerCase()),
          )
        : TERMINOLOGY;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh]">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="glass-elevated relative w-full max-w-lg rounded-2xl animate-scale-in">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
                    <h2 className="text-base font-bold text-[var(--color-text-primary)]">Glossary</h2>
                    <button
                        onClick={onClose}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)]"
                    >
                        ✕
                    </button>
                </div>

                {/* Search */}
                <div className="border-b border-[var(--color-border)] px-5 py-3">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search terms..."
                        className="input text-sm"
                        autoFocus
                    />
                </div>

                {/* Terms list */}
                <div className="max-h-[50vh] overflow-y-auto px-5 py-3">
                    {filtered.length === 0 ? (
                        <p className="py-6 text-center text-sm text-[var(--color-text-muted)]">No matching terms</p>
                    ) : (
                        <div className="space-y-4">
                            {filtered.map((t) => (
                                <div key={t.key}>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                                            {t.friendly}
                                        </span>
                                        <span className="text-xs text-[var(--color-text-muted)]">({t.canonical})</span>
                                    </div>
                                    <p className="mt-0.5 text-sm text-[var(--color-text-secondary)] leading-relaxed">
                                        {t.definition}
                                    </p>
                                    <div className="mt-1 flex flex-wrap gap-1">
                                        {t.usedIn.map((loc) => (
                                            <span
                                                key={loc}
                                                className="rounded bg-[var(--color-bg-active)] px-1.5 py-0.5 text-[10px] text-[var(--color-text-muted)]"
                                            >
                                                {loc}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-[var(--color-border)] px-5 py-3">
                    <p className="text-[10px] text-[var(--color-text-muted)]">
                        {TERMINOLOGY.length} terms &middot; Source: lib/ui/terminology.ts
                    </p>
                </div>
            </div>
        </div>
    );
}
