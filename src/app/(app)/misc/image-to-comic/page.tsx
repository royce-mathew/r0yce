import type { Metadata } from "next"
import ComicEditor from "./comic-editor"

const url = "https://royce.sh/misc/image-to-comic"
const title = "Image to Comic Converter — Free, Local Photo Filter | royce.sh"
const description =
  "Convert photos to comic-style ink and screentone in your browser. Adjust pens, shadows, and colors, then download a PNG. No image upload or AI generation."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: {
    url,
    type: "website",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
}

const application = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": `${url}#application`,
  name: "Image to comic",
  url,
  description,
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript and HTML Canvas support.",
  isAccessibleForFree: true,
  featureList: [
    "Local photo-to-comic conversion without image uploads",
    "Fine, dip, and mixed pen styles",
    "Adjustable brightness, pen pressure, and screentone",
    "Custom ink and paper colors",
    "Original and comic comparison",
    "PNG export up to 1600 pixels on the longest edge",
  ],
}

const methodology = [
  {
    title: "Prepare the image",
    text: "The browser decodes the image and scales it proportionally to a maximum of 1600 pixels on its longest edge. Smaller images are not enlarged. Transparent areas are composited onto the selected paper color.",
  },
  {
    title: "Find the outlines",
    text: "The renderer converts pixels to luminance and smooths them at several scales. Sobel gradients detect edges, while local contrast selects their darker side. Fine emphasizes narrow details and skips the broad-stroke analysis used by Dip and Mixed. Dip adds broader marks; Mixed combines both.",
  },
  {
    title: "Build ink and screentone",
    text: "Pressure changes edge sensitivity, stroke width, and solid shadow coverage. Optional screentone uses a dot grid rotated by 45 degrees, with larger dots in darker areas. Dot size changes the grid spacing.",
  },
  {
    title: "Render and export",
    text: "The renderer blends the selected ink and paper colors according to the line, shadow, and dot coverage. The result is an opaque image exported as a PNG at the preview’s pixel dimensions.",
  },
]

const questions = [
  {
    question: "Does this use generative AI?",
    answer:
      "No. This is a deterministic photo filter, not an AI image generator. The same decoded image pixels and settings produce the same result. It transforms existing edges and tones rather than inventing objects, redrawing faces, or creating comic panels.",
  },
  {
    question: "Are my images uploaded?",
    answer:
      "No. Selected files are read and processed locally with your browser’s Canvas API. The converter does not send your image to a server. You do not need an account to use it.",
  },
  {
    question: "Which image formats can I use?",
    answer:
      "Use a format your browser can decode, such as JPEG, PNG, or WebP. Support for other formats depends on the browser. The output is a single PNG image, not an animated file, SVG, or layered editing document.",
  },
]

export default function ImageToComicPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(application).replace(/</g, "\\u003c"),
        }}
      />
      <ComicEditor />
      <article
        aria-label="Image to comic guide"
        className="mx-auto max-w-4xl space-y-12 px-5 py-12 text-sm leading-7 text-foreground sm:px-9 sm:py-16"
      >
        <section aria-labelledby="about-converter">
          <h2
            id="about-converter"
            className="text-2xl font-semibold tracking-tight"
          >
            A photo-to-comic filter, processed locally
          </h2>
          <p className="mt-4 text-muted-foreground">
            Image to comic is a free browser-based converter that turns photos
            into comic-style ink lines, solid shadows, and manga-style
            screentone. Adjust the result above, compare it with the original,
            and download a PNG. Your selected image stays in your browser.
          </p>
        </section>

        <section aria-labelledby="how-to-convert">
          <h2
            id="how-to-convert"
            className="text-xl font-semibold tracking-tight"
          >
            How to turn a photo into a comic
          </h2>
          <ol className="mt-4 list-decimal space-y-3 pl-5 text-muted-foreground">
            <li>
              Choose <strong className="text-foreground">Open image</strong> to
              select a photo, or try the bundled Ameyoko street sample.
            </li>
            <li>
              Select a pen style. Adjust brightness and pressure, then turn
              screentone on or off. Expand Ink &amp; paper to change the colors.
            </li>
            <li>
              Switch to Compare to inspect the original and result side by side,
              then choose Download PNG. Reset restores the default settings
              without replacing your image.
            </li>
          </ol>
        </section>

        <section aria-labelledby="methodology">
          <h2 id="methodology" className="text-xl font-semibold tracking-tight">
            Methodology
          </h2>
          <ol className="mt-5 list-decimal space-y-5 pl-5">
            {methodology.map((step) => (
              <li key={step.title} className="pl-1">
                <h3 className="font-medium">{step.title}</h3>
                <p className="mt-1 text-muted-foreground">{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="better-results">
          <h2
            id="better-results"
            className="text-xl font-semibold tracking-tight"
          >
            Getting a cleaner result
          </h2>
          <p className="mt-4 text-muted-foreground">
            Start with a sharp photo with a clear subject. If shadows merge into
            solid black areas, increase brightness or reduce pressure. If fine
            textures make the image too busy, try Dip and turn off screentone.
            Fine retains more small edges; Mixed balances fine and broad marks.
          </p>
          <p className="mt-3 text-muted-foreground">
            This filter cannot recover missing detail from a blurred or
            low-resolution source. It does not remove backgrounds or recognize
            subjects, so textured backgrounds can become ink too. Export is
            limited to 1600 pixels on the longest edge, preserves the image’s
            proportions, and flattens transparency onto the paper color.
          </p>
        </section>

        <section aria-labelledby="common-questions">
          <h2
            id="common-questions"
            className="text-xl font-semibold tracking-tight"
          >
            Common questions
          </h2>
          <dl className="mt-5 space-y-5">
            {questions.map(({ question, answer }) => (
              <div key={question}>
                <dt className="font-medium">{question}</dt>
                <dd className="mt-1 text-muted-foreground">{answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      </article>
    </>
  )
}
