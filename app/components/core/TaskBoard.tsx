import TaskCard, { type TaskCardProps } from "./TaskCard";

interface TaskColumn {
    id: string;
    title: string;
    tasks: TaskCardProps[];
}

interface TaskBoardProps {
    columns?: TaskColumn[];
    className?: string;
}

const defaultColumns: TaskColumn[] = [
    {
        id: "todo",
        title: "To Do",
        tasks: [
            { title: "Check upstream service health", status: "active", severity: "S1", assignee: "Alice Chen", dueIn: "15m" },
            { title: "Notify affected customers", status: "active", severity: "S2", assignee: "Bob Park" },
        ],
    },
    {
        id: "in-progress",
        title: "In Progress",
        tasks: [
            { title: "Restart primary database cluster", status: "investigating", severity: "S0", assignee: "Dev Team", dueIn: "5m", overdue: true },
        ],
    },
    {
        id: "done",
        title: "Done",
        tasks: [
            { title: "Isolate failing pods", status: "resolved", severity: "S1", assignee: "SRE On-Call" },
        ],
    },
];

export default function TaskBoard({ columns = defaultColumns, className = "" }: TaskBoardProps) {
    return (
        <div className={`flex gap-4 overflow-x-auto pb-2 ${className}`}>
            {columns.map((col) => (
                <div
                    key={col.id}
                    className="flex w-72 shrink-0 flex-col gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-root)] p-3"
                >
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
                            {col.title}
                        </h3>
                        <span className="rounded-full bg-[var(--color-bg-active)] px-2 py-0.5 text-xs font-medium text-[var(--color-text-muted)]">
                            {col.tasks.length}
                        </span>
                    </div>
                    <div className="flex flex-col gap-2">
                        {col.tasks.map((task, i) => (
                            <TaskCard key={i} {...task} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
