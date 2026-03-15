"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import type { User, Role, Permission } from "@/lib/types";
import { hasPermission } from "./permissions";
import { createClient } from "@/lib/supabase/client";

interface AuthContextValue {
    user: User;
    role: Role;
    setRole: (role: Role) => void;
    can: (permission: Permission) => boolean;
    loading: boolean;
    signOut: () => Promise<void>;
}

const defaultUser: User = {
    user_id: "",
    name: "Loading...",
    email: "",
    role: "Observer",
    org_id: "",
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User>(defaultUser);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const supabase = createClient();

        async function loadUser() {
            const { data: { user: authUser } } = await supabase.auth.getUser();

            if (authUser) {
                // Fetch user profile from our users table
                const { data: profile } = await supabase
                    .from("users")
                    .select("*")
                    .eq("auth_uid", authUser.id)
                    .single();

                if (profile) {
                    setUser({
                        user_id: profile.user_id,
                        name: profile.name,
                        email: profile.email,
                        role: profile.role as Role,
                        avatar_url: profile.avatar_url ?? undefined,
                        org_id: profile.org_id,
                    });
                } else {
                    // Fallback: user signed up but no profile row yet
                    setUser({
                        user_id: authUser.id,
                        name: authUser.user_metadata?.name ?? authUser.email ?? "User",
                        email: authUser.email ?? "",
                        role: "Observer",
                        org_id: "org_acme",
                    });
                }
            }
            setLoading(false);
        }

        loadUser();

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                setUser(defaultUser);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const setRole = useCallback((role: Role) => {
        setUser((prev) => ({ ...prev, role }));
    }, []);

    const can = useCallback(
        (permission: Permission) => hasPermission(user.role, permission),
        [user.role]
    );

    const signOut = useCallback(async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        window.location.href = "/";
    }, []);

    return (
        <AuthContext.Provider value={{ user, role: user.role, setRole, can, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

/** Hook to get the current user + role + permissions */
export function useMe() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useMe must be used within <AuthProvider>");
    return ctx;
}

/** Convenience hook: returns true if the current role has the given permission */
export function usePermission(permission: Permission): boolean {
    const { can } = useMe();
    return can(permission);
}
