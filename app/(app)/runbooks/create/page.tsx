import PageShell from "@/app/components/PageShell";

export default function CreateRunbookPage() {
    return (
        <PageShell
            title="Create Runbook"
            description="Build a new incident response runbook from scratch or a template."
            sections={["Runbook Details", "Steps Editor", "Assign Roles", "Review & Publish"]}
        />
    );
}
