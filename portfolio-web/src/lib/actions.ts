"use server"

import { revalidatePath } from 'next/cache';
import { supabase } from './supabase';

export async function getContent() {
    try {
        // Fetch all data in parallel for speed
        const [
            { data: stats },
            { data: categories },
            { data: testimonials },
            { data: faqs },
            { data: videos }
        ] = await Promise.all([
            supabase.from('portfolio_stats').select('*').single(),
            supabase.from('portfolio_categories').select('*'),
            supabase.from('portfolio_testimonials').select('*'),
            supabase.from('portfolio_faqs').select('*'),
            supabase.from('portfolio_videos').select('*')
        ]);

        // Reconstruct the nested structure the UI expects with sorted results
        const structuredCategories = (categories || [])
            .sort((a, b) => a.title.localeCompare(b.title))
            .map(cat => ({
                ...cat,
                videos: (videos || [])
                    .filter(v => v.category_id === cat.id)
                    .sort((a, b) => a.title.localeCompare(b.title))
                    .map(v => ({
                        ...v,
                        videoUrl: v.url // Crucial mapping for frontend components
                    }))
            }));

        return {
            stats: stats || { views: "100M", clients: "50" },
            categories: structuredCategories,
            testimonials: (testimonials || []).sort((a, b) => a.name.localeCompare(b.name)),
            faqs: (faqs || []).sort((a, b) => a.question.localeCompare(b.question))
        };
    } catch (error) {
        console.error("Error fetching content from Supabase:", error);
        return {
            stats: { views: "100M", clients: "50" },
            categories: [],
            testimonials: [],
            faqs: []
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
            await supabase.from('portfolio_stats').upsert({ id: 1, ...newData.stats });
        }

        // 2. Update Categories & Videos
        if (newData.categories) {
            for (const cat of newData.categories) {
                // Upsert Category
                await supabase.from('portfolio_categories').upsert({
                    id: cat.id,
                    title: cat.title,
                    description: cat.description
                });

                // Clear and replace videos for this category to keep it simple
                // In a production app, you'd do a more complex diff
                await supabase.from('portfolio_videos').delete().eq('category_id', cat.id);
                if (cat.videos && cat.videos.length > 0) {
                    const videoInserts = cat.videos.map((v: any) => ({
                        id: v.id,
                        category_id: cat.id,
                        title: v.title,
                        url: v.url,
                        thumbnail: v.thumbnail
                    }));
                    await supabase.from('portfolio_videos').insert(videoInserts);
                }
            }

            // Handle category deletions (find categories in DB not in newData)
            const { data: dbCats } = await supabase.from('portfolio_categories').select('id');
            const newCatIds = newData.categories.map((c: any) => c.id);
            const toDelete = dbCats?.filter(c => !newCatIds.includes(c.id)).map(c => c.id) || [];
            if (toDelete.length > 0) {
                await supabase.from('portfolio_categories').delete().in('id', toDelete);
                await supabase.from('portfolio_videos').delete().in('category_id', toDelete);
            }
        }

        // 3. Update Testimonials
        if (newData.testimonials) {
            // Full replace logic for testimonials
            await supabase.from('portfolio_testimonials').delete().neq('id', 'placeholder'); // semi-clean
            if (newData.testimonials.length > 0) {
                await supabase.from('portfolio_testimonials').insert(newData.testimonials.map((t: any) => ({
                    id: t.id || Math.random().toString(36).substr(2, 9),
                    name: t.name,
                    review: t.review,
                    image: t.image,
                    category: t.category
                })));
            }
        }

        // 4. Update FAQs
        if (newData.faqs) {
            // Full replace logic for FAQs
            await supabase.from('portfolio_faqs').delete().neq('id', 'placeholder');
            if (newData.faqs.length > 0) {
                await supabase.from('portfolio_faqs').insert(newData.faqs.map((f: any) => ({
                    id: f.id || Math.random().toString(36).substr(2, 9),
                    question: f.question,
                    answer: f.answer
                })));
            }
        }

        revalidatePath('/');
        revalidatePath('/work/[category]', 'page');
        revalidatePath('/testimonials');
        revalidatePath('/admin');
        revalidatePath('/admin/dashboard');

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
