import { NextResponse } from 'next/server'
import { getPlaylistData } from '@/lib/youtube'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const playlistId = searchParams.get('id')

        if (!playlistId) {
            return NextResponse.json({ error: 'Playlist ID is required' }, { status: 400 })
        }

        const items = await getPlaylistData(playlistId);

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
