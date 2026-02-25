import IncidentHeader from "@/app/components/page/incidents/IncidentHeader";
import NextStepsPanel from "@/app/components/page/incidents/NextStepsPanel";
import TaskBoard from "@/app/components/core/TaskBoard";
import DecisionsPanel from "@/app/components/page/incidents/DecisionsPanel";
import ApprovalsQueue from "@/app/components/page/incidents/ApprovalsQueue";
import TimelinePanel from "@/app/components/page/incidents/TimelinePanel";
import ContextPanel from "@/app/components/page/incidents/ContextPanel";

export default function IncidentDetailPage({ params }: { params: Promise<{ id: string }> }) {
    return (
        <div className="max-w-[1400px]">
            <IncidentHeader />

            {/* 3-column cockpit layout per DESIGN_SYSTEM.md */}
            <div className="mt-6 grid gap-6 lg:grid-cols-12">
                {/* Left column — Actions */}
                <div className="space-y-6 lg:col-span-3">
                    <NextStepsPanel />
                    <DecisionsPanel />
                    <ApprovalsQueue />
                </div>

                {/* Center column — Tasks & Timeline */}
                <div className="space-y-6 lg:col-span-6">
                    <div>
                        <h2 className="mb-3 text-sm font-semibold text-[var(--color-text-primary)]">Task Board</h2>
                        <TaskBoard />
                    </div>
                    <TimelinePanel />
                </div>

                {/* Right column — Context */}
                <div className="lg:col-span-3">
                    <ContextPanel />
                </div>
            </div>
        </div>
    );
}
