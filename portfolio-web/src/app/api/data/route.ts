import { NextResponse } from 'next/server';
import { getContent } from '@/lib/actions';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const format = searchParams.get('format') || 'csv';

    try {
        const content = await getContent();
        if (!content) {
            return NextResponse.json({ error: 'Content not found' }, { status: 404 });
        }

        let data: any = "";
        let contentType = 'application/json';

        if (format === 'csv') {
            contentType = 'text/csv';
            switch (type) {
                case 'testimonials':
                    data = "Name,Review,Image,Category\n" +
                        content.testimonials.map((t: any) =>
                            `"${t.name}","${t.review.replace(/"/g, '""')}","${t.image}","Client"`
                        ).join("\n");
                    break;
                case 'faqs':
                    data = "Question,Answer\n" +
                        content.faqs.map((f: any) =>
                            `"${f.question}","${f.answer.replace(/"/g, '""')}"`
                        ).join("\n");
                    break;
                case 'stats':
                    data = "Views,Clients\n" + `${content.stats.views},${content.stats.clients}`;
                    break;
                default:
                    return NextResponse.json({ error: 'Invalid type for CSV' }, { status: 400 });
            }
        } else {
            // JSON Format
            switch (type) {
                case 'testimonials': data = content.testimonials; break;
                case 'faqs': data = content.faqs; break;
                case 'stats': data = content.stats; break;
                case 'categories': data = content.categories; break;
                default: data = content; break;
            }
        }

        return new NextResponse(format === 'csv' ? data : JSON.stringify(data), {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'no-store, max-age=0' // Always fresh for admin changes
            },
        });
    } catch (error) {
        console.error(`Error fetching ${type}:`, error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
