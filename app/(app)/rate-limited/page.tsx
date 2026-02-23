import Link from "next/link";

export default function RateLimitedPage() {
    return (
        <div className="error-page">
            <p className="error-page__code">429</p>
            <h1 className="error-page__title">Rate Limited</h1>
            <p className="error-page__description">
                You&apos;ve made too many requests. Please wait a moment and try again.
            </p>
            <Link href="/" className="error-page__link">
                ← Back to Dashboard
            </Link>
        </div>
    );
}
