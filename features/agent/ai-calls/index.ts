import { run } from '@openai/agents';

import { getInstructions, createAgent, buildInput, getAI, logAiCall, type ChatMessage } from './utils';


export async function aiCall(intent: string, prompt = '', personaId: string, messages: ChatMessage[]) {
    const model = getAI(intent);
    const systemPrompt = getInstructions(personaId, intent);
    const agent = createAgent(intent, personaId);
    const input = buildInput(messages, prompt);

    const result = await run(agent, input);

    console.log({ 'ai-calls': result.finalOutput });
    console.log('\n\n');

    logAiCall({
        intent,
        personaId,
        model,
        systemPrompt,
        usage: {
            prompt_tokens: result.runContext.usage.inputTokens,
            completion_tokens: result.runContext.usage.outputTokens,
        },
    });

    const output = result.finalOutput;
    return typeof output === 'string' ? output : JSON.stringify(output ?? '');
}

export default aiCall;
