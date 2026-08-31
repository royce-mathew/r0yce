"use client"

import React, { useEffect, useState } from "react"
import confetti from "canvas-confetti"
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
import { motion, useAnimationControls } from "motion/react"
import Keyboard from "react-simple-keyboard"
import { toast } from "sonner"
import "react-simple-keyboard/build/css/index.css"
import "@/styles/simple-keyboard.css"
import { Button } from "@/components/ui/button"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { checkWord, getWord } from "./get-word"

const WordlePage: React.FC = () => {
  const totalAttempts = 6
  const [correctWord, setCorrectWord] = useState<string | null>(null)
  const [finishedGame, setFinishedGame] = useState<boolean>(false)
  const [word, setWord] = useState<string>("")
  const [attempts, setAttempts] = useState<string[]>([])
  const inputRef = React.useRef<HTMLInputElement>(null)
  const inputAnimationControls = useAnimationControls()

  // Fetch the word on mount
  useEffect(() => {
    async function fetchWord() {
      setCorrectWord(await getWord())
    }

    fetchWord()
  }, [])

  // Focus on the input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const unavailableLetters = React.useMemo(
    () =>
      correctWord
        ? attempts
            .join("")
            .split("")
            .filter((char) => !correctWord.includes(char))
        : [],
    [attempts, correctWord]
  )

  const submit = React.useCallback(async () => {
    if (!correctWord) {
      return
    }

    // Shake input otp
    if (word.length !== 5) {
      inputAnimationControls.start({ x: [-10, 10, -10, 10, -10, 0] })
      toast.error("Word must be 5 characters long")
      return
    }

    if (attempts.includes(word)) {
      inputAnimationControls.start({ x: [-10, 10, -10, 10, -10, 0] })
      toast.error("You have already tried this word")
      return
    }

    // Check if the word exists
    if (!(await checkWord(word))) {
      inputAnimationControls.start({ x: [-10, 10, -10, 10, -10, 0] })
      toast.error("Word doesn't exist")
      return
    }

    const nextAttempts = [...attempts, word]
    setAttempts(nextAttempts)
    setWord("")

    // If the word is correct, show success toast
    if (word.toLowerCase() === correctWord) {
      toast.success("You have guessed the word")
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
      setFinishedGame(true)
      return
    }

    if (nextAttempts.length === totalAttempts) {
      toast.error(`Out of guesses. The word was ${correctWord.toUpperCase()}.`)
      setFinishedGame(true)
      return
    }

    inputAnimationControls.start({ scale: [0.95, 1] })
    inputRef.current?.focus()
  }, [attempts, correctWord, inputAnimationControls, word])

  // Handle physical keyboard input
  useEffect(() => {
    function handlePeripheralKeyboard(event: KeyboardEvent) {
      const target = event.target
      if (
        finishedGame ||
        event.defaultPrevented ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        (target instanceof HTMLInputElement && target !== inputRef.current) ||
        target instanceof HTMLTextAreaElement ||
        (target instanceof HTMLElement && target.isContentEditable)
      ) {
        return
      }

      const key = event.key.toLowerCase()
      if (key === "enter") {
        event.preventDefault()
        void submit()
        return
      }

      if (key === "backspace") {
        event.preventDefault()
        setWord((currentWord) => currentWord.slice(0, -1))
        return
      }

      if (/^[a-z]$/.test(key) && !unavailableLetters.includes(key)) {
        event.preventDefault()
        setWord((currentWord) =>
          currentWord.length < 5 ? currentWord + key : currentWord
        )
      }
    }

    window.addEventListener("keydown", handlePeripheralKeyboard)
    return () => window.removeEventListener("keydown", handlePeripheralKeyboard)
  }, [finishedGame, submit, unavailableLetters])

  // Clear attempts and get a new word
  function startNewGame() {
    setAttempts([])
    setFinishedGame(false)
    setWord("")
    setCorrectWord(null)
    getWord().then((nextWord) => setCorrectWord(nextWord))
    inputAnimationControls.start({ scale: [0.95, 1] })
    inputRef.current?.focus()
  }

  return (
    <main className="fixed inset-x-0 top-16 bottom-0 z-40 flex flex-col overflow-hidden bg-background md:top-20">
      <header className="shrink-0 border-b border-border/60 bg-background/95 px-4 py-3 backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Wordle
            </h1>
          </div>
          <Button
            className="rounded-full px-4"
            onClick={startNewGame}
            size="sm"
            variant="outline"
          >
            New game
          </Button>
        </div>
      </header>

      <div className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <section
          aria-label="Wordle board"
          className="flex min-h-0 flex-1 items-center justify-center"
        >
          <div className="grid grid-rows-6 gap-px overflow-hidden rounded-xl border border-border bg-border shadow-sm">
            {/* Show attempts left with empty tiles */}
            {Array.from({ length: totalAttempts }).map((_, rowIndex) => {
              const submittedAttempt = attempts[rowIndex]
              const isActiveRow = !finishedGame && rowIndex === attempts.length
              const rowValue = submittedAttempt ?? (isActiveRow ? word : "")

              // Current Slot. It should shake when the input is wrong
              return (
                <motion.div
                  animate={isActiveRow ? inputAnimationControls : undefined}
                  className="grid grid-cols-5 gap-px"
                  key={rowIndex}
                >
                  {/* Loop through 5 and create */}
                  {Array.from({ length: 5 }).map((_, slotIndex) => {
                    const char = rowValue.toLowerCase()[slotIndex] ?? ""
                    const isExact =
                      submittedAttempt && correctWord?.[slotIndex] === char
                    const isPresent =
                      submittedAttempt && correctWord?.includes(char)
                    const resultClass = isExact
                      ? "bg-green-500 text-white"
                      : isPresent
                        ? "bg-yellow-500 text-white"
                        : "bg-foreground/20 text-foreground"

                    return (
                      <div
                        className="relative size-12 bg-background text-xl font-bold uppercase sm:size-14 sm:text-2xl md:size-16"
                        key={slotIndex}
                      >
                        {submittedAttempt ? (
                          <motion.div
                            animate={{ rotateX: 180 }}
                            className="absolute inset-0"
                            initial={{ rotateX: 0 }}
                            style={{ transformStyle: "preserve-3d" }}
                            transition={{
                              duration: 0.5,
                              delay: slotIndex * 0.4,
                            }}
                          >
                            <span
                              className="absolute inset-0 grid place-items-center bg-background"
                              style={{ backfaceVisibility: "hidden" }}
                            >
                              {char}
                            </span>
                            <span
                              className={`absolute inset-0 grid place-items-center ${resultClass}`}
                              style={{
                                backfaceVisibility: "hidden",
                                transform: "rotateX(180deg)",
                              }}
                            >
                              {char}
                            </span>
                          </motion.div>
                        ) : (
                          <span className="grid size-full place-items-center bg-background">
                            {char}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </motion.div>
              )
            })}
          </div>
        </section>

        {!finishedGame && (
          <div className="sr-only">
            <InputOTP
              aria-label="Current Wordle guess"
              inputMode="none"
              maxLength={5}
              onChange={setWord}
              pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
              ref={inputRef}
              spellCheck="false"
              value={word}
            >
              <InputOTPGroup>
                {Array.from({ length: 5 }).map((_, index) => (
                  <InputOTPSlot index={index} key={index} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
        )}

        <div className="w-full max-w-[720px] shrink-0">
          <Keyboard
            buttonTheme={[
              {
                class: "hg-disabled",
                buttons: unavailableLetters.join(" "),
              },
            ]}
            layout={{
              default: [
                "q w e r t y u i o p",
                "a s d f g h j k l",
                "z x c v b n m {bksp}",
                "{enter}",
              ],
            }}
            onKeyPress={(button) => {
              if (unavailableLetters.includes(button)) {
                return
              }

              if (button === "{enter}") {
                submit()
              } else if (button === "{bksp}") {
                setWord((previousWord) => previousWord.slice(0, -1))
              } else if (word.length < 5) {
                setWord((previousWord) => previousWord + button)
              }

              inputRef.current?.focus()
            }}
            theme="hg-theme-default hg-theme-dark hg-layout-default"
          />
        </div>
      </div>
    </main>
  )
}

export default WordlePage
