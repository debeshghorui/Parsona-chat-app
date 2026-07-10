import { OpenAI } from "openai";

import { SYSTEM_INSTRUCTION } from "../system_prompt";
import { parseModelJson } from "../utils/parse-model-json";
import { AgentResult, FALLBACK_RESULT } from "../utils/types/agent-result";

const openRouterClient = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
});

export async function classifyIntentWithOpenRouter(input: string, messages: { role: string; content: string }[] = []): Promise<AgentResult> {
    const response = await openRouterClient.chat.completions.create({
        // Picks a free model that supports your request features
        model: 'google/gemma-4-31b-it:free',
        // Or pin one: "google/gemini-2.0-flash-exp:free"
        messages: [
            { role: "system", content: SYSTEM_INSTRUCTION },
            { role: "user", content: [...messages.map((m) => ({ role: m.role, content: m.content })), { role: "user", content: input }].join("\n") },
        ],
        temperature: 0,
        response_format: { type: "json_object" },
    });

    const raw = response.choices[0]?.message?.content;

    return parseModelJson<AgentResult>(raw ?? undefined, FALLBACK_RESULT);
}