import { router } from './router';

// export async function main(prompt = '', personaId: string, messages: any[] ) {
//     const MESSAGES_DB = [
//         { role: 'system', content: systemContent },
//         ...(messages.map(m => ({ 
//             role: m.role as 'user' | 'assistant',
//             content: m.role === 'assistant' ? JSON.stringify({ step: 'OUTPUT', text: m.content }): m.content 
//         })) ?? []),
//         { role: 'user', content: prompt }
//     ] as unknown as ChatCompletionMessageParam[];

//     while (true) {
//         const response = await client.chat.completions.create({
//             model: 'gpt-4o',
//             messages: MESSAGES_DB as unknown as ChatCompletionMessageParam[],
//         });

//         const rawResult = response.choices[0].message.content;
//         const parsedResult = JSON.parse(rawResult ?? '');

//         MESSAGES_DB.push({ role: 'assistant', content: rawResult ?? '' });

//         console.log(`🤖 [${parsedResult.step}] : ${parsedResult.text}`);

//         if (parsedResult.step === 'TOOL_REQUEST') {
//             const toolInput = parsedResult.input ?? parsedResult.text;
//             let toolOutput;

//             if (parsedResult.functionName === 'getHiteshYoutubeContent' || parsedResult.functionName === 'youtubeSearch') {
//                 toolOutput = await youtubeSearch(toolInput);
//             } else {
//                 toolOutput = { error: `Unknown tool: ${parsedResult.functionName}` };
//             }

//             MESSAGES_DB.push({
//                 role: 'user',
//                 content: JSON.stringify({ step: 'TOOL_OUTPUT', functionName: parsedResult.functionName, output: toolOutput }),
//             });
//             continue;
//         }

//         if (parsedResult.step === 'OUTPUT') {
//             console.log("\n\n--------------------------------\n\n");
//             console.log(parsedResult.text);
//             return parsedResult.text;
//         };

//         if (parsedResult.step === 'TOOL_OUTPUT') {
//             switch (parsedResult.functionName) {
//                 case 'youtubeSearch':
//                     const youtubeContent = await youtubeSearch(parsedResult.input);
//                     MESSAGES_DB.push({ role: 'user', content: JSON.stringify({ step: 'TOOL_OUTPUT', functionName: parsedResult.functionName, output: youtubeContent }) });
//                     continue;
//                 default:
//                     MESSAGES_DB.push({ role: 'user', content: JSON.stringify({ step: 'ERROR', text: `Unknown tool: ${parsedResult.functionName}` }) });
//                     console.log({ error: `Unknown tool: ${parsedResult.functionName}` });
//             }
//         }
//     }
// }

export async function main(prompt = '', personaId: string, messages: any[]) {
    console.log({
        personaId,
        prompt,
        messages,
    });

    if (personaId === 'piyush') {
        return 'My persona is not ready yet';
    }
    
    return await router(prompt, personaId, messages);
}
