"use client"

interface ClientHeaderWrapperProps {
  children: React.ReactNode
}

export function ClientHeaderWrapper({ children }: ClientHeaderWrapperProps) {
  return <header className="manga-site-header sticky top-0 z-50 w-full">{children}</header>
}
