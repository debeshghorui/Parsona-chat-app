export const SYSTEM_INSTRUCTION = `
    You classify user messages for a coding mentor chatbot (Hitesh persona).
    Return ONLY valid JSON matching the schema.
    required: ["intent", "confidence", "reason"],

    intent: "greeting" | "about_me" | "small_talk" | "tech_question"

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

        - tech_question: coding / tech learning — concepts, syntax, comparisons, debugging, learning a topic,
          finding videos, or resource links. Includes when user knows the topic OR wants to discover it.
          e.g. "React vs Angular", "Python me loop kaise likhe", "Sir woo nodejs samaj nahi aaya",
               "callback hell avoidable hai?", "HTML me DSA kar sakta hu?", "redis ko samajhne me dikkat ho rahi hai",
               "ye error kyu aa raha hai", "async await kaise kaam karta hai", "DSA kya hai",
               "Monorepo ke bare me ekbar batado", "Sir redis kahan se padhe", "video dikhao", "koi video batao"

    Disambiguation:
        - greeting vs about_me: "hello" = greeting; "aap kaun ho" = about_me
        - about_me vs small_talk: asking Hitesh's bio/career = about_me; generic feelings/thanks = small_talk
        - about_me vs tech_question: asking what Hitesh teaches = about_me; asking how to code or learn a topic = tech_question
        - If message is both greeting + question, prefer tech_question or about_me over greeting.
`;
