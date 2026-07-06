export const personas = [
  {
    id: "hitesh",
    name: "Talk to Hitesh Sir",
    avatar: "https://avatars.githubusercontent.com/u/11613311",
  },
  {
    id: "piyush",
    name: "Talk to Piyush Sir",
    avatar: "https://www.piyushgarg.dev/images/piyush-garg.png",
  },
]

export const DEFAULT_PERSONA_ID = personas[0].id

export function getPersonaById(id) {
  return personas.find((p) => p.id === id) ?? personas[0]
}

export function getPersonaInitial(id) {
  const persona = getPersonaById(id)
  return persona.id.charAt(0).toUpperCase()
}

export function getPersonaDisplayName(id) {
  const persona = getPersonaById(id)
  return persona.name.replace(/^Talk to /i, "")
}
