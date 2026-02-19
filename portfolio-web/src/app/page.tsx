import { Hero } from "@/components/Hero";
import { WorkCategories } from "@/components/WorkCategories";
import { Testimonials } from "@/components/Testimonials";
import { getContent } from "@/lib/actions";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const content = await getContent();

  return (
    <main className="min-h-screen bg-background selection:bg-foreground selection:text-background pb-4 transition-colors duration-500">
      <Hero />
      <WorkCategories
        categories={content.categories}
        stats={content.stats}
      />
      <Testimonials
        testimonials={content.testimonials}
        faqs={content.faqs}
        settings={content.settings}
      />
    </main>
  );
}
