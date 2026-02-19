import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
    console.log('Checking Supabase connection...');
    const tables = ['portfolio_categories', 'portfolio_videos', 'portfolio_testimonials', 'portfolio_faqs', 'portfolio_stats'];

    for (const table of tables) {
        const { data, error } = await supabase.from(table).select('*').limit(1);
        if (error) {
            console.error(`Error fetching from ${table}:`, error.message);
        } else {
            console.log(`Table ${table} is accessible. Row count (limit 1):`, data?.length);
        }
    }
}

check();
