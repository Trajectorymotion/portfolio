-- Create portfolio_stats table
CREATE TABLE IF NOT EXISTS public.portfolio_stats (
    id BIGINT PRIMARY KEY DEFAULT 1,
    views TEXT DEFAULT '0',
    clients TEXT DEFAULT '0',
    CONSTRAINT only_one_row CHECK (id = 1)
);

-- Insert initial stats if empty
INSERT INTO public.portfolio_stats (id, views, clients)
VALUES (1, '100M', '50')
ON CONFLICT (id) DO NOTHING;

-- Create portfolio_categories table
CREATE TABLE IF NOT EXISTS public.portfolio_categories (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create portfolio_videos table
CREATE TABLE IF NOT EXISTS public.portfolio_videos (
    id TEXT PRIMARY KEY,
    category_id TEXT REFERENCES public.portfolio_categories(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    thumbnail TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create portfolio_testimonials table
CREATE TABLE IF NOT EXISTS public.portfolio_testimonials (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    review TEXT NOT NULL,
    image TEXT,
    category TEXT DEFAULT 'Client',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create portfolio_faqs table
CREATE TABLE IF NOT EXISTS public.portfolio_faqs (
    id TEXT PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create portfolio_settings table
CREATE TABLE IF NOT EXISTS public.portfolio_settings (
    id BIGINT PRIMARY KEY DEFAULT 1,
    site_name TEXT DEFAULT 'Trajectory motion',
    logo_url TEXT DEFAULT '/logo.png',
    favicon_url TEXT DEFAULT '/favicontm.png',
    footer_socials JSONB DEFAULT '[{"icon": "Instagram", "href": "https://instagram.com"}, {"icon": "Youtube", "href": "https://youtube.com"}, {"icon": "Mail", "href": "mailto:example@gmail.com"}]',
    CONSTRAINT only_one_setting_row CHECK (id = 1)
);

-- Insert initial settings if empty
INSERT INTO public.portfolio_settings (id, site_name, logo_url, favicon_url, footer_socials)
VALUES (1, 'Trajectory motion', '/logo.png', '/favicontm.png', '[{"icon": "Instagram", "href": "https://instagram.com"}, {"icon": "Youtube", "href": "https://youtube.com"}, {"icon": "Mail", "href": "mailto:example@gmail.com"}]')
ON CONFLICT (id) DO NOTHING;

-- Create portfolio_socials table
CREATE TABLE IF NOT EXISTS public.portfolio_socials (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    url TEXT NOT NULL,
    icon_name TEXT NOT NULL, -- e.g. "Instagram", "Star", "Youtube", "Mail"
    secondary_icon_name TEXT, -- e.g. "Copy" or "ExternalLink"
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Initial Categories
INSERT INTO public.portfolio_categories (id, title, description)
VALUES 
('long-form', 'Long-Form Edits', 'YouTube videos with clean cuts and viral flow.'),
('saas', 'SaaS Explainer Edits', 'Clear, concise edits that simplify your software story.'),
('short-form', 'Short-Form Edits', 'Snappy Reels and Shorts built to trend.')
ON CONFLICT (id) DO NOTHING;

-- Initial Videos (Example entries)
INSERT INTO public.portfolio_videos (id, category_id, title, url, thumbnail)
VALUES 
('sf1', 'short-form', 'Stop Competing With 1000’s 😮‍💨', 'https://www.youtube.com/shorts/clWBv6XaSLI', 'https://i.ytimg.com/vi/clWBv6XaSLI/hqdefault.jpg')
ON CONFLICT (id) DO NOTHING;

-- Initial Social Links
INSERT INTO public.portfolio_socials (id, title, subtitle, url, icon_name, secondary_icon_name, order_index)
VALUES 
('project', 'Start A Project', '', '/contact', 'Star', 'ExternalLink', 0),
('insta', 'Instagram', '@trajectory.motion', 'https://www.instagram.com/trajectory.motion/', 'Instagram', 'ExternalLink', 1),
('insta-copy', 'trajectory.motion', 'Copy Handle', 'trajectory.motion', 'Copy', 'Check', 2),
('youtube', 'YouTube Channel', '', 'https://youtube.com/@TrajectoryMotion', 'Youtube', 'ExternalLink', 3),
('email', 'Direct Email', 'trajectorymotion.work@gmail.com', 'mailto:trajectorymotion.work@gmail.com', 'Mail', 'ExternalLink', 4)
ON CONFLICT (id) DO NOTHING;

-- Disable RLS for all tables (to make it work immediately)
ALTER TABLE public.portfolio_stats DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_videos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_testimonials DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_faqs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_socials DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_settings DISABLE ROW LEVEL SECURITY;
