
function generateRequestId(): string {
    return `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/** Simulate network latency between min and max ms */
export function delay(min = 200, max = 600): Promise<void> {
    const ms = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Wrap a value in an ApiResponse envelope */
export function wrapResponse<T>(data: T): { data: T; request_id: string } {
    return { data, request_id: generateRequestId() };
}

/** Wrap a list in a PaginatedResponse envelope */
export function wrapPaginated<T>(
    items: T[],
    page = 1,
    perPage = 20
): { data: T[]; total: number; page: number; per_page: number; request_id: string } {
    const start = (page - 1) * perPage;
    const slice = items.slice(start, start + perPage);
    return {
        data: slice,
        total: items.length,
        page,
        per_page: perPage,
        request_id: generateRequestId(),
    };
}
