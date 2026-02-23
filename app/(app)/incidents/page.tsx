import PageShell from "@/app/components/PageShell";

export default function IncidentsPage() {
    return (
        <PageShell
            title="Incidents"
            description="View and manage all incidents across your organization."
            sections={["Incident Table", "Filters & Search", "Quick Actions"]}
        />
    );
}
