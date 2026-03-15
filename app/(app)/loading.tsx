export default function DashboardLoading() {
    return (
        <div className="max-w-[1400px] animate-fade-in">
            {/* Header skeleton */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <div className="skeleton skeleton-heading mb-2" />
                    <div className="skeleton skeleton-text w-64" />
                </div>
                <div className="skeleton h-9 w-32 rounded-lg" />
            </div>

            {/* Stats strip skeleton */}
            <div className="mb-6 grid grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="skeleton skeleton-card rounded-xl" />
                ))}
            </div>

            {/* Main content skeleton */}
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <div className="skeleton h-64 rounded-xl" />
                </div>
                <div>
                    <div className="skeleton h-64 rounded-xl" />
                </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="skeleton h-48 rounded-xl" />
                ))}
            </div>
        </div>
    );
}
