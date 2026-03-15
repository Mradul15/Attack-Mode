"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const supabase = createClient();

        // Sign up with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { name },
            },
        });

        if (authError) {
            setError(authError.message);
            setLoading(false);
            return;
        }

        // Create user profile in our users table
        if (authData.user) {
            const userId = `usr_${Date.now().toString(36)}`;
            const { error: profileError } = await supabase.from("users").insert({
                user_id: userId,
                auth_uid: authData.user.id,
                name,
                email,
                role: "Observer", // Default role for new signups
                org_id: "org_acme", // Default org for now
            });

            if (profileError) {
                setError(profileError.message);
                setLoading(false);
                return;
            }
        }

        // If email confirmation is required
        if (authData.user && !authData.session) {
            setSuccess(true);
            setLoading(false);
            return;
        }

        router.push("/dashboard");
        router.refresh();
    }

    if (success) {
        return (
            <div className="w-full max-w-sm animate-fade-in-up">
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-8 text-center">
                    <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Check your email</h2>
                    <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                        We&apos;ve sent a confirmation link to <strong>{email}</strong>.
                    </p>
                    <Link href="/sign-in" className="btn-secondary mt-4 inline-block text-sm">
                        Back to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-sm animate-fade-in-up">
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-8">
                <div className="mb-6 text-center">
                    <h1 className="text-xl font-bold text-[var(--color-text-primary)]">
                        Create Account
                    </h1>
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                        Get started with Attack Mode
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="mb-1.5 block text-xs font-medium text-[var(--color-text-muted)]">
                            Full Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input w-full text-sm"
                            placeholder="Alice Chen"
                            required
                        />
                    </div>

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
                            minLength={6}
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
                        {loading ? "Creating account..." : "Create Account"}
                    </button>
                </form>

                <p className="mt-4 text-center text-xs text-[var(--color-text-muted)]">
                    Already have an account?{" "}
                    <Link href="/sign-in" className="text-[var(--color-accent)] hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
