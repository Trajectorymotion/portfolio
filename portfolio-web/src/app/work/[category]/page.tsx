import { notFound, redirect } from "next/navigation";
import { portfolioCategories, PortfolioItem } from "@/data/portfolio";
import { ShowcaseSection } from "@/components/ShowcaseSection";

// Fetch dynamic playlist data
async function fetchPlaylistData(playlistId: string): Promise<PortfolioItem[]> {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
        const response = await fetch(`${baseUrl}/api/playlist?id=${playlistId}`, {
            cache: 'no-store' // Always fetch fresh data
        })

        if (!response.ok) {
            throw new Error('Failed to fetch playlist')
        }

        const data = await response.json()
        return data.success ? data.items : []
    } catch (error) {
        console.error('Error fetching playlist:', error)
        return []
    }
}

export default async function CategoryPage({
    params,
}: {
    params: Promise<{ category: string }>
}) {
    const { category: categoryId } = await params;
    const categoryData = portfolioCategories.find(c => c.id === categoryId);

    if (!categoryData) {
        notFound();
    }

    // Fetch dynamic data for both short-form and long-form
    let items = categoryData.items;
    let secondaryItems: PortfolioItem[] = [];

    if (categoryId === 'short-form' || categoryId === 'long-form' || categoryId === 'saas') {
        const { SHORT_FORM_PLAYLIST_ID, LONG_FORM_PLAYLIST_ID, SAAS_PLAYLIST_ID, SAAS_916_PLAYLIST_ID } = await import("@/data/portfolio");

        let primaryPlaylistId = '';
        if (categoryId === 'short-form') primaryPlaylistId = SHORT_FORM_PLAYLIST_ID;
        else if (categoryId === 'long-form') primaryPlaylistId = LONG_FORM_PLAYLIST_ID;
        else if (categoryId === 'saas') primaryPlaylistId = SAAS_PLAYLIST_ID;

        console.log(`[CategoryPage] Fetching dynamic playlist data for ${categoryId}...`);

        if (categoryId === 'saas') {
            // Parallel fetch for SaaS (Landscape + Portrait)
            const [primary, secondary] = await Promise.all([
                fetchPlaylistData(primaryPlaylistId),
                fetchPlaylistData(SAAS_916_PLAYLIST_ID)
            ]);
            if (primary.length > 0) items = primary;
            if (secondary.length > 0) secondaryItems = secondary;
        } else {
            const dynamicItems = await fetchPlaylistData(primaryPlaylistId);
            if (dynamicItems.length > 0) items = dynamicItems;
        }
    }

    return (
        <main className="min-h-screen bg-background selection:bg-foreground selection:text-background pb-20 pt-12 sm:pt-16">
            <ShowcaseSection
                id={categoryData.id}
                title={categoryData.title}
                subtitle="Showcase"
                description={categoryData.description}
                items={items}
                secondaryItems={secondaryItems}
                variant={(categoryId === 'long-form' || categoryId === 'saas') ? 'landscape' : 'portrait'}
                showToggle={categoryId === 'saas'}
            />
        </main>
    );
}
