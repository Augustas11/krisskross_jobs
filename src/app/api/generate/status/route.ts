import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, syncToInternalStorage } from '@/lib/storage-sync';

export const maxDuration = 60; // Allow enough time for internal storage sync

const API_KEY = process.env.BYTEPLUS_API_KEY || '';

export async function GET(req: NextRequest) {
    try {
        const taskId = req.nextUrl.searchParams.get('taskId');
        if (!taskId) {
            return NextResponse.json({ error: 'taskId is required' }, { status: 400 });
        }

        const url = `https://ark.ap-southeast.bytepluses.com/api/v3/contents/generations/tasks/${taskId}`;

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
        };

        const response = await fetch(url, {
            method: 'GET',
            headers,
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json({ error: data.message || 'Status check failed' }, { status: response.status });
        }

        // Logic to persist successful video generation
        if (data.status === 'SUCCEEDED' && data.result?.video_url) {
            const externalUrl = data.result.video_url;

            // Fetch record to update
            const { data: records, error: fetchError } = await supabaseAdmin
                .from('generations')
                .select('*')
                .eq('byteplus_task_id', taskId);

            if (fetchError) {
                console.error('Status DB Fetch Error:', fetchError);
            }

            const existing = records && records.length > 0 ? records[0] : null;

            if (existing && existing.status !== 'completed') {
                console.log(`Syncing video for task ${taskId} to internal storage...`);
                const internalPath = `videos/${existing.id}.mp4`;
                const internalUrl = await syncToInternalStorage(externalUrl, internalPath, 'video/mp4');

                const { error: updateError } = await supabaseAdmin.from('generations').update({
                    status: 'completed',
                    external_url: externalUrl,
                    internal_url: internalUrl,
                    metadata: data
                }).eq('id', existing.id);

                if (updateError) {
                    console.error('Status DB Update Error:', updateError);
                } else {
                    console.log(`Successfully updated status to completed for task ${taskId}`);
                    // Attach the internal URL to the response for the frontend too
                    data.result.internal_video_url = internalUrl;
                }
            } else if (!existing) {
                console.warn(`No generation record found for task ID: ${taskId}. DB update skipped.`);
            }
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('API Status Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}


