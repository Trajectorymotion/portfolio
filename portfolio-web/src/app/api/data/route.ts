import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    let url = '';

    switch (type) {
        case 'testimonials':
            url = process.env.TESTIMONIALS_CSV_URL || '';
            break;
        case 'faqs':
            url = process.env.FAQ_CSV_URL || '';
            break;
        case 'stats':
            url = process.env.STATS_CSV_URL || '';
            break;
        default:
            return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    if (!url) {
        return NextResponse.json({ error: 'URL not configured' }, { status: 500 });
    }

    try {
        const response = await fetch(url, {
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch from Google Sheets: ${response.statusText}`);
        }

        const data = await response.text();
        return new NextResponse(data, {
            headers: {
                'Content-Type': 'text/csv',
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600'
            },
        });
    } catch (error) {
        console.error(`Error proxying ${type}:`, error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
