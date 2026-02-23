import PageShell from "@/app/components/PageShell";

export default function IncidentDetailPage({ params }: { params: Promise<{ id: string }> }) {
    return (
        <PageShell
            title="Incident Detail"
            description="Attack Mode — real-time incident command center."
            sections={["Status & Severity", "Timeline", "Tasks", "Status Updates", "Responders", "Linked Resources"]}
        />
    );
}
