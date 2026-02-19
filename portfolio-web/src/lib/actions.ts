"use server"

import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';

const DATA_PATH = path.join(process.cwd(), 'src/data/content.json');

export async function getContent() {
    try {
        const data = await fs.readFile(DATA_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading content.json:", error);
        return null;
    }
}

export async function updateContent(newData: any) {
    try {
        // Simple authentication check could go here if session existed
        // But for now we rely on the protected page

        await fs.writeFile(DATA_PATH, JSON.stringify(newData, null, 2), 'utf8');
        revalidatePath('/');
        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        console.error("Error writing to content.json:", error);
        return { success: false, error: (error as Error).message };
    }
}

// Helper to check password
export async function verifyAdminPassword(password: string) {
    const adminPass = process.env.ADMIN_PASSWORD || "admin123"; // Fallback for testing
    return password === adminPass;
}
