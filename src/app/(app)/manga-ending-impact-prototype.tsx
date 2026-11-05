"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./manga-ending-impact-prototype.css";

export function ImpactEndingPrototype() {
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
        tall: "(min-height: 701px)",
      },
      (context) => {
        const { mobile, motion, tall } = context.conditions!;
        const links = element.querySelector<HTMLElement>(".me-impact-links")!;
        if (!motion || !tall) {
          element.dataset.progress = motion ? "1" : "reduced";
          links.inert = false;
          return;
        }
        const stage = element.querySelector<HTMLElement>(".me-impact-stage")!;
        links.inert = true;
        gsap.set(".me-impact-title", { y: () => stage.clientHeight * 0.31, scale: mobile ? 1.05 : 1.16 });
        gsap.set(".me-impact-name-first", { xPercent: -4 });
        gsap.set(".me-impact-name-last", { xPercent: 4 });
        gsap.set(".me-impact-main", { clipPath: "polygon(43% 0, 65% 0, 65% 100%, 43% 100%)", xPercent: mobile ? 25 : 30, yPercent: -6, scale: 0.91 });
        gsap.set(".me-impact-eye", { xPercent: 125, yPercent: -80, rotation: 12, autoAlpha: 0 });
        gsap.set(".me-impact-detail", { xPercent: 90, yPercent: 60, rotation: -13, autoAlpha: 0 });
        gsap.set(".me-impact-japanese", { yPercent: -35, autoAlpha: 0 });
        gsap.set(".me-impact-roles", { yPercent: 130, rotation: -9, autoAlpha: 0 });
        gsap.set(links, { y: 30, autoAlpha: 0 });
        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: ".me-impact-track",
            start: mobile ? "top top+=76" : "top top+=90",
            end: "bottom bottom",
            scrub: 0.7,
            invalidateOnRefresh: true,
          },
          onUpdate() {
            element.dataset.progress = timeline.progress().toFixed(3);
            links.inert = Number(gsap.getProperty(links, "opacity")) < 0.98;
          },
        });
        timeline
          .to(".me-impact-title", { y: 0, scale: 1, duration: 0.36 }, 0.04)
          .to(".me-impact-name-first", { xPercent: 0, duration: 0.3 }, 0.04)
          .to(".me-impact-name-last", { xPercent: 0, duration: 0.3 }, 0.08)
          .to(".me-impact-main", { xPercent: 0, yPercent: 0, scale: 1, clipPath: "polygon(0% 0%, 100% 0%, 89% 100%, 0% 100%)", duration: 0.42 }, 0.05)
          .to(".me-impact-eye", { xPercent: 0, yPercent: 0, rotation: 0, autoAlpha: 1, duration: 0.25 }, 0.25)
          .to(".me-impact-detail", { xPercent: 0, yPercent: 0, rotation: 0, autoAlpha: 1, duration: 0.26 }, 0.32)
          .to(".me-impact-japanese", { yPercent: 0, autoAlpha: 1, duration: 0.24 }, 0.3)
          .to(".me-impact-roles", { yPercent: 0, rotation: 0, autoAlpha: 1, duration: 0.22 }, 0.43)
          .to(links, { y: 0, autoAlpha: 1, duration: 0.12 }, 0.58)
          .to({}, { duration: 0.3 });
        return () => { links.inert = false; };
      },
      element,
    );
    return () => media.revert();
  }, []);

  return (
    <div ref={root} data-ending-prototype="A" data-progress="0" className="me-impact">
      <div className="me-impact-track manga-ending-track">
        <section className="me-impact-stage manga-ending-stage" aria-label="Introduction">
          <div className="me-impact-grain" aria-hidden="true" />
          <h1 className="me-impact-title"><span className="me-impact-name-first">Royce</span><span className="me-impact-name-last">Mathew</span></h1>
          <div className="me-impact-main me-impact-panel">
            <Image src="/images/hero-manga-portrait-clean.webp" alt="Black-and-white illustrated portrait of Royce Mathew" fill sizes="(max-width: 767px) 82vw, 65vw" priority />
          </div>
          <div className="me-impact-eye me-impact-panel" aria-hidden="true">
            <Image src="/images/hero-manga-portrait-clean.webp" alt="" fill sizes="(max-width: 767px) 50vw, 38vw" />
          </div>
          <div className="me-impact-detail me-impact-panel" aria-hidden="true">
            <Image src="/images/hero-manga-portrait-clean.webp" alt="" fill sizes="(max-width: 767px) 25vw, 23vw" />
          </div>
          <div className="me-impact-japanese" lang="ja" aria-hidden="true">開発者</div>
          <div className="me-impact-roles">
            <span className="me-impact-software">Software Developer</span>
            <span className="me-impact-ai">AI Developer</span>
            <span className="me-impact-game">Game Developer</span>
          </div>
          <nav className="me-impact-links" aria-label="Introduction links">
            <Link className="me-impact-projects" href="/projects?study=panels&variant=A">Projects <span aria-hidden="true">↗</span></Link>
            <Link href="#scroll-about">About</Link>
            <a href="mailto:royce1mathew@gmail.com">Email</a>
            <a href="/files/Royce%20Mathew%20Resume.pdf" target="_blank" rel="noopener noreferrer">Resume <span aria-hidden="true">↗</span></a>
          </nav>
        </section>
      </div>
    </div>
  );
}
