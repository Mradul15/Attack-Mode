import PageShell from "@/app/components/PageShell";

export default function IntegrationsPage() {
    return (
        <PageShell
            title="Integrations"
            description="Connect third-party services to your incident workflows."
            sections={["Connected Services", "Available Integrations", "Integration Health"]}
        />
    );
}
