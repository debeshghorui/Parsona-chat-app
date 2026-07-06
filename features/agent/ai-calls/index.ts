import { OpenAI } from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions.mjs';
import { getPersona } from '../parsona';


const MODEL_PRICING_PER_1M = {
    "gpt-4o-mini": { input: 0.15, output: 0.60 },
    "gpt-4o": { input: 2.50, output: 10.00 },
    "gpt-4": { input: 30.00, output: 60.00 }, // verify current pricing
} as const;

function calculateCost(
    model: string,
    usage?: { prompt_tokens?: number; completion_tokens?: number }
) {
    const rates = MODEL_PRICING_PER_1M[model as keyof typeof MODEL_PRICING_PER_1M];
    if (!rates || !usage) return 0;

    const inputCost = (usage.prompt_tokens ?? 0) / 1_000_000 * rates.input;
    const outputCost = (usage.completion_tokens ?? 0) / 1_000_000 * rates.output;

    return {
        inputUsd: inputCost,
        outputUsd: outputCost,
        totalUsd: inputCost + outputCost,
    };
}

function logAiCall(params: {
    intent: string;
    personaId: string;
    model: string;
    systemPrompt: string | null;
    usage?: OpenAI.Chat.Completions.ChatCompletion["usage"];
}) {
    const cost = calculateCost(params.model, params.usage);

    console.dir({
        type: "ai_call",
        timestamp: new Date().toISOString(),
        intent: params.intent,
        personaId: params.personaId,
        model: params.model,
        systemPromptLength: params.systemPrompt?.length ?? 0,
        tokens: params.usage,
        cost,
    }, { depth: null, colors: true });
}

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

function getAI(intent: string): string {
    switch (intent) {
        case 'greeting':
            return 'gpt-4o-mini';
        case 'about_me':
            return 'gpt-4o';
        case 'small_talk':
            return 'gpt-4o';
        case 'tech_question':
            return 'gpt-4';
        case 'tool_needed':
            return 'gpt-4';
        default:
            return 'gpt-4o-mini';
    }
}

export async function aiCall( intent: string, prompt = '', personaId: string, messages: any[]) {

    const MESSAGES_DB = [
        { role: 'system', content: getPersona(personaId, intent) },

        ...(messages.map(m => ({
            role: m.role as 'user' | 'assistant',
            content: m.role === 'assistant' ? JSON.stringify({ step: 'OUTPUT', text: m.content }) : m.content
        })) ?? []),

        { role: 'user', content: prompt }
    ] as unknown as ChatCompletionMessageParam[];

    const response = await client.chat.completions.create({
        model: getAI(intent),
        messages: MESSAGES_DB as unknown as ChatCompletionMessageParam[],
    });

    const rawResult = response.choices[0].message.content;

    console.log({ "ai-calls": rawResult });
    console.log("\n\n");

    logAiCall({
        intent,
        personaId,
        model: getAI(intent),
        systemPrompt: getPersona(personaId, intent) as string,
        usage: response.usage,
    });

    const parsedResult = JSON.parse(rawResult ?? '');

    return parsedResult.text;
}

export default aiCall;