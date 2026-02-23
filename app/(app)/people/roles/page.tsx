import PageShell from "@/app/components/PageShell";

export default function RolesPage() {
    return (
        <PageShell
            title="Roles & Permissions"
            description="Define roles and configure granular access controls."
            sections={["Roles Table", "Permission Matrix", "Create Role"]}
        />
    );
}
