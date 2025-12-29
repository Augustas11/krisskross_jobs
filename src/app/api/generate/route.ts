import { NextRequest, NextResponse } from 'next/server';

import fs from 'fs';
import path from 'path';

const API_KEY = process.env.BYTEPLUS_API_KEY || '';

// Helper to convert local samples or blobs to base64 if needed
async function getBase64Image(imagePath: string | null) {
    if (!imagePath) return null;
    if (imagePath.startsWith('data:')) return imagePath;

    // If it's a blob URL from frontend, it won't work server-side
    // The frontend should have sent the base64 or the blob should be handled
    // For local samples (/samples/...), we can read them
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

    return imagePath; // Assume it's a URL or already base64
}

export async function POST(req: NextRequest) {
    try {
        const { type, prompt, refImages } = await req.json();

        // Resolve reference images to base64 if they are local samples
        const resolvedImages = await Promise.all((refImages || []).map((img: string | null) => getBase64Image(img)));

        const baseUrl = 'https://ark.ap-southeast.bytepluses.com/api/v3';
        let url = '';
        let body: any = {};

        if (type === 'video') {
            // Video generation uses /contents/generations/tasks endpoint
            url = `${baseUrl}/contents/generations/tasks`;

            // Build content array with text prompt
            const content: any[] = [
                {
                    type: 'text',
                    text: prompt
                }
            ];

            // Build the request body with first and last frame images
            body = {
                model: 'seedance-1-5-pro-251215',
                content: content
            };

            // Add first_frame_image (Figure 1) if available
            if (resolvedImages.length > 0 && resolvedImages[0]) {
                body.first_frame_image = resolvedImages[0];
            }

            // Add last_frame_image (Figure 2) if available
            if (resolvedImages.length > 1 && resolvedImages[1]) {
                body.last_frame_image = resolvedImages[1];
            }
        } else {
            // Image generation uses /images/generations endpoint
            url = `${baseUrl}/images/generations`;

            // For image generation, we'll combine the prompt with a note about reference images
            // since this endpoint uses a simple prompt-based API
            let enhancedPrompt = prompt;

            // Note: The /images/generations endpoint doesn't support reference images in the same way
            // We're using the prompt-based approach as shown in the curl example

            body = {
                model: 'seedream-4-5-251128',
                prompt: enhancedPrompt,
                sequential_image_generation: 'disabled',
                response_format: 'url',
                size: '2K',
                stream: false,
                watermark: true
            };
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
            console.error('BytePlus Error:', data);
            return NextResponse.json({ error: data.message || 'Generation failed' }, { status: response.status });
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('API Route Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
