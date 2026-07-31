"use client"

import Image from "next/image"
import Link from "next/link"
import {
  IconArrowDown,
  IconBrandGithubFilled,
  IconFileFilled,
  IconMailFilled,
} from "@tabler/icons-react"
import { motion, useScroll, useTransform } from "motion/react"
import { useRef } from "react"
import { Icons } from "@/config/icons"
import { MagneticButton } from "@/components/ui/magnetic-button"

export function ProfileSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })

  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const heroY = useTransform(scrollYProgress, [0, 0.8], [0, -80])
  const imageScale = useTransform(scrollYProgress, [0, 0.8], [1, 1.1])
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 50])

  const scrollToAbout = () => {
    const aboutElement = document.getElementById("about")
    if (aboutElement) {
      aboutElement.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section
      ref={sectionRef}
      data-section="profile"
      className="relative flex min-h-[calc(100svh-4rem)] w-full items-center justify-center overflow-hidden pt-12 pb-24 md:min-h-[calc(100svh-5rem)] md:pt-16 md:pb-28 lg:py-0"
    >
      {/* Background gradient mesh */}
      <div className="absolute inset-0 -z-20">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background" />
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-primary/[0.03] blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-primary/[0.05] blur-[100px]" />
      </div>

      {/* Subtle grid */}
      <div className="absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      <motion.div
        style={{ opacity: heroOpacity, y: heroY }}
        className="relative z-10 w-full max-w-6xl px-6 md:px-8"
      >
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:gap-20">
          {/* Left: Typography */}
          <div className="flex flex-1 flex-col space-y-5 md:space-y-8 text-center lg:text-left max-w-sm sm:max-w-none mx-auto lg:mx-0">
            {/* Label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1], delay: 0.2 }}
            >
              <span className="label-editorial label-editorial-compact text-gold block text-balance">
                Software Developer · Data Scientist · Game Developer
              </span>
            </motion.div>

            {/* Name */}
            <motion.h1
              className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.19, 1, 0.22, 1], delay: 0.4 }}
            >
              <span className="block text-foreground">Royce</span>
              <span className="block font-display italic text-gold">
                Mathew
              </span>
            </motion.h1>

            {/* Horizontal rule with accent */}
            <motion.div
              className="flex origin-center items-center gap-3 sm:gap-4 lg:origin-left"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 1, ease: [0.19, 1, 0.22, 1], delay: 0.7 }}
            >
              <div className="h-px flex-1 bg-linear-to-l from-primary/40 to-transparent lg:bg-linear-to-r" />
              <span className="label-editorial shrink-0 text-muted-foreground">
                Based in Canada
              </span>
              <div className="h-px flex-1 bg-linear-to-r from-primary/40 to-transparent lg:hidden" />
            </motion.div>

            {/* Description */}
            <motion.p
              className="max-w-md text-sm sm:text-base leading-relaxed text-muted-foreground lg:text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1], delay: 0.9 }}
            >
              Building at the intersection of cloud infrastructure, data science,
              and creative engineering. Crafting solutions that scale.
            </motion.p>

            {/* Social links + Resume */}
            <motion.div
              className="flex flex-wrap items-center justify-center gap-3 lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1], delay: 1.1 }}
            >
              <MagneticButton>
                <Link
                  href="https://github.com/royce-mathew"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="flex size-11 items-center justify-center rounded-full border border-border/50 text-muted-foreground transition-all duration-300 hover:border-primary/40 hover:text-foreground hover:bg-primary/5"
                >
                  <IconBrandGithubFilled className="size-[18px]" />
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link
                  href="https://www.linkedin.com/in/royce-mathew"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="flex size-11 items-center justify-center rounded-full border border-border/50 text-muted-foreground transition-all duration-300 hover:border-primary/40 hover:text-foreground hover:bg-primary/5"
                >
                  <Icons.LinkedIn className="size-[18px]" />
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link
                  href="mailto:royce1mathew@gmail.com"
                  aria-label="Email"
                  className="flex size-11 items-center justify-center rounded-full border border-border/50 text-muted-foreground transition-all duration-300 hover:border-primary/40 hover:text-foreground hover:bg-primary/5"
                >
                  <IconMailFilled className="size-[18px]" />
                </Link>
              </MagneticButton>

              <div className="mx-2 hidden h-6 w-px bg-border/30 lg:block" />

              <MagneticButton>
                <Link
                  href="/files/Royce%20Mathew%20Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Resume"
                  className="flex items-center gap-2 rounded-full border border-border/50 px-5 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-300 hover:border-primary/40 hover:text-foreground hover:bg-primary/5"
                >
                  <IconFileFilled className="size-3.5" />
                  <span className="tracking-wide">Resume</span>
                </Link>
              </MagneticButton>
            </motion.div>
          </div>

          {/* Right: Profile Image */}
          <motion.div
            className="mt-4 w-full max-w-[240px] shrink-0 sm:mt-6 sm:w-auto sm:max-w-none lg:mt-0"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1], delay: 0.3 }}
          >
            {/* Framed image — the frames and corner marks are anchored to this
                wrapper so they hug the portrait rather than the caption. */}
            <div className="relative">
              {/* Decorative frame */}
              <motion.div
                className="pointer-events-none absolute -inset-2 rounded-sm border border-primary/10 sm:-inset-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.2 }}
              />
              <motion.div
                className="pointer-events-none absolute -inset-4 rounded-sm border border-primary/5 sm:-inset-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.4 }}
              />

              {/* Gold accent corner marks */}
              <div className="pointer-events-none absolute -top-2 -left-2 h-4 w-px bg-primary/30 sm:-top-3 sm:-left-3 sm:h-6" />
              <div className="pointer-events-none absolute -top-2 -left-2 h-px w-4 bg-primary/30 sm:-top-3 sm:-left-3 sm:w-6" />
              <div className="pointer-events-none absolute -right-2 -bottom-2 h-4 w-px bg-primary/30 sm:-right-3 sm:-bottom-3 sm:h-6" />
              <div className="pointer-events-none absolute -right-2 -bottom-2 h-px w-4 bg-primary/30 sm:-right-3 sm:-bottom-3 sm:w-6" />

              <motion.div
                className="aspect-square w-full overflow-hidden rounded-sm sm:aspect-auto sm:size-64 md:size-72 lg:size-80"
                style={{ scale: imageScale, y: imageY }}
              >
                <Image
                  className="h-full w-full object-cover"
                  fetchPriority="high"
                  loading="eager"
                  src="/images/ProfilePicture2.webp"
                  width={600}
                  height={600}
                  alt="Royce Mathew"
                />
              </motion.div>
            </div>

            {/* Caption under image */}
            <motion.p
              className="label-editorial mt-5 text-center sm:mt-7"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.5 }}
            >
              Analyst @ TD Asset Management
            </motion.p>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 1.6 }}
      >
        <button
          onClick={scrollToAbout}
          aria-label="Scroll to About section"
          className="group flex flex-col items-center gap-2"
        >
          <span className="label-editorial text-muted-foreground/60 group-hover:text-muted-foreground transition-colors">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <IconArrowDown className="size-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
          </motion.div>
        </button>
      </motion.div>
    </section>
  )
}
