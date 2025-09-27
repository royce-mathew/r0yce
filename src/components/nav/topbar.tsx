import React from "react"
import Link from "next/link"
import { siteConfig } from "@/config/docs"

const Topbar: React.FC = () => {
  return (
    <div className="max-h-8 w-full">
      <nav>
        <ul>
          {siteConfig.mainNav.map((item, index) => (
            <li key={index}>
              <Link href={item.href as string}>{item.title}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default Topbar
