import PageShell from "@/app/components/PageShell";

export default function RunbookEditorPage({ params }: { params: Promise<{ id: string }> }) {
    return (
        <PageShell
            title="Runbook Editor"
            description="Edit runbook steps, roles, and automation triggers."
            sections={["Steps", "Variables & Inputs", "Automation Hooks", "Version History"]}
        />
    );
}
