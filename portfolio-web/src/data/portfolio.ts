
export interface PortfolioItem {
    id: string;
    title: string;
    thumbnail: string;
    videoUrl?: string; // Optional for now
}

export interface CategoryData {
    id: string;
    title: string;
    description: string;
    image: string; // Placeholder for category visual
    items: PortfolioItem[];
}

// YouTube Playlist ID for short-form content
export const SHORT_FORM_PLAYLIST_ID = 'PLwMaPG6M4YK09yXKMCMztMjBpnifSs33s';

// YouTube Playlist ID for long-form content
export const LONG_FORM_PLAYLIST_ID = 'PLwMaPG6M4YK2U2kC1LPL9vR4F33WAJ5Uf';

// YouTube Playlist ID for SaaS content (Landscape 16:9)
export const SAAS_PLAYLIST_ID = 'PLwMaPG6M4YK1hTkdOfOXDcoJD0W3PtigW';

// YouTube Playlist ID for SaaS content (Portrait 9:16)
export const SAAS_916_PLAYLIST_ID = 'PLwMaPG6M4YK3liU8YizhunVMJpX-ihKnI';

export const longFormItems: PortfolioItem[] = [
    { id: "lf1", title: "Cinematic Documentary", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", thumbnail: "" },
    { id: "lf2", title: "Corporate Storytelling", videoUrl: "https://www.youtube.com/watch?v=jNQXAC9IVRw", thumbnail: "" },
];

export const saasItems: PortfolioItem[] = [
    { id: "saas1", title: "Product SaaS Walkthrough", videoUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4", thumbnail: "" },
    { id: "saas2", title: "Feature Showcase", videoUrl: "https://www.youtube.com/watch?v=0e3GPea1Tyg", thumbnail: "" },
];

export const shortFormItems: PortfolioItem[] = [
    { id: "sf1", title: "Stop Competing With 1000’s 😮‍💨", videoUrl: "https://www.youtube.com/shorts/clWBv6XaSLI", thumbnail: "" },
];

export const portfolioCategories: CategoryData[] = [
    {
        id: "long-form",
        title: "Long-Form Edits",
        description: "YouTube videos with clean cuts and viral flow.",
        image: "/category-longform.jpg", // Placeholder
        items: longFormItems
    },
    {
        id: "saas",
        title: "SaaS Explainer Edits",
        description: "Clear, concise edits that simplify your software story.",
        image: "/category-saas.jpg", // Placeholder
        items: saasItems
    },
    {
        id: "short-form",
        title: "Short-Form Edits",
        description: "Snappy Reels and Shorts built to trend.",
        image: "/category-shortform.jpg", // Placeholder
        items: shortFormItems
    }
];
