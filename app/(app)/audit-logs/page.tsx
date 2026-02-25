import AuditFiltersBar from "@/app/components/page/audit/AuditFiltersBar";
import AuditLogTable from "@/app/components/page/audit/AuditLogTable";
import ExportAuditButton from "@/app/components/page/audit/ExportAuditButton";

export default function AuditLogsPage() {
    return (
        <div className="max-w-[1400px]">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">Audit Logs</h1>
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                        Explore a complete audit trail of actions across your organization.
                    </p>
                </div>
                <ExportAuditButton />
            </div>

            <div className="mb-4">
                <AuditFiltersBar />
            </div>

            <AuditLogTable />
        </div>
    );
}
