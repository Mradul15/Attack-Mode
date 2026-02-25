import ActiveIncidentsCard from "@/app/components/page/dashboard/ActiveIncidentsCard";
import MyTasksDueSoonList from "@/app/components/page/dashboard/MyTasksDueSoonList";
import RecentActivityTimeline from "@/app/components/page/dashboard/RecentActivityTimeline";
import SystemHealthCard from "@/app/components/page/dashboard/SystemHealthCard";
import QuickActionsPanel from "@/app/components/page/dashboard/QuickActionsPanel";

export default function DashboardPage() {
    return (
        <div className="max-w-[1400px]">
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">Dashboard</h1>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                    Overview of your organization&apos;s incident response activity.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <ActiveIncidentsCard />
                </div>
                <div>
                    <SystemHealthCard />
                </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-3">
                <div>
                    <MyTasksDueSoonList />
                </div>
                <div>
                    <RecentActivityTimeline />
                </div>
                <div>
                    <QuickActionsPanel />
                </div>
            </div>
        </div>
    );
}
