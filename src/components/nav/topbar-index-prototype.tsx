import type { TopbarPrototypeProps } from "./topbar-prototype-types"
import "./topbar-index-prototype.css"

export function VariantC({ navigation, mobileNavigation, tools, section }: TopbarPrototypeProps) {
  return (
    <div className="topbar-index">
      <div className="topbar-index-brand">{navigation}</div>
      <div className="topbar-index-location"><span>Portfolio index</span><strong>{section}</strong></div>
      <div className="topbar-index-tools">{tools}</div>
      <div className="topbar-index-menu">{mobileNavigation}</div>
    </div>
  )
}
