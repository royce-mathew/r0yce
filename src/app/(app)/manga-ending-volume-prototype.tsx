"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./manga-ending-volume-prototype.css";

export function VolumeEndingPrototype() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const element = root.current;
    if (!element) return;
    const media = gsap.matchMedia();
    media.add(
      {
        desktop: "(min-width: 768px)",
        mobile: "(max-width: 767px)",
        motion: "(prefers-reduced-motion: no-preference)",
        reduced: "(prefers-reduced-motion: reduce)",
        tall: "(min-height: 701px)",
      },
      (context) => {
        const navigation = element.querySelector<HTMLElement>(".me-volume-navigation");
        const portrait = element.querySelector<HTMLElement>(".me-volume-portrait");
        const stage = element.querySelector<HTMLElement>(".me-volume-stage");
        if (!navigation || !portrait || !stage) return;
        if (!context.conditions?.motion || !context.conditions?.tall) {
          element.dataset.progress = context.conditions?.reduced ? "reduced" : "1";
          navigation.inert = false;
          return;
        }
        navigation.inert = true;
        const portraitBounds = portrait.getBoundingClientRect();
        const stageBounds = stage.getBoundingClientRect();
        gsap.set(".me-volume-curtain", { autoAlpha: 1 });
        gsap.set(".me-volume-opening", { autoAlpha: 1 });
        gsap.set(".me-volume-reveal", { autoAlpha: 0, y: 25 });
        gsap.set(portrait, {
          x: stageBounds.width / 2 - (portraitBounds.left - stageBounds.left + portraitBounds.width / 2),
          y: stageBounds.height / 2 - (portraitBounds.top - stageBounds.top + portraitBounds.height / 2) - 30,
          clipPath: "inset(0% 35% 0% 35%)",
          scale: context.conditions.mobile ? 1.2 : 1.08,
        });
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: element,
            start: context.conditions.mobile ? "top top+=76" : "top top+=90",
            end: "bottom bottom",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
          onUpdate: () => {
            element.dataset.progress = timeline.progress().toFixed(3);
            navigation.inert = Number(gsap.getProperty(navigation, "opacity")) < 0.95;
          },
        });
        timeline
          .to(".me-volume-opening-first", { xPercent: -24, yPercent: -35, scale: 0.7, duration: 0.38 }, 0)
          .to(".me-volume-opening-last", { xPercent: 24, yPercent: 35, scale: 0.7, duration: 0.38 }, 0)
          .to(".me-volume-opening", { autoAlpha: 0, duration: 0.18 }, 0.22)
          .to(portrait, { clipPath: "inset(0% 0% 0% 0%)", scale: 1, x: 0, y: 0, duration: 0.47, ease: "power2.inOut" }, 0.15)
          .to(".me-volume-curtain", { autoAlpha: 0, duration: 0.3 }, 0.28)
          .to(".me-volume-reveal", { autoAlpha: 1, y: 0, duration: 0.22, stagger: 0.035 }, 0.43)
          .to({}, { duration: 0.32 });
        return () => {
          navigation.inert = false;
        };
      },
      element,
    );
    return () => media.revert();
  }, []);

  return (
    <div ref={root} data-ending-prototype="C" data-progress="0" className="me-volume">
      <div className="me-volume-track manga-ending-track">
        <section className="me-volume-stage manga-ending-stage" aria-label="Royce Mathew introduction">
          <div className="me-volume-spread">
            <div className="me-volume-portrait">
              <Image src="/images/hero-manga-portrait-clean.webp" alt="Black-and-white illustrated portrait of Royce Mathew" fill sizes="(max-width: 767px) 75vw, 60vw" priority />
            </div>
            <div className="me-volume-eye me-volume-reveal" aria-hidden="true">
              <Image src="/images/hero-manga-portrait-clean.webp" alt="" fill sizes="(max-width: 767px) 20vw, 15vw" />
            </div>
            <div className="me-volume-margin me-volume-reveal" lang="ja" aria-hidden="true">
              <span className="me-volume-japanese">ものづくり</span>
              <span className="me-volume-seal">余白</span>
            </div>
            <div className="me-volume-signature me-volume-reveal">
              <h1>Royce <em>Mathew</em></h1>
              <div className="me-volume-roles">
                <span>Software Developer</span>
                <span>AI Developer</span>
                <span>Game Developer</span>
              </div>
            </div>
            <nav className="me-volume-navigation me-volume-reveal" aria-label="Introduction links">
              <Link href="/projects?study=panels&variant=C">Projects<span aria-hidden="true">↗</span></Link>
              <Link href="#scroll-about">About<span aria-hidden="true">↗</span></Link>
              <a href="mailto:royce1mathew@gmail.com">Email<span aria-hidden="true">↗</span></a>
              <a href="/files/Royce%20Mathew%20Resume.pdf" target="_blank" rel="noopener noreferrer">Resume<span aria-hidden="true">↗</span></a>
            </nav>
          </div>
          <div className="me-volume-curtain" aria-hidden="true" />
          <div className="me-volume-opening" aria-hidden="true">
            <span className="me-volume-opening-first">Royce</span>
            <span className="me-volume-opening-last">Mathew</span>
          </div>
        </section>
      </div>
    </div>
  );
}
