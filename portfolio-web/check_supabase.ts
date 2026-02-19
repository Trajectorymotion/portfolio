import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase Environment Variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
    const { data: categories } = await supabase.from('portfolio_categories').select('*');
    const { data: videos } = await supabase.from('portfolio_videos').select('*');
    const { data: testimonials } = await supabase.from('portfolio_testimonials').select('*');
    const { data: faqs } = await supabase.from('portfolio_faqs').select('*');
    const { data: stats } = await supabase.from('portfolio_stats').select('*');

    console.log('--- SUPABASE DATA ---');
    console.log('Categories:', JSON.stringify(categories, null, 2));
    console.log('Videos Count:', videos?.length || 0);
    console.log('Testimonials:', JSON.stringify(testimonials, null, 2));
    console.log('FAQs:', JSON.stringify(faqs, null, 2));
    console.log('Stats:', JSON.stringify(stats, null, 2));
}

check();
