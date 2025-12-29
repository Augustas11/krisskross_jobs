import { NextRequest, NextResponse } from 'next/server';

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

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('API Status Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}

