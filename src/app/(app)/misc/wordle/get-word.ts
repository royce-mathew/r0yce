"use server"

let validWords: string[] | null = null
let allWords: string[] | null = null

const allWordsGistUrl =
  "https://gist.githubusercontent.com/royce-mathew/ff9bb6455fbd4f7cff532b2a5b4900c4/raw/possible-words.txt"
const validWordsGistUrl =
  "https://gist.githubusercontent.com/royce-mathew/50f4a64ee7ea9793fa00c903ea4e7dcf/raw/words.txt"

async function loadWords() {
  if (!validWords) {
    const response = await fetch(validWordsGistUrl)
    const wordsFile = await response.text()
    validWords = wordsFile.split("\n").map((word) => word.trim())
  }
}

async function loadAllWords() {
  if (!allWords) {
    const response = await fetch(allWordsGistUrl)
    const wordsFile = await response.text()
    allWords = wordsFile.split("\n").map((word) => word.trim())
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
