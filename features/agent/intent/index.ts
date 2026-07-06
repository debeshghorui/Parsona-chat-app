import { GoogleGenAI } from "@google/genai";
import { classifyIntentWithOpenRouter } from "./fallback-ai-call";
import { SYSTEM_INSTRUCTION } from "./system_prompt";

export type Intent = 'greeting' | 'about_me' | 'small_talk' | 'tech_question' | 'tool_needed';

export type AgentResult = {
    intent: Intent;
    confidence: number;
    reason: string;
}

export const INTENT_SCHEMA = {
    type: "object",
    properties: {
        intent: {
            type: "string",
            enum: ["greeting", "about_me", "small_talk", "tech_question", "tool_needed"],
        },
        confidence: { type: "number" },
        reason: { type: "string" },
    },
    required: ["intent", "confidence", "reason"],
};

export const FALLBACK_RESULT: AgentResult = {
    intent: "small_talk",
    confidence: 0,
    reason: "Failed to parse model response",
};

function isGeminiQuotaError(error: unknown): boolean {
    if (!(error instanceof Error)) return false;

    const message = error.message.toLowerCase();

    // SDK error class name (from @google/genai)
    const isInteractionClientError =
        error.name === "CreateInteractionClientError" ||
        error.constructor?.name === "CreateInteractionClientError";

    const looksLikeQuota =
        message.includes("do not have enough quota") ||
        message.includes("resource_exhausted") ||
        message.includes("quota") ||
        message.includes("rate limit");

    return isInteractionClientError && looksLikeQuota;
}

export function parseModelJson<T>(raw: string | undefined, fallback: T): T {
    try {
        if (!raw?.trim()) return fallback;

        const cleaned = raw
            .trim()
            .replace(/^```(?:json)?\s*/i, "")
            .replace(/\s*```$/, "")
            .trim();

        return JSON.parse(cleaned) as T;
    } catch {
        return fallback;
    }
}

const client = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

export async function classifyIntent(prompt: string, messages: { role: string; content: string }[] = []): Promise<AgentResult> {
    let result: AgentResult;

    const history = messages
        .slice(-4)
        .map((m) => `${m.role}: ${m.content}`)
        .join("\n");

    try {
        const interaction = await client.interactions.create({
            model: "gemini-2.5-flash-lite",
            system_instruction: SYSTEM_INSTRUCTION,
            input: history ? `Chat history:\n${history}\n\nLatest user message:\n${prompt}` : prompt,
            response_format: {
                type: "text",
                mime_type: "application/json",
                schema: INTENT_SCHEMA,
            },
            generation_config: {
                temperature: 0,
            },
        });

        result = parseModelJson<AgentResult>(interaction.output_text, FALLBACK_RESULT);
    } catch (error) {
        console.error(error);
        
        if (isGeminiQuotaError(error)) {
            console.warn("[intent] Gemini quota hit, falling back to OpenRouter", error);
            result = await classifyIntentWithOpenRouter(prompt, messages);
        } else {
            result = FALLBACK_RESULT;
        }
    }

    return result;
}