"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const supabase = createClient();
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        router.push("/dashboard");
        router.refresh();
    }

    return (
        <div className="w-full max-w-sm animate-fade-in-up">
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-8">
                <div className="mb-6 text-center">
                    <h1 className="text-xl font-bold text-[var(--color-text-primary)]">
                        Attack Mode
                    </h1>
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                        Sign in to your account
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-[var(--color-text-muted)]">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input w-full text-sm"
                            placeholder="you@company.com"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-[var(--color-text-muted)]">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input w-full text-sm"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && (
                        <p className="rounded-lg bg-red-500/10 p-2.5 text-xs text-red-400">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full text-sm disabled:opacity-50"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <p className="mt-4 text-center text-xs text-[var(--color-text-muted)]">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="text-[var(--color-accent)] hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
