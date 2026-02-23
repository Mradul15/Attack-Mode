import PageShell from "@/app/components/PageShell";

export default function RunbooksPage() {
    return (
        <PageShell
            title="Runbooks"
            description="Manage incident response playbooks and procedures."
            sections={["Runbook Library", "Filters & Categories", "Quick Actions"]}
        />
    );
}
