import { getContent } from "@/lib/actions";
import { TestimonialsPageClient } from "./TestimonialsPageClient";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AllTestimonialsPage() {
    const content = await getContent();
    const testimonials = (content.testimonials || []).reverse(); // Newest First

    return <TestimonialsPageClient testimonials={testimonials} />;
}
