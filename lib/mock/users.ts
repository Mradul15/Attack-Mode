import type { User, Role } from "@/lib/types";

export const mockUsers: User[] = [
    {
        user_id: "usr_1",
        name: "Alice Chen",
        email: "alice@acme.com",
        role: "Admin",
        org_id: "org_acme",
    },
    {
        user_id: "usr_2",
        name: "Bob Park",
        email: "bob@acme.com",
        role: "IC",
        org_id: "org_acme",
    },
    {
        user_id: "usr_3",
        name: "Carol Wu",
        email: "carol@acme.com",
        role: "Responder",
        org_id: "org_acme",
    },
    {
        user_id: "usr_4",
        name: "Dan Kim",
        email: "dan@acme.com",
        role: "Observer",
        org_id: "org_acme",
    },
    {
        user_id: "usr_5",
        name: "Eve Robinson",
        email: "eve@acme.com",
        role: "Legal/Comms",
        org_id: "org_acme",
    },
];

/** Default current user — Admin for dev */
export let currentUser: User = { ...mockUsers[0] };

export function setCurrentUserRole(role: Role): void {
    const user = mockUsers.find((u) => u.role === role);
    if (user) {
        currentUser = { ...user };
    }
}

export function getCurrentUser(): User {
    return currentUser;
}

export function getUserById(id: string): User | undefined {
    return mockUsers.find((u) => u.user_id === id);
}

export function getUserName(id: string): string {
    return getUserById(id)?.name ?? "Unknown";
}
