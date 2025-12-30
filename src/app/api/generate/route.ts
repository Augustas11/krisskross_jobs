import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, syncToInternalStorage } from '@/lib/storage-sync';
import fs from 'fs';
import path from 'path';

export const maxDuration = 60; // Allow up to 60 seconds for the initial request if needed

const API_KEY = process.env.BYTEPLUS_API_KEY || '';

// Helper to convert local samples or blobs to base64 if needed
async function getBase64Image(imagePath: string | null) {
    if (!imagePath) return null;
    if (imagePath.startsWith('data:')) return imagePath;

    if (imagePath.startsWith('/samples')) {
        try {
            const absolutePath = path.join(process.cwd(), 'public', imagePath);
            const buffer = fs.readFileSync(absolutePath);
            const ext = path.extname(absolutePath).slice(1);
            return `data:image/${ext};base64,${buffer.toString('base64')}`;
        } catch (err) {
            console.error('Error reading sample image:', err);
            return null;
        }
    }

    return imagePath;
}

export async function POST(req: NextRequest) {
    try {
        const { type, prompt, refImages, userEmail } = await req.json();

        // 1. Initial Database Entry
        const { data: dbEntry, error: dbError } = await supabaseAdmin
            .from('generations')
            .insert({
                type,
                prompt,
                status: 'pending',
                ref_images: refImages,
                user_email: userEmail
            })
            .select()
            .single();

        if (dbError) console.error('DB Insert Error:', dbError);

        const resolvedImages = await Promise.all((refImages || []).map((img: string | null) => getBase64Image(img)));
        const baseUrl = 'https://ark.ap-southeast.bytepluses.com/api/v3';
        let url = '';
        let body: any = {};

        if (type === 'video') {
            url = `${baseUrl}/contents/generations/tasks`;
            body = {
                model: 'seedance-1-5-pro-251215',
                content: [{ type: 'text', text: prompt }]
            };

            if (resolvedImages.length > 0 && resolvedImages[0]) body.first_frame_image = resolvedImages[0];
            if (resolvedImages.length > 1 && resolvedImages[1]) body.last_frame_image = resolvedImages[1];
        } else {
            url = `${baseUrl}/images/generations`;
            let enhancedPrompt = `Photorealistic, 8k, realistic lighting, highly detailed. ${prompt}`;

            body = {
                model: 'seedream-4-5-251128',
                prompt: enhancedPrompt,
                sequential_image_generation: 'disabled',
                response_format: 'url',
                size: '2K',
                stream: false,
                watermark: true
            };

            if (resolvedImages && resolvedImages.length > 0) {
                const validImages = resolvedImages.filter((img: string | null) => img !== null);
                if (validImages.length > 0) body.image = validImages;
            }
        }

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
        };

        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
            if (dbEntry) await supabaseAdmin.from('generations').update({ status: 'failed', metadata: data }).eq('id', dbEntry.id);
            return NextResponse.json({ error: data.message || 'Generation failed' }, { status: response.status });
        }

        // 2. Successful Task Creation / Image Generation
        if (type === 'video') {
            await supabaseAdmin.from('generations').update({
                byteplus_task_id: data.id,
                metadata: data
            }).eq('id', dbEntry.id);
        } else if (type === 'image' && data.data?.[0]?.url) {
            const externalUrl = data.data[0].url;
            // Sync to internal storage
            const internalPath = `images/${dbEntry.id}.png`;
            const internalUrl = await syncToInternalStorage(externalUrl, internalPath, 'image/png');

            await supabaseAdmin.from('generations').update({
                status: 'completed',
                external_url: externalUrl,
                internal_url: internalUrl,
                metadata: data
            }).eq('id', dbEntry.id);
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('API Route Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}

