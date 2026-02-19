import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xieblwlkizuydnmsitpb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpZWJsd2xraXp1eWRubXNpdHBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MTI3MjAsImV4cCI6MjA4NzA4ODcyMH0.iF2R4eoUD88JFeJQXV0cVvZ7oYd3vlkePmZEpHnGWr4';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSchema() {
    console.log("Checking Table Schema...");

    // Attempt a small insert to see if column exists
    const testId = 'test-' + Date.now();
    const { error } = await supabase
        .from('portfolio_testimonials')
        .insert({
            id: testId,
            name: 'Test Client',
            review: 'Test Review',
            position: 'Test Position'
        });

    if (error) {
        console.error("Column check failed:", error.message);
        if (error.message.includes('column "position" of relation "portfolio_testimonials" does not exist')) {
            console.log("CONFIRMED: 'position' column is MISSING.");
        }
    } else {
        console.log("SUCCESS: 'position' column exists and insert worked.");
        // Cleanup
        await supabase.from('portfolio_testimonials').delete().eq('id', testId);
    }
}

checkSchema();
