import Link from "next/link";

export default function ForbiddenPage() {
    return (
        <div className="error-page">
            <p className="error-page__code">403</p>
            <h1 className="error-page__title">Permission Denied</h1>
            <p className="error-page__description">
                You don&apos;t have permission to access this resource. Contact your administrator if you believe this is an error.
            </p>
            <Link href="/" className="error-page__link">
                ← Back to Dashboard
            </Link>
        </div>
    );
}
