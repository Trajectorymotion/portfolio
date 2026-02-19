import { notFound } from "next/navigation";
import { PortfolioItem } from "@/data/portfolio";
import { ShowcaseSection } from "@/components/ShowcaseSection";
import { getPlaylistData } from "@/lib/youtube";
import { getContent } from "@/lib/actions";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CategoryPage({
    params,
}: {
    params: Promise<{ category: string }>
}) {
    const { category: categoryId } = await params;
    const content = await getContent();

    // Find category from Supabase data
    const categoryData = content?.categories?.find((c: any) => c.id === categoryId);

    if (!categoryData) {
        notFound();
    }

    // Manual items from dashboard
    let items: PortfolioItem[] = categoryData.videos || [];
    let secondaryItems: PortfolioItem[] = [];

    // Also fetch dynamic playlist data if applicable for legacy categories
    if (categoryId === 'short-form' || categoryId === 'long-form' || categoryId === 'saas') {
        const {
            SHORT_FORM_PLAYLIST_ID,
            LONG_FORM_PLAYLIST_ID,
            SAAS_PLAYLIST_ID,
            SAAS_916_PLAYLIST_ID
        } = await import("@/data/portfolio");

        let primaryPlaylistId = '';
        if (categoryId === 'short-form') primaryPlaylistId = SHORT_FORM_PLAYLIST_ID;
        else if (categoryId === 'long-form') primaryPlaylistId = LONG_FORM_PLAYLIST_ID;
        else if (categoryId === 'saas') primaryPlaylistId = SAAS_PLAYLIST_ID;

        if (categoryId === 'saas') {
            const [primary, secondary] = await Promise.all([
                getPlaylistData(primaryPlaylistId),
                getPlaylistData(SAAS_916_PLAYLIST_ID)
            ]);
            // Merge manual first, then playlist
            items = [...items, ...(primary.filter(p => !items.find(i => i.id === p.id)))];
            secondaryItems = secondary;
        } else {
            const dynamicItems = await getPlaylistData(primaryPlaylistId);
            items = [...items, ...(dynamicItems.filter(p => !items.find(i => i.id === p.id)))];
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
