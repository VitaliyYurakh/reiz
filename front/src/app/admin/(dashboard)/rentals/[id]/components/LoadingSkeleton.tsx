export function LoadingSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="h-8 w-8 animate-pulse rounded bg-muted" />
                <div className="h-8 w-64 animate-pulse rounded bg-muted" />
                <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
            </div>
            <div className="flex gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-9 w-24 animate-pulse rounded-md bg-muted" />
                ))}
            </div>
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />
            ))}
        </div>
    );
}
