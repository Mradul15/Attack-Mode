import PageShell from "@/app/components/PageShell";

export default function IncidentReportPage({ params }: { params: Promise<{ id: string }> }) {
    return (
        <PageShell
            title="Incident Report"
            description="Post-incident report and retrospective."
            sections={["Summary", "Timeline of Events", "Root Cause Analysis", "Action Items", "Metrics"]}
        />
    );
}
