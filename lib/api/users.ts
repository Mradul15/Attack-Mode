/**
 * User API — provides user lookup via Supabase.
 */

import { createClient } from "@supabase/supabase-js";
import type { User } from "@/lib/types";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// In-memory cache for user lookups (populated on first call)
let _usersCache: User[] | null = null;

async function ensureCache(): Promise<User[]> {
    if (_usersCache) return _usersCache;
    const { data } = await supabase.from("users").select("*");
    _usersCache = data ?? [];
    return _usersCache;
}

/** Invalidate cache (call after user mutations) */
export function invalidateUsersCache(): void {
    _usersCache = null;
}

export function getUserName(id: string): string {
    // Synchronous fallback for existing callers — uses cache if available
    if (_usersCache) {
        return _usersCache.find((u) => u.user_id === id)?.name ?? "Unknown";
    }
    return "Loading...";
}

export function getUserById(id: string): User | undefined {
    if (_usersCache) {
        return _usersCache.find((u) => u.user_id === id);
    }
    return undefined;
}

export function getUsers(): User[] {
    return _usersCache ?? [];
}

/** Async user loading — call this on app init to populate cache */
export async function loadUsers(): Promise<User[]> {
    return ensureCache();
}

/** Async user name lookup */
export async function getUserNameAsync(id: string): Promise<string> {
    const users = await ensureCache();
    return users.find((u) => u.user_id === id)?.name ?? "Unknown";
}
