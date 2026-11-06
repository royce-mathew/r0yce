import { useId } from "react"

function PortraitHead({ tone }: { tone: string }) {
  return <g stroke="#11110f" strokeLinecap="round" strokeLinejoin="round">
    <path d="M29 77 27 101 53 115 70 100 65 74" fill="#f3efe3" strokeWidth="2.4" />
    <path d="m31 80 29 9 3 9-10 8-23-16Z" fill="#11110f" />
    <path d="M24 31Q32 9 61 15q25 5 25 28l-1 10 13 17q2 4-9 6l-2 13q-5 12-19 14L46 91 33 72 21 61Z" fill="#f3efe3" strokeWidth="2.2" />
    <path d="m58 47 21-4 6 7m-14 8 7-1m5 10 5 2m-5 11 7-1" fill="none" strokeWidth="1.4" />
    <path d="M41 53 63 51l18 1 3 15-19 3-5-15-22 3m25-3 3-3m15 3 5 1" fill="none" strokeWidth="2" />
    <path d="m67 55 6 10" stroke="#f3efe3" strokeWidth="2.5" />
    <path d="M37 65q3 17 16 19l12-3 12-4 10 5-3 12-15 10q-18-1-30-19l-7-19Z" fill="#11110f" strokeWidth="1.5" />
    <path d="m65 85 10-1 7 2m-32-6 5 7m0-3 5 7m0-4 4 7m1-5 3 7m4-8 2 5m3-8 2 4" stroke="#f3efe3" strokeWidth=".65" />
    <path d="M38 59q-14-10-16 1-1 13 12 16l6-7" fill="#f3efe3" strokeWidth="2" />
    <path d="m34 69-7-8q7-3 9 4m-7 2 3 4" fill="none" strokeWidth="1.2" />
    <path d="M19 56q-8-11-5-24-5-8 3-14-1-9 10-10 3-9 13-6 8-8 17-3 12-6 17 3 12-1 15 8 10 5 5 14 3 8-6 15-4 7-14 6l-11-8-12 8-11-1-4 17-6 3-1-9Z" fill="#11110f" strokeWidth="3" />
    <path d="M18 26q-4-9 4-10 8 0 4 7m1-13q3-7 10-3 5 4-1 8m3-10q8-4 10 3 0 6-6 7m9-14q9-1 9 6-2 7-8 5m12-7q7-4 12 3 1 6-5 7m7-1q8-3 10 5-1 5-7 5M21 31q3-8 10-4 4 5-3 8m10-16q8-5 12 2-1 6-7 6m12-10q8-3 10 5-2 6-8 4m12-8q7-3 10 4-2 8-8 5M24 41q4-7 11-2m0-8q8-5 12 1-1 5-6 6m9-7q6-6 11-1-1 8-7 8m13-8q7-5 11 1-1 6-6 7m8-11q8-2 7 5" fill="none" stroke="#f3efe3" strokeOpacity=".48" strokeWidth=".9" />
    <path d="m43 59 5 9m-3-15 6 13m1-14 5 11m-9 9 4 5m-9-6 3 5m-5-27 6-6m-8 3 5-6" strokeWidth=".65" opacity=".65" />
    <path d="m51 72 14-3 7 7-18 4Z" fill={`url(#${tone})`} stroke="none" />
  </g>
}

export function MangaPortraitDetail() {
  const tone = useId().replace(/:/g, "")
  return <svg className="creation-portrait-detail" viewBox="0 0 240 230" fill="none" aria-hidden="true" focusable="false">
    <defs><pattern id={tone} width="3" height="3" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".55" fill="#11110f" /></pattern></defs>
    <path d="M-10 238 8 170q24-29 72-38l58 5q41 14 69 64l25 37Z" fill="#11110f" />
    <path d="m4 191 63-30m-47 46 51-25m90-22 35 41m-52-27 35 44" stroke="#f3efe3" strokeWidth=".7" opacity=".5" />
    <g transform="translate(37 8) scale(1.65)"><PortraitHead tone={tone} /></g>
    <path d="m10 17 29 10M5 60l21 3m176-39-15 21m37 24-27 10m20 39-22 1" stroke="#11110f" strokeWidth=".8" />
  </svg>
}

export function JourneyCharacter() {
  const tone = useId().replace(/:/g, "")
  return <svg className="creation-walker" viewBox="0 0 240 640" fill="none" aria-hidden="true" focusable="false">
    <defs><pattern id={tone} width="4" height="4" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".65" fill="#11110f" /></pattern></defs>
    <ellipse cx="125" cy="616" rx="65" ry="5" fill="#11110f" opacity=".14" />
    <g className="creation-walker-body" stroke="#11110f" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
      <g data-walk="arm-back"><path d="M142 159q25-3 34 31l8 95-20 4-21-83Z" fill="#11110f" /><path d="m168 281 16-2 1 49 7 14-2 20-8 5-7-8 1-16-8-18Z" fill="#f3efe3" /><path d="m180 344 4 14m1-16 3 12" strokeWidth="1" /></g>
      <g data-walk="leg-back"><path d="m119 316 39-1 7 139-28 3-21-86Z" fill="#11110f" /><path d="m145 338 6 79-7 27" stroke="#f3efe3" strokeWidth="1" /><g data-walk="shin-back"><path d="m137 449 29 1-7 137-25 1Z" fill="#11110f" /><path d="m145 469 3 86m-9 22 17-2" stroke="#f3efe3" strokeWidth="1" /><path d="m134 580 26 2 4 13 33 10q7 8-1 11h-66l-2-15Z" fill="#f3efe3" /><path d="m132 610 64 1m-34-17 10 3m-13 1 11 3" strokeWidth="1" /></g></g>
      <g data-walk="leg-front"><path d="m78 313 49 5-10 138-31 1-13-87Z" fill="#f3efe3" /><path d="m86 335-4 49 12 48m18-87-10 74m-14 25 22 1" strokeWidth="1.2" /><path d="m80 335 14 5-8 60Z" fill={`url(#${tone})`} stroke="none" /><g data-walk="shin-front"><path d="m86 449 32 3-6 135-26 2-6-66Z" fill="#f3efe3" /><path d="m93 469-5 70m17-56-5 77m-13 16 22 2" strokeWidth="1" /><path d="m86 581 27 2 2 14 31 10q6 9-3 12H81l-4-13Z" fill="#f3efe3" /><path d="m81 612 63 1m-32-15 11 4m-14 1 12 3" strokeWidth="1.2" /><path d="m81 589 9 1-6 17h-6Z" fill="#11110f" /></g></g>
      <path d="m86 146 25-13 30 10 23 36-9 151q-40 10-80-4l4-120Z" fill="#f3efe3" strokeWidth="2.6" />
      <path d="m105 151 22-2 7 167-34 6Z" fill={`url(#${tone})`} stroke="none" />
      <path d="m85 150 23-12-8 30 12 19-17 28-5 108-18-2 7-120Zm47-9 16 12 15 39-16 6 9 19-12 110-15 3 8-125-15-42Z" fill="#11110f" />
      <path d="m86 169-5 50-1 66m7-48 10-4m42 3 13 1m-71 53 10 2m42-5 14-1m-13-89 9 13-9 76" stroke="#f3efe3" strokeWidth=".85" />
      <path d="m106 135 8 14 13-5 7-13" fill="#f3efe3" />
      <g data-walk="head" transform="translate(76 49) scale(.78)"><PortraitHead tone={tone} /></g>
      <g data-walk="arm-front"><path d="M84 155q-15 1-21 29l-9 97 25 4 16-92" fill="#11110f" strokeWidth="2.7" /><path d="m72 179-7 69m-8 23 19 4m-15-15 12 3" stroke="#f3efe3" strokeWidth="1" /><g data-walk="forearm-front"><path d="m56 278 22 4-7 51 2 13-6 22-9 5-9-11 2-23Z" fill="#f3efe3" /><path d="m57 341 7 3-1 16m-8-12-1 12m5-9-1 14m8-18 3 9" strokeWidth="1.1" /><path d="m56 295-2 25m7-20-2 22" strokeWidth=".7" /></g></g>
      <path d="m143 169 5 1-1 12-5-1Z" fill="#f0ce53" strokeWidth=".8" />
    </g>
  </svg>
}
