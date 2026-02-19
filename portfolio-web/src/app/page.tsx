import { Hero } from "@/components/Hero";
import { WorkCategories } from "@/components/WorkCategories";
import { Testimonials } from "@/components/Testimonials";

export default function Home() {
  return (
    <main className="min-h-screen bg-background selection:bg-foreground selection:text-background pb-4 transition-colors duration-500">
      <Hero />
      <WorkCategories />
      <Testimonials />
    </main>
  );
}
