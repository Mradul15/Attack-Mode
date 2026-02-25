import FiltersBar from "@/app/components/page/incidents/FiltersBar";
import IncidentsTable from "@/app/components/page/incidents/IncidentsTable";

export default function IncidentsPage() {
    return (
        <div className="max-w-[1400px]">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">Incidents</h1>
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                        View and manage all incidents across your organization.
                    </p>
                </div>
                <a
                    href="/incidents/create"
                    className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)]"
                >
                    Create Incident
                </a>
            </div>

            <div className="mb-4">
                <FiltersBar />
            </div>

            <IncidentsTable />
        </div>
    );
}
