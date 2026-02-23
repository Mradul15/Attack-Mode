import PageShell from "@/app/components/PageShell";

export default function JiraSettingsPage() {
    return (
        <PageShell
            title="Jira Settings"
            description="Configure your Jira integration for ticket syncing and issue tracking."
            sections={["Connection Status", "Project Mapping", "Field Mapping", "Sync Rules"]}
        />
    );
}
