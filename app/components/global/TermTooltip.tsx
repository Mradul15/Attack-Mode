"use client";

import type { ReactNode } from "react";
import { tooltip as getTooltip } from "@/lib/ui/terminology";

interface TermTooltipProps {
    /** Terminology key from lib/ui/terminology.ts */
    termKey: string;
    children: ReactNode;
}

/**
 * Wraps children with a native title tooltip using the definition
 * from the terminology map. Adds a subtle dotted underline to signal
 * the term is defined.
 */
export default function TermTooltip({ termKey, children }: TermTooltipProps) {
    const tip = getTooltip(termKey);
    if (!tip) return <>{children}</>;

    return (
        <span title={tip} className="cursor-help border-b border-dotted border-[var(--color-text-muted)]">
            {children}
        </span>
    );
}
