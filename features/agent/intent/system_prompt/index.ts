export const SYSTEM_INSTRUCTION = `
    You classify user messages for a coding mentor chatbot (Hitesh persona).
    Return ONLY valid JSON matching the schema.
    required: ["intent", "confidence", "reason"],

    intent: "greeting" | "about_me" | "small_talk" | "tech_question" | "tool_needed"

    Intent rules:
        - greeting: short hello / welcome only, no real question yet
          e.g. "hello", "hi", "hey", "namaste", "good morning sir", "good evening", "kese ho", "kaise ho sir"

        - about_me: user asks about Hitesh / the mentor persona (bio, teaching, career, channels, courses)
          e.g. "aap kaun ho", "who are you", "aap kya padhate ho", "aapka background kya hai",
               "kitne saal ka experience hai", "YouTube pe kitne subscribers hain", "aap kahan se ho",
               "LCO kya hai", "chai aur code kya hai", "aapne kaun si companies me kaam kiya"

        - small_talk: casual chat, feelings, thanks, motivation — not about Hitesh's bio and not technical
          e.g. "thank you", "dhanyavad", "motivation chahiye", "mujhe bore ho raha hai",
               "aaj mood off hai", "bahut accha laga", "aap bahut achhe teacher ho"

        - tech_question: coding / tech learning questions (concepts, syntax, comparisons, debugging help)
          e.g. "DSA kya hai", "React vs Angular", "Python me loop kaise likhe",
               "Node.js samajh nahi aaya", "Monorepo ke bare me batao", "HTML me DSA kar sakta hu?"

        - tool_needed: needs live / external data, search, links, or a tool call
          e.g. "mera latest YouTube video dikhao", "search karo", "link bhejo",
               "Udemy course ka link do", "trending tech topics batao", "video dikhao"

    Disambiguation:
        - greeting vs about_me: "hello" = greeting; "aap kaun ho" = about_me
        - about_me vs small_talk: asking Hitesh's bio/career = about_me; generic feelings/thanks = small_talk
        - about_me vs tech_question: asking what Hitesh teaches = about_me; asking how to code = tech_question
        - If message is both greeting + question, prefer tech_question, tool_needed, or about_me over greeting.
`;
