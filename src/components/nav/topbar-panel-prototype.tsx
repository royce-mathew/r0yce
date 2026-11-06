import type { TopbarPrototypeProps } from "./topbar-prototype-types"
import "./topbar-panel-prototype.css"

export function VariantA({ navigation, mobileNavigation, tools, section }: TopbarPrototypeProps) {
  return (
    <div className="topbar-panel" data-section={section}>
      <div className="topbar-panel-navigation">{navigation}</div>
      <div className="topbar-panel-mobile">{mobileNavigation}</div>
      <div className="topbar-panel-utilities">{tools}</div>
    </div>
  )
}
