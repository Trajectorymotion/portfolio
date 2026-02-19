import { notFound } from "next/navigation";
import { portfolioCategories, PortfolioItem } from "@/data/portfolio";
import { ShowcaseSection } from "@/components/ShowcaseSection";
import { getPlaylistData } from "@/lib/youtube";

// Removed local fetchPlaylistData as we use the lib directly now

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
                getPlaylistData(primaryPlaylistId),
                getPlaylistData(SAAS_916_PLAYLIST_ID)
            ]);
            if (primary.length > 0) items = primary;
            if (secondary.length > 0) secondaryItems = secondary;
        } else {
            const dynamicItems = await getPlaylistData(primaryPlaylistId);
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
