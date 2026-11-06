import { Command as CommandPrimitive } from "cmdk"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import type { CommandPrototypeProps } from "./command-prototype-types"
import "./command-paper-prototype.css"

export function VariantB({ pages, groups, query, onQueryChange, onSelect }: CommandPrototypeProps) {
  return (
    <Command className="command-paper-prototype" label="Site directory">
      <header className="paper-directory-header">
        <p className="paper-directory-eyebrow">Royce / Site directory</p>
        <h2>Find a place.</h2>
        <p className="paper-directory-description">Pages, projects, and everything in between.</p>
      </header>
      <div className="paper-directory-search">
        <CommandInput
          aria-label="Search pages and projects"
          placeholder="Search the directory…"
          value={query}
          onValueChange={onQueryChange}
          autoFocus
        />
      </div>
      <CommandPrimitive.List className="paper-directory-list">
        <CommandEmpty>
          <div className="paper-directory-empty">No destinations found. Try another name.</div>
        </CommandEmpty>
        <div className="paper-directory-columns">
          <div className="paper-directory-pages">
            <CommandGroup heading="Pages">
              {pages.map((page, index) => (
                <CommandItem
                  key={page.href}
                  value={`Pages ${page.title} ${page.href}`}
                  onSelect={() => onSelect(page.href as string)}
                >
                  <span className="paper-directory-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <span className="paper-directory-name">{page.title}</span>
                  <span className="paper-directory-arrow" aria-hidden="true">↗</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </div>
          <div className="paper-directory-projects">
            {groups.map((group) => (
              <CommandGroup key={group.title} heading={group.title}>
                {group.items.map((item, index) => (
                  <CommandItem
                    key={item.href}
                    value={`${group.title} ${item.title} ${item.href}`}
                    onSelect={() => onSelect(item.href as string)}
                  >
                    <span className="paper-directory-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                    <span className="paper-directory-name">{item.title}</span>
                    <span className="paper-directory-arrow" aria-hidden="true">↗</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </div>
        </div>
      </CommandPrimitive.List>
      <footer className="paper-directory-footer">
        <span><kbd>↑↓</kbd> move</span>
        <span><kbd>Enter</kbd> open</span>
        <span><kbd>Esc</kbd> close</span>
      </footer>
    </Command>
  )
}
