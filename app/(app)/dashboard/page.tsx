import Link from "next/link";
import ActiveIncidentsCard from "@/app/components/page/dashboard/ActiveIncidentsCard";
import MyTasksDueSoonList from "@/app/components/page/dashboard/MyTasksDueSoonList";
import RecentActivityTimeline from "@/app/components/page/dashboard/RecentActivityTimeline";
import SystemHealthCard from "@/app/components/page/dashboard/SystemHealthCard";
import QuickActionsPanel from "@/app/components/page/dashboard/QuickActionsPanel";

export default function DashboardPage() {
    return (
        <div className="max-w-[1400px]">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">Dashboard</h1>
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                        Overview of your organization&apos;s incident response activity.
                    </p>
                </div>
                <Link href="/incidents/create" className="btn-primary text-sm">
                    + New Incident
                </Link>
            </div>

            {/* Stats strip */}
            <div className="mb-6 grid grid-cols-4 gap-3 stagger-children">
                {[
                    { label: "Active Incidents", value: "3", change: "+1 today", color: "text-red-400", bgColor: "border-red-500/20 bg-red-500/5" },
                    { label: "Tasks In Progress", value: "8", change: "2 overdue", color: "text-blue-400", bgColor: "border-blue-500/20 bg-blue-500/5" },
                    { label: "Pending Approvals", value: "4", change: "2 urgent", color: "text-orange-400", bgColor: "border-orange-500/20 bg-orange-500/5" },
                    { label: "MTTR (30d)", value: "47m", change: "-12% vs last month", color: "text-green-400", bgColor: "border-green-500/20 bg-green-500/5" },
                ].map((stat) => (
                    <div key={stat.label} className={`rounded-xl border p-4 ${stat.bgColor}`}>
                        <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                        <div className="text-xs font-semibold text-[var(--color-text-primary)]">{stat.label}</div>
                        <div className="mt-1 text-[10px] text-[var(--color-text-muted)]">{stat.change}</div>
                    </div>
                ))}
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
