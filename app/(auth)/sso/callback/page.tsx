export default function SSOCallbackPage() {
    return (
        <div className="auth-card">
            <h1 className="auth-card__title">SSO Authentication</h1>
            <p className="auth-card__description">
                Processing your single sign-on request. Please wait...
            </p>
            <div className="page-shell__card" style={{ marginTop: 16 }}>
                <h3 className="page-shell__card-title">SSO Callback</h3>
                <p className="page-shell__card-placeholder">
                    Placeholder for SSO provisioning and redirect logic.
                </p>
            </div>
        </div>
    );
}
