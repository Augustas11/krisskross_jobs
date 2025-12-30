import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Admin client for bypass RLS and storage uploads
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Downloads a file from an external URL and uploads it to internal Supabase storage
 */
export async function syncToInternalStorage(externalUrl: string, path: string, contentType: string) {
    try {
        console.log(`Starting sync for ${externalUrl} to path ${path}...`);
        // 1. Fetch the file from BytePlus/CDN
        const response = await fetch(externalUrl);
        if (!response.ok) {
            console.error(`Failed to fetch external asset: ${response.status} ${response.statusText}`);
            throw new Error(`Failed to fetch external asset: ${response.statusText}`);
        }

        const blob = await response.blob();
        const buffer = await blob.arrayBuffer();
        console.log(`Fetched asset size: ${buffer.byteLength} bytes. Uploading to Supabase...`);

        // 2. Upload to private bucket 'user-generations'
        const { data, error } = await supabaseAdmin.storage
            .from('user-generations')
            .upload(path, buffer, {
                contentType,
                upsert: true
            });

        if (error) {
            console.error('Supabase Storage Upload Error:', error);
            throw error;
        }

        // 3. Return the public/signed URL
        const { data: { publicUrl } } = supabaseAdmin.storage
            .from('user-generations')
            .getPublicUrl(path);

        console.log(`Asset synced successfully. Internal URL: ${publicUrl}`);
        return publicUrl;
    } catch (error) {
        console.error('Storage Sync Error:', error);
        return null;
    }
}
