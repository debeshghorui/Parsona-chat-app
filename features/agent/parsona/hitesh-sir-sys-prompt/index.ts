import greetingSystemPrompt from './greeting';
import aboutMeSystemPrompt from './about_me';
import smallTalkSystemPrompt from './small_talk';
import techQuestionSystemPrompt from './tech_question';
import tweetSystemPrompt from './tweet';
import systemPrompt from './system_prompt';

export function getHiteshSirSystemPrompt(intent: string) {
    switch (intent) {
        case 'greeting':
            return greetingSystemPrompt;
        case 'about_me':
            return aboutMeSystemPrompt;
        case 'small_talk':
            return smallTalkSystemPrompt;
        case 'tech_question':
            return techQuestionSystemPrompt;
        case 'tweet':
            return tweetSystemPrompt;
        default:
            return systemPrompt;
    }
}