"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./manga-ending-void-prototype.css";

export function VoidEndingPrototype() {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = root.current;
    if (!element) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add(
      {
        desktop: "(min-width: 768px)",
        mobile: "(max-width: 767px)",
        reduced: "(prefers-reduced-motion: reduce)",
        short: "(max-height: 659px)",
      },
      (context) => {
        const { mobile, reduced, short } = context.conditions!;
        const navigation = element.querySelector<HTMLElement>(".me-void-links");
        if (!navigation) return;
        if (reduced || short) {
          element.dataset.progress = reduced ? "reduced" : "static";
          navigation.inert = false;
          return;
        }
        const select = gsap.utils.selector(element);
        navigation.inert = true;
        const timeline = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: select(".me-void-track")[0],
            start: mobile ? "top top+=76" : "top top+=90",
            end: "bottom bottom",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
          onUpdate: () => {
            navigation.inert = timeline.time() < 0.85;
            element.dataset.progress = timeline.progress().toFixed(3);
          },
        });
        timeline
          .fromTo(".me-void-name-first", { xPercent: mobile ? 9 : 18, y: mobile ? -180 : -190, scale: mobile ? 1.25 : 1.65 }, { xPercent: 0, y: 0, scale: 1, duration: 0.65 }, 0)
          .fromTo(".me-void-name-last", { xPercent: mobile ? -5 : 9, y: mobile ? -140 : -135, scale: mobile ? 1.25 : 1.65 }, { xPercent: 0, y: 0, scale: 1, duration: 0.65 }, 0)
          .fromTo(".me-void-portrait", { clipPath: "inset(0 42% 0 42%)", xPercent: mobile ? -18 : -65, rotationY: -24, z: -140 }, { clipPath: "inset(0 0% 0 0%)", xPercent: 0, rotationY: 0, z: 0, duration: 0.7 }, 0)
          .fromTo(".me-void-frame-one", { rotationY: 68, scale: 0.48, z: -260, xPercent: 15 }, { rotationY: 0, scale: 1, z: 0, xPercent: 0, duration: 0.65 }, 0.12)
          .fromTo(".me-void-frame-two", { rotationY: -65, scale: 0.35, z: -420, xPercent: -20 }, { rotationY: 0, scale: 1, z: 0, xPercent: 0, duration: 0.65 }, 0.18)
          .fromTo(".me-void-hand-left", { xPercent: -18, rotationY: 35, autoAlpha: 0 }, { xPercent: 0, rotationY: 0, autoAlpha: 1, duration: 0.6 }, 0.2)
          .fromTo(".me-void-hand-right", { xPercent: 18, rotationY: -35, autoAlpha: 0 }, { xPercent: 0, rotationY: 0, autoAlpha: 1, duration: 0.6 }, 0.2)
          .fromTo(".me-void-detail", { autoAlpha: 0, rotationY: 75, x: -65 }, { autoAlpha: 1, rotationY: 0, x: 0, stagger: 0.08, duration: 0.45 }, 0.3)
          .fromTo(".me-void-japanese", { autoAlpha: 0, y: 35 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 0.4)
          .fromTo(".me-void-identity, .me-void-links", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.3 }, 0.55)
          .to({}, { duration: 0.55 });
        return () => {
          navigation.inert = false;
        };
      },
      element,
    );
    return () => media.revert();
  }, []);

  return (
    <div ref={root} data-ending-prototype="E" data-progress="0" className="me-void">
      <div className="me-void-track manga-ending-track">
        <section className="me-void-stage manga-ending-stage" aria-label="Royce Mathew introduction">
          <div className="me-void-spread">
            <div className="me-void-frame me-void-frame-one" aria-hidden="true" />
            <div className="me-void-frame me-void-frame-two" aria-hidden="true" />
            <div className="me-void-hands me-void-hand-left" aria-hidden="true">
              <Image src="/images/creation-of-adam-hands.webp" alt="" fill sizes="90vw" />
            </div>
            <div className="me-void-hands me-void-hand-right" aria-hidden="true">
              <Image src="/images/creation-of-adam-hands.webp" alt="" fill sizes="90vw" />
            </div>
            <div className="me-void-detail me-void-detail-far" aria-hidden="true">
              <Image src="/images/hero-manga-portrait-clean.webp" alt="" fill sizes="12vw" />
            </div>
            <div className="me-void-detail me-void-detail-near" aria-hidden="true">
              <Image src="/images/hero-manga-portrait-clean.webp" alt="" fill sizes="15vw" />
            </div>
            <div className="me-void-portrait">
              <Image src="/images/hero-manga-portrait-clean.webp" alt="Black and white manga portrait of Royce Mathew" fill sizes="(max-width: 767px) 58vw, 43vw" priority />
            </div>
            <div className="me-void-japanese" lang="ja" aria-hidden="true">余白<span>開発者</span></div>
            <h1 className="me-void-name"><span className="me-void-name-first">Royce</span><span className="me-void-name-last">Mathew</span></h1>
            <div className="me-void-identity">
              <p>Software Developer</p>
              <p className="me-void-ai">AI Developer</p>
              <p>Game Developer</p>
            </div>
            <nav className="me-void-links" aria-label="Portfolio">
              <Link href="/projects?study=panels&variant=E">Projects<span aria-hidden="true">↗</span></Link>
              <a href="#scroll-about">About<span aria-hidden="true">↗</span></a>
              <a href="mailto:royce1mathew@gmail.com">Email<span aria-hidden="true">↗</span></a>
              <a href="/files/Royce%20Mathew%20Resume.pdf" target="_blank" rel="noopener noreferrer">Resume<span aria-hidden="true">↗</span></a>
            </nav>
          </div>
        </section>
      </div>
    </div>
  );
}
