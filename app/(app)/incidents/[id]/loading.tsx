export default function IncidentLoading() {
    return (
        <div className="max-w-[1400px] animate-fade-in">
            {/* Header skeleton */}
            <div className="mb-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="skeleton h-5 w-20 rounded" />
                            <div className="skeleton h-5 w-12 rounded-full" />
                            <div className="skeleton h-5 w-24 rounded-full" />
                        </div>
                        <div className="skeleton skeleton-heading w-80 mb-2" />
                        <div className="skeleton skeleton-text w-96" />
                    </div>
                    <div className="flex gap-2">
                        <div className="skeleton h-9 w-28 rounded-lg" />
                        <div className="skeleton h-9 w-28 rounded-lg" />
                    </div>
                </div>
            </div>

            {/* Sub-nav skeleton */}
            <div className="mb-6 flex gap-1">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="skeleton h-9 w-24 rounded-lg" />
                ))}
            </div>

            {/* Content skeleton */}
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-4">
                    <div className="skeleton h-48 rounded-xl" />
                    <div className="skeleton h-64 rounded-xl" />
                </div>
                <div className="space-y-4">
                    <div className="skeleton h-40 rounded-xl" />
                    <div className="skeleton h-32 rounded-xl" />
                    <div className="skeleton h-32 rounded-xl" />
                </div>
            </div>
        </div>
    );
}
