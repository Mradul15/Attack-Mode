import Link from "next/link";

export default function NotFound() {
    return (
        <div className="error-page" style={{ minHeight: "100vh" }}>
            <p className="error-page__code">404</p>
            <h1 className="error-page__title">Page Not Found</h1>
            <p className="error-page__description">
                The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
            <Link href="/" className="error-page__link">
                ← Back to Dashboard
            </Link>
        </div>
    );
}
