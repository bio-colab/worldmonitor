const hydrationCache = new Map<string, { value: unknown; ts: number }>();
const CACHE_ENTRY_TTL_MS = 10 * 60 * 1000;

export function getHydratedData(key: string): unknown | undefined {
  const entry = hydrationCache.get(key);
  if (!entry) return undefined;
  hydrationCache.delete(key);
  return entry.value;
}

function populateCache(data: Record<string, unknown>): void {
  for (const [k, v] of Object.entries(data)) {
    if (v !== null && v !== undefined) {
      hydrationCache.set(k, { value: v, ts: Date.now() });
    }
  }
}

async function fetchTier(tier: string, signal: AbortSignal): Promise<void> {
  try {
    const resp = await fetch(`/api/bootstrap?tier=${tier}`, { signal });
    if (!resp.ok) return;
    const { data } = (await resp.json()) as { data: Record<string, unknown> };
    populateCache(data);
  } catch {
    // silent — panels fall through to individual calls
  }
}

export async function fetchBootstrapData(): Promise<void> {
  // Each tier gets its own abort controller so a slow response in one
  // doesn't kill the other. Timeouts are generous — bootstrap data is
  // critical for instant panel rendering.
  const fastCtrl = new AbortController();
  const slowCtrl = new AbortController();
  const fastTimeout = setTimeout(() => fastCtrl.abort(), 3_000);
  const slowTimeout = setTimeout(() => slowCtrl.abort(), 5_000);
  try {
    trimHydrationCache();
    await Promise.all([
      fetchTier('slow', slowCtrl.signal),
      fetchTier('fast', fastCtrl.signal),
    ]);
  } finally {
    clearTimeout(fastTimeout);
    clearTimeout(slowTimeout);
  }
}

function trimHydrationCache(): void {
  const now = Date.now();
  for (const [key, entry] of hydrationCache.entries()) {
    if (now - entry.ts > CACHE_ENTRY_TTL_MS) hydrationCache.delete(key);
  }
}

window.addEventListener('wm:cache-trim', () => {
  hydrationCache.clear();
});
