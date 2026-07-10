import { GoogleGenAI } from "@google/genai";
import { ZodError } from "zod";

import { classifyIntentWithOpenRouter } from "./fallback-ai-call";
import { SYSTEM_INSTRUCTION } from "./system_prompt";
import { parseModelJson } from "./utils/parse-model-json";
import { AGENT_RESULT_SCHEMA, AgentResult, FALLBACK_RESULT } from "./utils/types/agent-result";

export type { AgentResult } from "./utils/types/agent-result";
export { FALLBACK_RESULT } from "./utils/types/agent-result";
export { parseModelJson } from "./utils/parse-model-json";

const INTENT_JSON_SCHEMA = {
    type: "object",
    properties: {
        intent: {
            type: "string",
            enum: [
                "greeting",
                "about_me",
                "small_talk",
                "tech_question",
                "not_relevant",
                "out_of_topic",
                "abuse_the_app",
            ],
        },
        confidence: { type: "number" },
        reason: { type: "string" },
    },
    required: ["intent", "confidence", "reason"],
} as const;

const client = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

export async function classifyIntent(
    prompt: string,
    messages: { role: string; content: string }[] = [],
): Promise<AgentResult> {
    const history = messages
        .slice(-4)
        .map((m) => `${m.role}: ${m.content}`)
        .join("\n");

    const input = history
        ? `Chat history:\n${history}\n\nLatest user message:\n${prompt}`
        : prompt;

    try {
        const interaction = await client.interactions.create({
            model: "gemini-2.5-flash-lite",
            system_instruction: SYSTEM_INSTRUCTION,
            input,
            response_format: {
                type: "text",
                mime_type: "application/json",
                schema: INTENT_JSON_SCHEMA,
            },
            generation_config: {
                temperature: 0,
            },
        });

        const parsed = parseModelJson(interaction.output_text, FALLBACK_RESULT);
        return AGENT_RESULT_SCHEMA.parse(parsed);
    } catch (error) {
        if (error instanceof ZodError) {
            console.error("Invalid response format:", error.issues);
            return FALLBACK_RESULT;
        }

        console.error("Error classifying intent:", error);

        if (process.env.OPENROUTER_API_KEY) {
            try {
                return await classifyIntentWithOpenRouter(prompt, messages);
            } catch (fallbackError) {
                console.error("OpenRouter fallback failed:", fallbackError);
            }
        }

        return FALLBACK_RESULT;
    }
}
