"use server"

import fs from "fs/promises"
import path from "path"

let validWords: string[] | null = null
let allWords: string[] | null = null

async function loadWords() {
  if (!validWords) {
    const wordsFile = await fs.readFile(
      path.join(process.cwd(), "public/files/words.txt"),
      "utf8"
    )
    validWords = wordsFile.split("\n").map((word) => word.trim())
  }
}

async function loadAllWords() {
  if (!allWords) {
    const allWordsFile = await fs.readFile(
      path.join(process.cwd(), "public/files/possible-words.txt"),
      "utf8"
    )
    allWords = allWordsFile.split("\n").map((word) => word.trim())
  }
}

// Get a random word
export async function getWord() {
  await loadWords()
  const randomWord = validWords![Math.floor(Math.random() * validWords!.length)]
  return randomWord
}

// Check if the word is valid
export async function checkWord(word: string) {
  await loadAllWords()
  return allWords!.includes(word.toString().toLowerCase())
}
