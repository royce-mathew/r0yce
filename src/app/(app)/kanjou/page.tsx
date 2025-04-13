"use client"

import { useEffect, useRef, useState } from "react"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { IconBatteryCharging, IconWifi } from "@tabler/icons-react"
import { motion, useInView } from "motion/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Typewriter } from "@/components/custom/typewriter"

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const zoomIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
}

const FloatingPhone = ({ className }: { className?: string }) => {
  const [scrollX, setScrollX] = useState(0)
  const [targetScrollX, setTargetScrollX] = useState(0)
  const [backgroundWidth, setBackgroundWidth] = useState(0)

  useEffect(() => {
    const updateBackgroundWidth = () => {
      const backgroundElement = document.querySelector(
        ".bg-gradient-to-br.from-primary.to-violet-700"
      )
      if (backgroundElement) {
        setBackgroundWidth(backgroundElement.getBoundingClientRect().width)
      }
    }

    updateBackgroundWidth()
    window.addEventListener("resize", updateBackgroundWidth)

    return () => window.removeEventListener("resize", updateBackgroundWidth)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const maxScroll = 300
      const normalizedScroll = Math.min(scrollPosition / maxScroll, 1)
      setTargetScrollX(normalizedScroll * (backgroundWidth - 200))
    }

    handleScroll()

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [backgroundWidth])

  useEffect(() => {
    let animationId: number | null = null

    const animateScroll = () => {
      const diff = targetScrollX - scrollX
      const easing = 0.015

      if (Math.abs(diff) > 0.1) {
        setScrollX((prev) => prev + diff * easing)
        animationId = requestAnimationFrame(animateScroll)
      } else {
        setScrollX(targetScrollX)
      }
    }

    animationId = requestAnimationFrame(animateScroll)

    return () => {
      if (animationId !== null) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [targetScrollX, scrollX])

  return (
    <div className={`relative ${className} `}>
      <div className="-z-10 h-[250px] w-full bg-gradient-to-br from-primary to-violet-700" />

      <div
        style={{
          transformStyle: "preserve-3d",
          transform: `translateX(${scrollX}px) rotateY(-20deg) rotateX(10deg)`,
        }}
        className="absolute top-1/2 -left-10 h-[28rem] w-fit -translate-y-1/2 rounded-[20px] bg-background p-3"
      >
        <motion.div
          initial={{ transform: "translateZ(16px) translateY(-4px)" }}
          animate={{ transform: "translateZ(48px) translateY(-12px)" }}
          transition={{
            repeat: Infinity,
            repeatType: "mirror",
            duration: 3,
            ease: "easeInOut",
          }}
          className="relative h-full w-64 rounded-[20px] border-[1.5px] border-foreground/15 bg-gradient-to-b from-neutral-900 to-neutral-800 p-[6px]"
        >
          <HeaderBar />
          <Screen />
        </motion.div>
      </div>
    </div>
  )
}

const HeaderBar = () => {
  return (
    <>
      <div className="absolute top-3 left-1/2 z-10 h-2 w-16 -translate-x-1/2 rounded-full bg-neutral-700/80" />
      <div className="absolute top-2.5 right-3 z-10 flex gap-2">
        <IconWifi className="text-neutral-500" />
        <IconBatteryCharging className="text-neutral-500" />
      </div>
    </>
  )
}

const Screen = () => {
  return (
    <div className="relative z-0 flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-[20px] bg-gradient-to-br from-background/10 to-background/5 shadow-inner backdrop-blur-md">
      <svg
        width="100"
        height="100"
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        <path
          d="M16 8H40L48 16V56C48 57.1 47.1 58 46 58H18C16.9 58 16 57.1 16 56V8Z"
          fill="white"
        />

        <path d="M40 8V16H48" fill="#ccc" />

        <g transform="translate(22, 22) scale(0.03)">
          <path
            d="M576 64L448 64 192 288 192 64 64 64 64 448 192 448 192 320 448 576 576 576 320 320z"
            fill="black"
          />
        </g>
      </svg>

      <Link href="/kanjou/docs">
        <Button
          className="outline-outline backdrop-blur-smpx-7 p y-5 absolute right-4 bottom-5 left-4 z-10 rounded-lg border border-white/20 bg-foreground text-background shadow-lg hover:bg-background/60 hover:shadow-xl"
          size="lg"
          variant="ghost"
        >
          Get Started
        </Button>
      </Link>

      <div className="absolute -bottom-60 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-500/50 blur-2xl" />
    </div>
  )
}

export default function KanjouIntroduction() {
  const documentsStoredRef = useRef(null)
  const featuresGridRef = useRef(null)

  const isDocumentsStoredInView = useInView(documentsStoredRef, {
    amount: 0.3,
  })
  const isFeaturesGridInView = useInView(featuresGridRef, {
    amount: 0.3,
  })

  return (
    <div className="min-h-screen bg-gradient-to-br p-6">
      <div className="container mx-auto px-4">
        <motion.header
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <motion.h1
            variants={fadeIn}
            transition={{ duration: 0.5 }}
            className="mt-30 mb-4 flex flex-wrap items-center justify-center text-4xl font-bold drop-shadow-lg sm:text-5xl md:text-6xl"
          >
            Welcome to
            <Typewriter
              text="Kanjou"
              className="ml-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text py-2 whitespace-nowrap text-transparent"
            />
          </motion.h1>
          <motion.p
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mt-5 max-w-3xl text-base text-muted-foreground sm:text-lg"
          >
            Kanjou is your modern and intuitive document management platform.{" "}
            <b className="font-semibold text-foreground">
              Create, organize, and collaborate
            </b>{" "}
            on your projects with powerful tools that make document management a
            breeze.
          </motion.p>
        </motion.header>

        <FloatingPhone className="my-30" />
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 flex flex-row items-center justify-center space-x-3"
        >
          <Link href="/kanjou/docs">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                className="outline-outline rounded-lg border bg-foreground px-7 py-6 text-background shadow-lg hover:bg-background hover:shadow-xl"
                size="lg"
                variant="ghost"
              >
                Get Started
              </Button>
            </motion.div>
          </Link>
          <Link href="/projects/kanjou">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                className="rounded-lg border px-7 py-6 shadow-lg hover:shadow-xl"
                size="lg"
                variant="outline"
              >
                Learn More
              </Button>
            </motion.div>
          </Link>
        </motion.div>

        <motion.div
          ref={featuresGridRef}
          initial="hidden"
          animate={isFeaturesGridInView ? "visible" : "hidden"}
          variants={fadeIn}
          transition={{ duration: 0.5 }}
          className="mt-20 text-left"
        >
          <h2 className="mb-6 text-3xl font-bold sm:text-4xl md:text-5xl">
            Key Features
          </h2>
          <p className="mb-10 text-base text-muted-foreground sm:text-lg">
            Explore the powerful features that make Kanjou the perfect solution
            for your document management needs
          </p>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            <motion.div
              className="w-full"
              initial="hidden"
              animate={isFeaturesGridInView ? "visible" : "hidden"}
              variants={zoomIn}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold">
                    Easy Document Management
                  </CardTitle>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Organize and share your documents seamlessly.
                  </p>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <Image
                    src="/images/KanjouDocuments.png"
                    alt="Document Management"
                    width={1920}
                    height={1080}
                    className="max-h-[300px] w-full rounded-xl object-cover shadow-md"
                  />
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              className="w-full"
              initial="hidden"
              animate={isFeaturesGridInView ? "visible" : "hidden"}
              variants={zoomIn}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold">
                    Collaboration
                  </CardTitle>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Work together in real time to boost productivity.
                  </p>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <Image
                    src="/images/KanjouShare.png"
                    alt="Collaboration"
                    width={1920}
                    height={1080}
                    className="max-h-[300px] w-full rounded-xl object-cover shadow-md"
                  />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
        <motion.div
          ref={documentsStoredRef}
          initial="hidden"
          animate={isDocumentsStoredInView ? "visible" : "hidden"}
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-40 mb-20 text-left"
        >
          <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">
            How Documents Are Stored
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Kanjou leverages the power of Firebase to store your documents
            securely and save changes in real time. Here&apos;s how it works:
          </p>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Secure Cloud Storage
                </CardTitle>
                <p className="mt-2 text-sm text-muted-foreground">
                  Your documents are stored in Firebase&apos;s secure and
                  scalable cloud infrastructure, ensuring data safety and
                  availability.
                </p>
              </CardHeader>
            </Card>
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Real-Time Updates
                </CardTitle>
                <p className="mt-2 text-sm text-muted-foreground">
                  Every change you make is instantly saved and synchronized
                  across all your devices, thanks to Firebase&apos;s real-time
                  database.
                </p>
              </CardHeader>
            </Card>
          </div>

          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            To learn more about how Kanjou works, check out the{" "}
            <Link
              href="/projects/kanjou"
              className="text-primary hover:underline"
            >
              Kanjou documentation
            </Link>
          </p>

          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            If you have any questions or feedback, feel free to reach out on the{" "}
            <Link
              href="https://github.com/royce-mathew/r0yce"
              className="text-primary hover:underline"
            >
              GitHub repository
            </Link>
            . We&apos;d love to hear from you!
          </p>
        </motion.div>
      </div>
    </div>
  )
}
