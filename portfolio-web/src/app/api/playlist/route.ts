import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Simple in-memory cache
const cache = new Map<string, { data: any, timestamp: number }>()
const CACHE_TTL = 30 * 60 * 1000 // 30 minutes

interface PlaylistItem {
    id: string
    title: string
    videoUrl: string
    thumbnail: string
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const playlistId = searchParams.get('id') || 'PLwMaPG6M4YK09yXKMCMztMjBpnifSs33s'

        // Check cache first
        const cached = cache.get(playlistId)
        if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
            console.log(`[API] Serving ${playlistId} from cache`)
            return NextResponse.json({ items: cached.data, success: true })
        }

        // Fallback to scraping properly if RSS is lagging
        const playlistUrl = `https://www.youtube.com/playlist?list=${playlistId}`

        const response = await fetch(playlistUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            cache: 'no-store'
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch playlist page: ${response.statusText}`)
        }

        const html = await response.text()

        // Robust regex to find video IDs
        // Matches patterns like "videoId":"clWBv6XaSLI"
        const videoIdMatches = html.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g)
        const uniqueIds = new Set<string>()

        for (const match of videoIdMatches) {
            uniqueIds.add(match[1])
        }

        const videoIds = Array.from(uniqueIds).reverse()

        if (videoIds.length === 0) {
            throw new Error("No video IDs found in playlist page")
        }

        // Fetch details for each video using oEmbed (parallel requests)
        const itemPromises = videoIds.map(async (videoId, index) => {
            try {
                const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
                const res = await fetch(oembedUrl)
                if (!res.ok) return null
                const data = await res.json()

                return {
                    id: `sf${index + 1}`,
                    title: data.title,
                    videoUrl: `https://www.youtube.com/shorts/${videoId}`,
                    thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
                }
            } catch (e) {
                console.error(`Failed to fetch details for ${videoId}`, e)
                return null
            }
        })

        const items = (await Promise.all(itemPromises)).filter((item): item is PlaylistItem => item !== null)

        // Store in cache
        cache.set(playlistId, { data: items, timestamp: Date.now() })

        return NextResponse.json({ items, success: true })

    } catch (error) {
        console.error('Error fetching playlist:', error)
        return NextResponse.json(
            {
                items: [],
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}
