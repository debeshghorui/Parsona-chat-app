import { z } from "zod";

export const INTENT_ENUM = z.enum(["greeting", "about_me", "small_talk", "tech_question", "not_relevant", "out_of_topic", "abuse_the_app"]);

export type Intent = z.infer<typeof INTENT_ENUM>;

export const INTENT_SCHEMA = z.object({
    intent: INTENT_ENUM,
    confidence: z.number(),
    reason: z.string(),
}).strict();