import { siteConfig } from "@/config/docs";
import React from "react";

const Topbar: React.FC = () => {
  return (
    <div className="w-full max-h-8">
      <nav>
        <ul>
          {siteConfig.mainNav.map((item, index) => (
            <li key={index}>
              <a href={item.href as string}>{item.title}</a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Topbar;
