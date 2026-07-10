import { aiCall } from "./ai-calls";
import { classifyIntent } from "./intent";

// Heuristic fast path (free, no API)
const GREETING = /^(hi|hello|hey|namaste|good\s*(morning|evening)|kese\s*ho)/i;

export async function router(prompt: string, personaId: string, messages: any[]) {
    // Check if the prompt is a greeting
    if (GREETING.test(prompt)) {
        return await aiCall("greeting", prompt, personaId, messages);
    }
    
    const intent = await classifyIntent(prompt, messages);

    console.log(intent);

    switch (intent.intent) {
        case 'greeting':
            return await aiCall(intent.intent as string, prompt, personaId, messages);
        case 'about_me':
            return await aiCall(intent.intent as string, prompt, personaId, messages);
        case 'small_talk':
            return await aiCall(intent.intent as string, prompt, personaId, messages);
        case 'tech_question':
            return await aiCall(intent.intent as string, prompt, personaId, messages);
        case 'not_relevant':
            return await aiCall(intent.intent as string, prompt, personaId, messages);
        case 'out_of_topic':
        case 'abuse_the_app':
            return "Sorry, I can't help with that. Please try again.";
        default:
            return "I'm sorry, I don't understand your question. Please try again.";
    }
}