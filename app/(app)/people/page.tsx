import UsersTable from "@/app/components/page/people/UsersTable";
import RoleEditor from "@/app/components/page/people/RoleEditor";
import PermissionMatrixViewer from "@/app/components/page/people/PermissionMatrixViewer";

export default function PeoplePage() {
    return (
        <div className="max-w-[1400px]">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">People &amp; Access</h1>
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                        Manage users and team members in your organization.
                    </p>
                </div>
                <button className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)]">
                    Invite User
                </button>
            </div>

            <UsersTable />

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <RoleEditor />
                <div>
                    <h3 className="mb-3 text-sm font-semibold text-[var(--color-text-primary)]">Permission Matrix</h3>
                    <PermissionMatrixViewer />
                </div>
            </div>
        </div>
    );
}
