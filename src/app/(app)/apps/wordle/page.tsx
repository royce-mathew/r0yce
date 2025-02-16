"use client"

import React, { useEffect, useState } from "react"
import confetti from "canvas-confetti"
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
import { AnimatePresence, motion, useAnimationControls } from "motion/react"
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
import { Separator } from "@/components/ui/separator"
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
    const fetchWord = async () => {
      setCorrectWord(await getWord())
    }

    fetchWord()
  }, [])

  // Focus on the input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Handle Enter key press
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      submit()
    }
  }

  async function submit() {
    if (word.length !== 5) {
      // Shake input otp
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
    const wordExists = await checkWord(word)
    if (wordExists === false) {
      inputAnimationControls.start({ x: [-10, 10, -10, 10, -10, 0] })
      toast.error("Word doesn't exist")
      return
    }

    // If the word is correct, show success toast
    if (word.toLowerCase() === correctWord) {
      toast.success("You have guessed the word")
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
      // Clear attempts and get new word
      setAttempts([...attempts, word])
      setWord("")
      setFinishedGame(true)
    }

    setAttempts([...attempts, word])
    setWord("")
    inputAnimationControls.start({ scale: [0.95, 1] })
    inputRef.current?.focus()
  }

  return (
    <main className="flex min-h-screen flex-col items-center">
      <h1 className="mt-5 w-full py-0 text-center font-cal text-4xl font-bold md:space-x-8 md:text-6xl">
        Wordle
      </h1>

      <Separator className="container my-3 md:my-5" />

      <div className="flex w-fit flex-col items-center justify-center space-y-[5px]">
        <div className="flex flex-col space-y-1 select-none">
          <AnimatePresence>
            {attempts.map((attempt, index) => (
              <div key={index} className="flex">
                {attempt
                  .toLowerCase()
                  .split("")
                  .map((char, slotIndex) => {
                    const isCorrect = correctWord!.includes(char)
                    const isCorrectPosition = correctWord![slotIndex] === char
                    return (
                      <motion.div
                        key={slotIndex}
                        initial={{ rotateX: 90 }}
                        animate={{ rotateX: 0 }}
                        transition={{ duration: 0.5, delay: slotIndex * 0.4 }}
                      >
                        <div
                          className={`mx-[2.5px] size-12 border text-2xl font-bold uppercase first:rounded-l-md last:rounded-r-md md:size-16 ${
                            isCorrectPosition
                              ? "bg-green-500"
                              : isCorrect
                                ? "bg-yellow-500"
                                : "bg-foreground/20"
                          } flex items-center justify-center`}
                        >
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.25 }}
                          >
                            {char}
                          </motion.span>
                        </div>
                      </motion.div>
                    )
                  })}
              </div>
            ))}
          </AnimatePresence>
        </div>
        {!finishedGame && (
          <AnimatePresence>
            {/* Current Slot. It should shake when the input is wrong */}
            <motion.div
              animate={inputAnimationControls}
              transition={{ duration: 0.3 }}
            >
              <InputOTP
                spellCheck="false"
                className="my-2"
                maxLength={5}
                pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                value={word}
                onChange={(word) => setWord(word)}
                onKeyDown={handleKeyDown}
                ref={inputRef}
                inputMode="none"
              >
                <InputOTPGroup>
                  {/* Loop through 5 and create */}
                  {Array.from({ length: 5 }).map((_, index) => (
                    <InputOTPSlot
                      key={index}
                      className="mx-[2.5px] size-12 text-2xl font-bold uppercase md:size-16"
                      index={index}
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </motion.div>
          </AnimatePresence>
        )}
        {/* Show attempts left with Empty divs */}
        <div className="flex flex-col space-y-2">
          {Array.from({ length: totalAttempts - attempts.length }).map(
            (_, index) => (
              <div key={index} className="flex">
                {Array.from({ length: 5 }).map((_, slotIndex) => (
                  <div
                    key={slotIndex}
                    className="mx-[2.5px] size-12 border text-2xl font-bold uppercase first:rounded-l-md last:rounded-r-md md:size-16"
                  />
                ))}
              </div>
            )
          )}
        </div>
        <div className="flex w-full items-center justify-center space-x-1 px-12">
          {/* <Button
            className="w-2/3 rounded font-semibold"
            onClick={submit}
            variant="outline"
          >
            Submit
          </Button> */}
          <Button
            className="w-1/3 flex-initial rounded font-semibold"
            variant="outline"
            onClick={() => {
              setAttempts([])
              setFinishedGame(false)
              setWord("")
              setCorrectWord(null)
              getWord().then((word) => setCorrectWord(word))
              // Show refresh animation
              inputAnimationControls.start({ scale: [0.95, 1] })
              inputRef.current?.focus()
            }}
          >
            New Game
          </Button>
        </div>

        {/* <Keyboard /> */}
        <Keyboard
          layout={{
            default: [
              "q w e r t y u i o p",
              "a s d f g h j k l",
              "z x c v b n m {bksp}",
              "{enter}",
            ],
          }}
          theme={"hg-theme-default hg-theme-dark hg-layout-default"}
          onKeyPress={(button) => {
            if (
              attempts
                .join(" ")
                .split("")
                .filter((char) => !correctWord!.includes(char))
                .includes(button)
            ) {
              // Do nothing if the button is disabled
              return
            }

            if (button === "{enter}") {
              submit()
            } else if (button === "{bksp}") {
              setWord((prevWord) => prevWord.slice(0, -1))
            } else {
              setWord((prevWord) => prevWord + button)
            }
            inputRef.current?.focus()
          }}
          buttonTheme={[
            {
              class: "hg-disabled",
              buttons: attempts
                .join(" ")
                .split("")
                .filter((char) => !correctWord!.includes(char))
                .join(" "),
            },
          ]}
        />
      </div>
    </main>
  )
}

export default WordlePage
