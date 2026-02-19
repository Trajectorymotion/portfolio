"use server"

import { revalidatePath } from 'next/cache';
import { supabase } from './supabase';

// Helper to bust all cached pages after a dashboard update
function revalidateAllPaths() {
    revalidatePath('/', 'layout');
    revalidatePath('/');
    revalidatePath('/work/[category]', 'page');
    revalidatePath('/testimonials');
    revalidatePath('/admin');
    revalidatePath('/admin/dashboard');
    revalidatePath('/admin/dashboard/work');
    revalidatePath('/admin/dashboard/testimonials');
    revalidatePath('/admin/dashboard/faq');
    revalidatePath('/api/data');
}

export async function getContent() {
    try {
        // Fetch all data in parallel for speed
        const [
            { data: stats, error: statsError },
            { data: categories, error: catError },
            { data: testimonials, error: testError },
            { data: faqs, error: faqError },
            { data: videos, error: vidError },
            { data: socials, error: socialError },
            { data: settings, error: settingsError }
        ] = await Promise.all([
            supabase.from('portfolio_stats').select('*').single(),
            supabase.from('portfolio_categories').select('*'),
            supabase.from('portfolio_testimonials').select('*'),
            supabase.from('portfolio_faqs').select('*'),
            supabase.from('portfolio_videos').select('*'),
            supabase.from('portfolio_socials').select('*').order('order_index', { ascending: true }),
            supabase.from('portfolio_settings').select('*').single()
        ]);

        if (statsError || catError || testError || faqError || vidError || socialError || settingsError) {
            console.error("Supabase Error during fetch:", { statsError, catError, testError, faqError, vidError, socialError, settingsError });
        }

        // Reconstruct the nested structure the UI expects with sorted results
        const structuredCategories = (categories || [])
            .sort((a, b) => (a.title || "").localeCompare(b.title || ""))
            .map(cat => ({
                ...cat,
                videos: (videos || [])
                    .filter(v => v.category_id === cat.id)
                    .sort((a, b) => (a.title || "").localeCompare(b.title || ""))
                    .map(v => ({
                        ...v,
                        videoUrl: v.url // Crucial mapping for frontend components
                    }))
            }));

        const result = {
            stats: stats || { views: "100M", clients: "50" },
            categories: structuredCategories,
            testimonials: (testimonials || []).sort((a, b) => {
                const dateA = new Date(a.created_at || 0).getTime();
                const dateB = new Date(b.created_at || 0).getTime();
                return dateB - dateA; // Newest First
            }),
            faqs: (faqs || []).sort((a, b) => (a.question || "").localeCompare(b.question || "")),
            socials: socials || [],
            settings: settings || {
                site_name: "Trajectory motion",
                logo_url: "/logo.png",
                favicon_url: "/favicontm.png",
                footer_socials: [
                    { icon: "Instagram", href: "https://instagram.com" },
                    { icon: "Youtube", href: "https://youtube.com" },
                    { icon: "Mail", href: "mailto:example@gmail.com" }
                ]
            }
        };

        return result;
    } catch (error) {
        console.error("Error in getContent Server Action:", error);
        return {
            stats: { views: "100M", clients: "50" },
            categories: [],
            testimonials: [],
            faqs: [],
            socials: [],
            settings: {
                site_name: "Trajectory motion",
                logo_url: "/logo.png",
                favicon_url: "/favicontm.png",
                footer_socials: [
                    { icon: "Instagram", href: "https://instagram.com" },
                    { icon: "Youtube", href: "https://youtube.com" },
                    { icon: "Mail", href: "mailto:example@gmail.com" }
                ]
            }
        };
    }
}

/**
 * Update Content
 * Since the existing dashboard sends the whole object, 
 * we try to reconcile it with Supabase.
 */
export async function updateContent(newData: any) {
    try {
        // 1. Update Stats
        if (newData.stats) {
            const { error: statsError } = await supabase.from('portfolio_stats').upsert({ id: 1, ...newData.stats });
            if (statsError) {
                console.error("Stats Update Error:", statsError);
                throw new Error(`Stats update failed: ${statsError.message}`);
            }
        }

        // 2. Update Categories & Videos
        if (newData.categories) {
            for (const cat of newData.categories) {
                const { error: catError } = await supabase.from('portfolio_categories').upsert({
                    id: cat.id,
                    title: cat.title,
                    description: cat.description
                });
                if (catError) throw new Error(`Category update failed: ${catError.message}`);

                const { error: delError } = await supabase.from('portfolio_videos').delete().eq('category_id', cat.id);
                if (delError) throw new Error(`Video deletion failed: ${delError.message}`);

                if (cat.videos && cat.videos.length > 0) {
                    const videoInserts = cat.videos.map((v: any) => ({
                        id: v.id,
                        category_id: cat.id,
                        title: v.title,
                        url: v.url,
                        thumbnail: v.thumbnail
                    }));
                    const { error: insError } = await supabase.from('portfolio_videos').insert(videoInserts);
                    if (insError) throw new Error(`Video insert failed: ${insError.message}`);
                }
            }

            // Handle category deletions (find categories in DB not in newData)
            const { data: dbCats } = await supabase.from('portfolio_categories').select('id');
            const newCatIds = newData.categories.map((c: any) => c.id);
            const toDelete = dbCats?.filter(c => !newCatIds.includes(c.id)).map(c => c.id) || [];
            if (toDelete.length > 0) {
                const { error: deleteCatsError } = await supabase.from('portfolio_categories').delete().in('id', toDelete);
                if (deleteCatsError) throw new Error(`Category deletion failed for IDs ${toDelete.join(', ')}: ${deleteCatsError.message}`);
                const { error: deleteVideosError } = await supabase.from('portfolio_videos').delete().in('category_id', toDelete);
                if (deleteVideosError) throw new Error(`Videos for deleted categories failed for IDs ${toDelete.join(', ')}: ${deleteVideosError.message}`);
            }
        }

        // 3. Update Testimonials
        if (newData.testimonials && Array.isArray(newData.testimonials)) {
            // We use a more careful approach: 
            // 1. Prepare new data
            const testimonialsToInsert = newData.testimonials.map((t: any) => ({
                id: t.id || Math.random().toString(36).substr(2, 9),
                name: t.name,
                review: t.review,
                image: t.image || '',
                category: t.category || 'Client',
                position: t.position || ''
            }));

            // 2. Perform the update in a way that minimizes downtime/loss
            // First, delete
            const { error: delError } = await supabase.from('portfolio_testimonials').delete().neq('id', 'placeholder_that_does_not_exist');
            if (delError) throw new Error(`Could not clear old testimonials: ${delError.message}`);

            // Then, insert only if we have any
            if (testimonialsToInsert.length > 0) {
                const { error: insError } = await supabase.from('portfolio_testimonials').insert(testimonialsToInsert);
                if (insError) {
                    console.error("Testimonials Insert Error:", insError);
                    // If the column 'position' is missing, this is a common issue
                    if (insError.message.includes('column "position"')) {
                        throw new Error("DATABASE UPDATE REQUIRED: The 'position' column is missing in your Supabase table. Please run the provided SQL fix in your Supabase SQL Editor.");
                    }
                    throw new Error(`Failed to save new testimonials: ${insError.message}`);
                }
            }
        }

        // 4. Update FAQs
        if (newData.faqs && Array.isArray(newData.faqs)) {
            const { error: delError } = await supabase.from('portfolio_faqs').delete().neq('id', 'placeholder'); // Delete all
            if (delError) throw new Error(`FAQs deletion failed: ${delError.message}`);

            if (newData.faqs.length > 0) {
                const { error: insError } = await supabase.from('portfolio_faqs').insert(newData.faqs.map((f: any) => ({
                    id: f.id || Math.random().toString(36).substr(2, 9),
                    question: f.question,
                    answer: f.answer
                })));
                if (insError) throw new Error(`FAQs insert failed: ${insError.message}`);
            }
        }

        // 5. Update Socials
        if (newData.socials && Array.isArray(newData.socials)) {
            const { error: delError } = await supabase.from('portfolio_socials').delete().neq('id', 'placeholder');
            if (delError) throw new Error(`Socials deletion failed: ${delError.message}`);

            if (newData.socials.length > 0) {
                const { error: insError } = await supabase.from('portfolio_socials').insert(newData.socials.map((s: any, i: number) => ({
                    id: s.id || Math.random().toString(36).substr(2, 9),
                    title: s.title,
                    subtitle: s.subtitle,
                    url: s.url,
                    icon_name: s.icon_name,
                    secondary_icon_name: s.secondary_icon_name,
                    order_index: i
                })));
                if (insError) throw new Error(`Socials insert failed: ${insError.message}`);
            }
        }

        // 6. Update Settings
        if (newData.settings) {
            const settingsToUpdate = {
                id: 1,
                site_name: newData.settings.site_name,
                logo_url: newData.settings.logo_url,
                favicon_url: newData.settings.favicon_url,
                footer_socials: newData.settings.footer_socials
            };
            const { error: settingsError } = await supabase.from('portfolio_settings').upsert(settingsToUpdate);
            if (settingsError) throw settingsError;
        }

        revalidateAllPaths();

        return { success: true };
    } catch (error) {
        console.error("Error updating content in Supabase:", error);
        return { success: false, error: (error as Error).message };
    }
}

export async function verifyAdminPassword(password: string) {
    const adminPass = process.env.ADMIN_PASSWORD || "Saaswebsedits!ssupercleannice";
    return password === adminPass;
}
