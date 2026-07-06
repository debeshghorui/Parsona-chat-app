"use client"
import { MoreHorizontal, Menu, ChevronDown } from "lucide-react"
import { useState } from "react"
import GhostIconButton from "./GhostIconButton"
import { personas, getPersonaById } from "../utils/personas"

export default function Header({ sidebarCollapsed, setSidebarOpen, selectedPersonaId, onPersonaChange }) {
  const selectedPersona = getPersonaById(selectedPersonaId)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
    <div className="sticky top-0 z-30 flex items-center gap-2 border-b border-zinc-200/60 bg-white/80 px-4 py-3 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70">
      {sidebarCollapsed && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden inline-flex items-center justify-center rounded-lg p-2 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-zinc-800"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
      )}

      <div className="hidden md:flex relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="inline-flex w-52 items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold tracking-tight hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800"
        >
          <img
            src={selectedPersona.avatar}
            alt={selectedPersona.name}
            className="h-6 w-6 shrink-0 rounded-full object-cover"
          />
          <span className="min-w-0 flex-1 truncate text-left">{selectedPersona.name}</span>
          <ChevronDown className="h-4 w-4 shrink-0" />
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full left-0 mt-1 w-52 rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-950 z-50">
            {personas.map((persona) => (
              <button
                key={persona.id}
                onClick={() => {
                  onPersonaChange?.(persona.id)
                  setIsDropdownOpen(false)
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 first:rounded-t-lg last:rounded-b-lg"
              >
                <img
                  src={persona.avatar}
                  alt={persona.name}
                  className="h-6 w-6 rounded-full object-cover"
                />
                {persona.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2">
        <GhostIconButton label="More">
          <MoreHorizontal className="h-4 w-4" />
        </GhostIconButton>
      </div>
    </div>
  )
}
