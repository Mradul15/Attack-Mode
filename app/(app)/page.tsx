import PageShell from "@/app/components/PageShell";

export default function DashboardPage() {
    return (
        <PageShell
            title="Dashboard"
            description="Overview of your organization's incident response activity."
            sections={["Active Incidents", "Recent Activity", "Metrics", "On-Call Schedule"]}
        />
    );
}
