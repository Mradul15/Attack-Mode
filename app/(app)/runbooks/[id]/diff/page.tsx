import PageShell from "@/app/components/PageShell";

export default function RunbookDiffPage({ params: _params }: { params: Promise<{ id: string }> }) {
    return (
        <PageShell
            title="Runbook Diff"
            description="Compare changes between runbook versions."
            sections={["Version Selector", "Diff View", "Change Summary"]}
        />
    );
}
