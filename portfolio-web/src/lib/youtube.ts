import { PortfolioItem } from "@/data/portfolio";

export interface PlaylistItem {
    id: string;
    title: string;
    videoUrl: string;
    thumbnail: string;
}

// Simple in-memory cache
const cache = new Map<string, { data: any, timestamp: number }>();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

export async function getPlaylistData(playlistId: string): Promise<PortfolioItem[]> {
    try {
        // Check cache first
        const cached = cache.get(playlistId);
        if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
            console.log(`[YouTube Lib] Serving ${playlistId} from cache`);
            return cached.data;
        }

        // Fallback to scraping properly if RSS is lagging
        const playlistUrl = `https://www.youtube.com/playlist?list=${playlistId}`;

        const response = await fetch(playlistUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            next: { revalidate: 1800 } // Cache for 30 mins in Next.js
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch playlist page: ${response.statusText}`);
        }

        const html = await response.text();

        // Robust regex to find video IDs
        const videoIdMatches = html.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g);
        const uniqueIds = new Set<string>();

        for (const match of videoIdMatches) {
            uniqueIds.add(match[1]);
        }

        const videoIds = Array.from(uniqueIds).reverse();

        if (videoIds.length === 0) {
            console.warn(`[YouTube Lib] No video IDs found for playlist ${playlistId}`);
            return [];
        }

        // Fetch details for each video using oEmbed (parallel requests)
        const itemPromises = videoIds.map(async (videoId, index): Promise<PortfolioItem | null> => {
            try {
                const oembedUrl = `https://www.youtube.com/embed/${videoId}`;
                // Using oembed proxy to get title
                const oembedJsonUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(oembedUrl)}&format=json`;
                const res = await fetch(oembedJsonUrl);
                if (!res.ok) return null;
                const data = await res.json() as { title?: string };

                return {
                    id: `yt-${playlistId}-${videoId}-${index}`,
                    title: data.title || "Untitled Video",
                    videoUrl: videoId.length === 11 ? `https://www.youtube.com/watch?v=${videoId}` : `https://www.youtube.com/shorts/${videoId}`,
                    thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
                };
            } catch (e) {
                console.error(`Failed to fetch details for ${videoId}`, e);
                return null;
            }
        });

        const resolvedItems = await Promise.all(itemPromises);
        const items = resolvedItems.filter((item): item is PortfolioItem => item !== null);

        // Store in cache
        cache.set(playlistId, { data: items, timestamp: Date.now() });

        return items;

    } catch (error) {
        console.error('[YouTube Lib] Error fetching playlist:', error);
        return [];
    }
}
