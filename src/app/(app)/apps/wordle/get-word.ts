"use server"

import fs from "fs/promises"

const words_file = await fs.readFile("./words.txt", "utf8")
const valid_words = words_file.split("\n").map((word) => word.trim())

const all_words_file = await fs.readFile("./possible_words.txt", "utf8")
const all_words = all_words_file.split("\n").map((word) => word.trim())

// Get a random word
export async function getWord() {
  const randomWord = valid_words[Math.floor(Math.random() * valid_words.length)]
  return randomWord
}

// Check if the word is valid
export async function checkWord(word: string) {
  console.log(word)
  console.log(all_words.find((word) => word === "carts"))
  return all_words.includes(word.toString().toLowerCase())
}
