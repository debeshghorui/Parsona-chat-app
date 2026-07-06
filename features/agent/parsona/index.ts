import { getHiteshSirSystemPrompt } from "./hitesh-sir-sys-prompt";

export function getPersona(personaId: string, intent: string) {
    switch (personaId) {
        case 'hitesh':
            return getHiteshSirSystemPrompt(intent);
        case 'piyush':
            return "My persona is not ready yet";
        default:
            return null;
    }
}