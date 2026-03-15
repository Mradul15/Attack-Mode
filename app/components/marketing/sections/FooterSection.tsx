import Link from "next/link";

export default function FooterSection() {
    return (
        <footer className="landing-footer">
            <div className="landing-footer__inner">
                <div className="landing-footer__brand">
                    <span className="landing-footer__brand-mark">⚡</span>
                    <div>
                        <p className="landing-footer__brand-name">
                            Attack Mode
                        </p>
                        <p className="landing-footer__brand-copy">
                            Response plans, converted into live execution.
                        </p>
                    </div>
                </div>
                <nav className="landing-footer__links">
                    <a href="#product">Product</a>
                    <a href="#how-it-works">How It Works</a>
                    <a href="#trust">Trust</a>
                    <Link href="/login">Log In</Link>
                </nav>
            </div>
        </footer>
    );
}
