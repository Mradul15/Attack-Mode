import Link from "next/link";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="landing-root">
            {/* Floating nav */}
            <nav className="landing-nav">
                <div className="landing-nav__inner">
                    <Link href="/" className="landing-nav__logo">
                        <span className="landing-nav__logo-icon">⚡</span>
                        Attack Mode
                    </Link>
                    <div className="landing-nav__meta">
                        <div className="landing-nav__section-links">
                            <a href="#product" className="landing-nav__link">
                                Product
                            </a>
                            <a href="#how-it-works" className="landing-nav__link">
                                How It Works
                            </a>
                            <a href="#trust" className="landing-nav__link">
                                Trust
                            </a>
                        </div>
                        <div className="landing-nav__links">
                            <Link href="/login" className="landing-nav__link">
                                Log In
                            </Link>
                            <Link href="/signup" className="landing-nav__cta">
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
            {children}
        </div>
    );
}
