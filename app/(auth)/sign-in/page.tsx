export default function SignInPage() {
    return (
        <div className="auth-card">
            <h1 className="auth-card__title">Sign In</h1>
            <p className="auth-card__description">
                Sign in to your Attack Mode account to continue.
            </p>
            <div className="page-shell__card" style={{ marginTop: 16 }}>
                <h3 className="page-shell__card-title">Authentication Form</h3>
                <p className="page-shell__card-placeholder">
                    Placeholder for email/password form and SSO buttons.
                </p>
            </div>
        </div>
    );
}
