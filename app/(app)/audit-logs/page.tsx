import PageShell from "@/app/components/PageShell";

export default function AuditLogsPage() {
    return (
        <PageShell
            title="Audit Logs"
            description="Explore a complete audit trail of actions across your organization."
            sections={["Log Explorer", "Filters & Date Range", "Export"]}
        />
    );
}
