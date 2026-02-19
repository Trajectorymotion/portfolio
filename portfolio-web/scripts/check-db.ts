import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkData() {
    console.log("Checking Supabase Connection...");

    const { data: testimonials, error } = await supabase
        .from('portfolio_testimonials')
        .select('*');

    if (error) {
        console.error("Error fetching testimonials:", error);
    } else {
        console.log(`Found ${testimonials?.length || 0} testimonials:`);
        console.dir(testimonials, { depth: null });
    }
}

checkData();
