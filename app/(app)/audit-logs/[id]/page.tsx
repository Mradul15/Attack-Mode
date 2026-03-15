import PageShell from "@/app/components/PageShell";

export default function AuditLogDetailPage({ params: _params }: { params: Promise<{ id: string }> }) {
    return (
        <PageShell
            title="Audit Log Detail"
            description="Detailed view of a specific audit log entry."
            sections={["Event Summary", "Actor & Target", "Metadata", "Raw Payload"]}
        />
    );
}
