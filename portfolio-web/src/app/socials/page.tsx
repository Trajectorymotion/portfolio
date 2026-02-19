import { getContent } from "@/lib/actions";
import SocialsPageClient from "./SocialsPageClient";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function SocialsPage() {
    const content = await getContent();
    return <SocialsPageClient
        initialSocials={content.socials || []}
        settings={content.settings}
    />;
}
