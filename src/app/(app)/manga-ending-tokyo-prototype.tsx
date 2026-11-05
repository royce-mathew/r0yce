"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./manga-ending-tokyo-prototype.css";

export function TokyoEndingPrototype() {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const element = root.current;
    if (!element) return;
    const media = gsap.matchMedia();
    media.add(
      {
        desktop: "(min-width: 768px)",
        mobile: "(max-width: 767px)",
        motion: "(prefers-reduced-motion: no-preference)",
        short: "(max-height: 700px)",
      },
      (context) => {
        const conditions = context.conditions!;
        const navigation = element.querySelector<HTMLElement>(".me-tokyo-navigation")!;
        const release = () => {
          navigation.inert = false;
        };
        if (!conditions.motion || conditions.short) {
          element.dataset.progress = conditions.motion ? "1" : "reduced";
          release();
          return release;
        }
        const mobile = conditions.mobile;
        navigation.inert = true;
        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: element.querySelector(".me-tokyo-track"),
            start: "top top+=" + (mobile ? 76 : 90),
            end: "bottom bottom",
            scrub: 0.65,
          },
          onUpdate: () => {
            element.dataset.progress = timeline.progress().toFixed(3);
            navigation.inert = timeline.time() < 0.64;
          },
        });
        timeline
          .fromTo(".me-tokyo-title", { y: mobile ? "28svh" : "24svh", scale: mobile ? 1.2 : 1.52 }, { y: 0, scale: 1, duration: 0.5 }, 0)
          .fromTo(".me-tokyo-portrait", { clipPath: "inset(0% 38% 0% 38%)", y: mobile ? 65 : 35, scale: 1.12 }, { clipPath: "inset(0% 0% 0% 0%)", y: 0, scale: 1, duration: 0.56 }, 0)
          .fromTo(".me-tokyo-portrait img", { scale: 1.24 }, { scale: 1, duration: 0.6 }, 0)
          .fromTo(".me-tokyo-sign", { yPercent: -32, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.32 }, 0.24)
          .fromTo(".me-tokyo-detail", { yPercent: 34, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.35 }, 0.27)
          .fromTo(".me-tokyo-identity", { x: mobile ? 25 : 80, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.3 }, 0.34)
          .fromTo(".me-tokyo-navigation", { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.22 }, 0.47)
          .to({}, { duration: 0.31 });
        return release;
      },
      element,
    );
    return () => media.revert();
  }, []);

  return (
    <div ref={root} data-ending-prototype="B" data-progress="0" className="me-tokyo">
      <div className="me-tokyo-track manga-ending-track">
        <section className="me-tokyo-stage manga-ending-stage" aria-label="Royce Mathew introduction">
          <div className="me-tokyo-page">
            <h1 className="me-tokyo-title"><span>Royce</span><span>Mathew</span></h1>
            <div className="me-tokyo-sign" lang="ja" aria-hidden="true"><span>ロイス</span><span>マシュー</span></div>
            <div className="me-tokyo-portrait">
              <Image src="/images/hero-manga-portrait-clean.webp" alt="Ink-style portrait of Royce Mathew" fill sizes="(max-width: 767px) 70vw, 46vw" priority />
              <span className="me-tokyo-portrait-edge" aria-hidden="true" />
            </div>
            <div className="me-tokyo-detail" aria-hidden="true">
              <Image src="/images/hero-manga-portrait-clean.webp" alt="" fill sizes="(max-width: 767px) 15vw, 20vw" />
              <span lang="ja">人工知能</span>
            </div>
            <div className="me-tokyo-identity">
              <span className="me-tokyo-developer" lang="ja" aria-hidden="true">開発者</span>
              <div className="me-tokyo-roles"><p>Software Developer</p><p>AI Developer</p><p>Game Developer</p></div>
            </div>
            <nav className="me-tokyo-navigation" aria-label="Introduction links">
              <Link className="me-tokyo-projects" href="/projects?study=panels&variant=B">Projects <span aria-hidden="true">↗</span></Link>
              <Link href="#scroll-about">About <span aria-hidden="true">↓</span></Link>
              <a href="mailto:royce1mathew@gmail.com">Email <span aria-hidden="true">↗</span></a>
              <a href="/files/Royce%20Mathew%20Resume.pdf" target="_blank" rel="noopener noreferrer">Resume <span aria-hidden="true">↗</span></a>
            </nav>
          </div>
        </section>
      </div>
    </div>
  );
}
