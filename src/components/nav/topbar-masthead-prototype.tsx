import type { TopbarPrototypeProps } from "./topbar-prototype-types"
import "./topbar-masthead-prototype.css"

export function VariantB({
  navigation,
  mobileNavigation,
  tools,
  section,
}: TopbarPrototypeProps) {
  return (
    <div className="topbar-masthead">
      <div className="topbar-masthead-identity">
        <span>Personal portfolio</span>
        <span className="topbar-masthead-section">{section}</span>
      </div>
      <div className="topbar-masthead-navigation">{navigation}</div>
      <div className="topbar-masthead-mobile">{mobileNavigation}</div>
      <div className="topbar-masthead-tools">{tools}</div>
    </div>
  )
}
