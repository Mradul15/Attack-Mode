"use client";

import Link from "next/link";

export default function GlobalError({
    error: _error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="error-page" style={{ minHeight: "100vh" }}>
            <p className="error-page__code">500</p>
            <h1 className="error-page__title">Service Degraded</h1>
            <p className="error-page__description">
                Something went wrong. Our team has been notified and is working on a fix.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
                <button onClick={reset} className="error-page__link" style={{ cursor: "pointer" }}>
                    Try Again
                </button>
                <Link href="/" className="error-page__link">
                    ← Back to Dashboard
                </Link>
            </div>
        </div>
    );
}
