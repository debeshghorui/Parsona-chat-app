import { NextResponse } from 'next/server';
import { main } from '@/features/agent';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const { query, personaId, messages } = body;

        const response = await main(query, personaId, messages);
        
        return NextResponse.json({ response: response ?? 'No response from agent.' });
    } catch (error) {
        console.error('Agent error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Something went wrong' },
            { status: 500 },
        );
    }
}
