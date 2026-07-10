export function parseModelJson<T>(raw: string | undefined, fallback: T): T {
    try {
        if (!raw?.trim()) return fallback;

        const cleaned = raw
            .trim()
            .replace(/^```(?:json)?\s*/i, "")
            .replace(/\s*```$/, "")
            .trim();

        return JSON.parse(cleaned) as T;
    } catch {
        return fallback;
    }
}
