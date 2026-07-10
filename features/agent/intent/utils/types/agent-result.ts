import { z } from "zod";

import { INTENT_ENUM } from "../intent";

export const AGENT_RESULT_SCHEMA = z.object({
    intent: INTENT_ENUM,
    confidence: z.number(),
    reason: z.string(),
}).strict();

export type AgentResult = z.infer<typeof AGENT_RESULT_SCHEMA>;

export const FALLBACK_RESULT: AgentResult = {
    intent: "small_talk",
    confidence: 0,
    reason: "Failed to parse model response",
};