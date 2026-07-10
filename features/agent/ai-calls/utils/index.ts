import { Agent, type AgentInputItem } from "@openai/agents";

import { getPersona } from "../../parsona";
import youtubeSearch from "../../tools/yt-search";

export type ChatMessage = {
    role: string;
    content: string;
};

export function getAI(intent: string): string {
    switch (intent) {
        case 'greeting':
        case 'not_relevant':
        case 'out_of_topic':
            return 'gpt-4o-mini';
        case 'about_me':
            return 'gpt-4o';
        case 'small_talk':
            return 'gpt-4o';
        case 'tech_question':
            return 'gpt-4';
        default:
            return 'gpt-4o-mini';
    }
}

export function getInstructions(personaId: string, intent: string): string {
    const persona = getPersona(personaId, intent);
    if (!persona) return 'You are a helpful assistant.';
    if (typeof persona === 'string') return persona;
    return JSON.stringify(persona);
}

export function toAgentInputItem(message: ChatMessage): AgentInputItem {
    if (message.role === 'assistant') {
        return {
            role: 'assistant',
            content: [{ type: 'output_text', text: message.content }],
        };
    }

    return {
        role: 'user',
        content: message.content,
    };
}

export function buildInput(messages: ChatMessage[], prompt: string): string | AgentInputItem[] {
    const history = messages.map(toAgentInputItem);

    if (prompt) {
        history.push({ role: 'user', content: prompt });
    }

    return history.length > 0 ? history : prompt;
}

export function createAgent(intent: string, personaId: string) {
    return new Agent({
        name: 'persona-agent',
        instructions: getInstructions(personaId, intent),
        model: getAI(intent),
        tools: [youtubeSearch],
    });
}

export const MODEL_PRICING_PER_1M = {
    "gpt-4o-mini": { input: 0.15, output: 0.60 },
    "gpt-4o": { input: 2.50, output: 10.00 },
    "gpt-4": { input: 30.00, output: 60.00 }, // verify current pricing
} as const;

export function calculateCost(
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

export function logAiCall(params: {
    intent: string;
    personaId: string;
    model: string;
    systemPrompt: string | null;
    usage?: { prompt_tokens?: number; completion_tokens?: number };
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