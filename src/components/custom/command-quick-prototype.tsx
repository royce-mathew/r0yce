import { Command as CommandPrimitive } from "cmdk"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import type { CommandPrototypeProps } from "./command-prototype-types"
import "./command-quick-prototype.css"

export function VariantA({ pages, groups, query, onQueryChange, onSelect }: CommandPrototypeProps) {
  return (
    <Command className="command-quick-prototype" label="Jump to a destination">
      <header className="quick-heading">
        <span className="quick-slash" aria-hidden="true">/</span>
        <span>Jump to</span>
      </header>
      <CommandInput
        value={query}
        onValueChange={onQueryChange}
        placeholder="Find a page or project…"
        aria-label="Search pages and projects"
        autoFocus
      />
      <CommandPrimitive.List className="quick-results" aria-label="Destinations">
        <CommandEmpty>No destinations found. Try another search.</CommandEmpty>
        <CommandGroup heading="Pages">
          {pages.map((page) => (
            <CommandItem
              key={page.href}
              value={`${page.title} ${page.href} Pages`}
              onSelect={() => onSelect(page.href as string)}
            >
              <span className="quick-destination">{page.title}</span>
              <span className="quick-path">{page.href}</span>
              <span className="quick-arrow" aria-hidden="true">↗</span>
            </CommandItem>
          ))}
        </CommandGroup>
        {groups.map((group) => (
          <CommandGroup key={group.title} heading={group.title}>
            {group.items.map((item) => (
              <CommandItem
                key={item.href}
                value={`${item.title} ${item.href} ${group.title}`}
                onSelect={() => onSelect(item.href as string)}
              >
                <span className="quick-destination">{item.title}</span>
                <span className="quick-path">{item.href}</span>
                <span className="quick-arrow" aria-hidden="true">↗</span>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandPrimitive.List>
      <footer className="quick-help">
        <span><kbd>↑↓</kbd> move</span>
        <span><kbd>Enter</kbd> open</span>
        <span><kbd>Esc</kbd> close</span>
      </footer>
    </Command>
  )
}
