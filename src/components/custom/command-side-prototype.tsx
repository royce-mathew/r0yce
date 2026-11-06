import { Command as CommandPrimitive } from "cmdk"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import type { CommandPrototypeProps } from "./command-prototype-types"
import "./command-side-prototype.css"

export function VariantC({ pages, groups, query, onQueryChange, onSelect }: CommandPrototypeProps) {
  return (
    <Command className="command-side-prototype" label="Site index">
      <header className="command-side-heading">
        <span className="command-side-eyebrow">royce.sh / Navigation</span>
        <h2>The index<span>.</span></h2>
        <p>A shortcut to everything here.</p>
      </header>
      <div className="command-side-search">
        <CommandInput autoFocus aria-label="Search pages and projects" placeholder="Find a page or project…" value={query} onValueChange={onQueryChange} />
      </div>
      <CommandPrimitive.List className="command-side-list">
        <CommandEmpty>No destination found. Try another name.</CommandEmpty>
        <CommandGroup heading="01 / The site">
          {pages.map((item, index) => (
            <CommandItem key={item.href} value={`${item.title} ${item.href}`} onSelect={() => onSelect(item.href as string)}>
              <span className="command-side-number">{String(index + 1).padStart(2, "0")}</span>
              <span className="command-side-name">{item.title}</span>
              <span className="command-side-arrow" aria-hidden="true">↗</span>
            </CommandItem>
          ))}
        </CommandGroup>
        {groups.map(group => (
          <CommandGroup key={group.title} heading={`02 / ${group.title}`}>
            {group.items.map((item, index) => (
              <CommandItem key={item.href} value={`${group.title} ${item.title} ${item.href}`} onSelect={() => onSelect(item.href as string)}>
                <span className="command-side-number">{String(index + 1).padStart(2, "0")}</span>
                <span className="command-side-name">{item.title}</span>
                <span className="command-side-arrow" aria-hidden="true">↗</span>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandPrimitive.List>
      <footer className="command-side-footer"><span><kbd>↑↓</kbd> browse</span><span><kbd>Enter</kbd> open</span><span><kbd>Esc</kbd> close</span></footer>
    </Command>
  )
}
