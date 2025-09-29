"use client"

import Image from "next/image"
import Link from "next/link"
import {
  IconArrowDown,
  IconBrandGithubFilled,
  IconFileFilled,
  IconMailFilled,
} from "@tabler/icons-react"
import { domAnimation, LazyMotion } from "motion/react"
import * as m from "motion/react-m"
import { Icons } from "@/config/icons"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { FlipWords } from "@/components/ui/flip-words"
import { LinkPreview } from "@/components/ui/link-preview"

export function ProfileSection() {
  const scrollToAbout = () => {
    const aboutElement = document.getElementById("about")
    if (aboutElement) {
      const topbarHeight = 62
      const elementPosition = aboutElement.offsetTop - topbarHeight

      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      })
    }
  }

  const spring = {
    type: "spring" as const,
    damping: 50,
    stiffness: 120,
    mass: 1.2,
  }

  return (
    <section
      data-section="profile"
      className="relative flex h-[calc(100vh-4rem)] w-full items-center justify-center px-6 py-8 md:px-8"
    >
      <LazyMotion features={domAnimation}>
        <div
          className={cn(
            "absolute inset-0 -z-30",
            "[background-size:40px_40px]",
            "[background-image:linear-gradient(to_right,rgba(231,229,228,0.5)_1px,transparent_1px),linear-gradient(to_bottom,rgba(231,229,228,0.5)_1px,transparent_1px)]",
            "dark:[background-image:linear-gradient(to_right,rgba(38,38,38,0.8)_1px,transparent_1px),linear-gradient(to_bottom,rgba(38,38,38,0.8)_1px,transparent_1px)]"
          )}
        />
        {/* Radial gradient for the container to give a faded look */}
        <div className="pointer-events-none absolute inset-0 -z-20 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <div className="-mt-16 flex w-full max-w-6xl flex-col items-center justify-center space-y-8 md:-mt-20 md:flex-row md:space-y-0 md:space-x-12">
          {/* Profile Image */}
          <m.div
            className="relative flex-shrink-0"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={spring}
          >
            <m.svg
              className="absolute top-[10px] left-[10px] -z-10 size-48 opacity-30 md:top-[15px] md:left-[15px] md:size-[350px]"
              viewBox="0 0 100 100"
              initial={{ pathLength: 0, rotate: -15, scale: 0.5 }}
              animate={{ pathLength: 1, rotate: 0, scale: 1 }}
              transition={{ ...spring }}
            >
              <m.rect
                x="1"
                y="1"
                width="98"
                height="98"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            </m.svg>

            <m.svg
              className="absolute top-[20%] -left-[3%] z-0 size-5 opacity-30"
              viewBox="0 0 32 32"
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 45 }}
              transition={{ ...spring, delay: 0.5 }}
            >
              <m.rect
                x="1"
                y="1"
                width="30"
                height="30"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            </m.svg>

            <m.svg
              className="absolute top-[20%] -left-[1%] z-10 size-5"
              viewBox="0 0 32 32"
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 45 }}
              transition={{ ...spring, delay: 0.5 }}
            >
              <m.rect
                x="0"
                y="0"
                width="32"
                height="32"
                fill="hsl(var(--primary))"
              />
            </m.svg>

            <m.svg
              className="absolute -bottom-[5%] left-[20%] z-10 size-7 opacity-30"
              viewBox="0 0 32 32"
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 30 }}
              transition={{ ...spring, delay: 1 }}
            >
              <m.rect
                x="1"
                y="1"
                width="30"
                height="30"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            </m.svg>

            <m.svg
              className="absolute -bottom-[2.5%] left-[20%] z-10 size-7"
              viewBox="0 0 32 32"
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 30 }}
              transition={{ ...spring, delay: 1 }}
            >
              <m.rect
                x="0"
                y="0"
                width="32"
                height="32"
                fill="hsl(var(--primary))"
              />
            </m.svg>

            <Image
              className="size-48 rounded shadow-2xl md:size-[350px]"
              fetchPriority="high"
              loading="eager"
              src="/images/ProfilePicture2.webp"
              width={600}
              height={600}
              alt="Profile"
            />
          </m.div>

          <m.div
            className="flex w-full max-w-md flex-col space-y-6 text-center md:max-w-lg md:text-left"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={spring}
          >
            <div className="space-y-1 md:space-y-3">
              {/* Name */}
              <h1 className="font-cal text-3xl leading-tight font-bold sm:text-4xl md:text-5xl lg:text-6xl dark:text-white">
                Royce Mathew
              </h1>

              <FlipWords
                words={[
                  "Software Developer",
                  "Data Scientist",
                  "Game Developer",
                  "HBSc Student",
                ]}
                duration={3000}
                className="font-cal text-xl text-primary md:text-2xl lg:text-3xl"
              />
              {/* Description and Welcome Message */}
              <p className="hidden text-sm leading-relaxed text-foreground/60 md:block md:text-base lg:text-lg">
                I&apos;m a developer based in Canada with an interest in cloud
                and data science. This website showcases my projects, skills,
                and experiences.
              </p>
            </div>

            {/* Contact Information */}
            <div className="flex w-full justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
              <div className="flex justify-center space-x-3 sm:justify-start md:space-x-4">
                <Button
                  asChild
                  variant="outline"
                  className="size-10 p-0 shadow-lg md:size-12"
                >
                  <Link
                    href="https://github.com/royce-mathew"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                  >
                    <IconBrandGithubFilled className="size-5 md:size-6" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="size-10 p-0 shadow-lg md:size-12"
                >
                  <Link
                    href="https://www.linkedin.com/in/royce-mathew"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                  >
                    <Icons.LinkedIn className="size-5 md:size-6" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="size-10 p-0 shadow-lg md:size-12"
                >
                  <Link
                    href="mailto:royce1mathew@gmail.com"
                    aria-label="Email to user"
                  >
                    <IconMailFilled className="size-5 md:size-6" />
                  </Link>
                </Button>
              </div>
              <Button
                asChild
                variant="outline"
                className="text-md h-10 w-fit px-4 py-2 shadow-lg md:h-12 md:px-6 md:text-xl"
              >
                <Link
                  href="/files/Royce%20Mathew%20Resume.pdf"
                  aria-label="Resume"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconFileFilled className="mr-2 size-4 md:size-5" /> Resume
                </Link>
              </Button>
            </div>
          </m.div>
        </div>

        {/* Scroll to About Button */}
        <m.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 1.0 }}
        >
          <Button
            variant="outline"
            size="lg"
            className="rounded-full px-4 py-2 shadow-lg transition-normal hover:shadow-xl md:px-6 md:py-3"
            onClick={scrollToAbout}
            aria-label="Scroll to About section"
          >
            <span className="flex items-center space-x-2 text-xs md:text-sm">
              <span>Learn More</span>
              <m.div
                animate={{ y: [-2, 2, -2] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <IconArrowDown className="size-4 md:size-5" />
              </m.div>
            </span>
          </Button>
        </m.div>
      </LazyMotion>
    </section>
  )
}
