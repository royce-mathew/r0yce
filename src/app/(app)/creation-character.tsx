import { useId } from "react"

function PortraitHead({ hatch }: { hatch: string }) {
  return (
    <g stroke="#11110f" strokeLinecap="round" strokeLinejoin="round">
      <path d="m42 96-4 28 20 18 25-17-4-32" fill="#f3efe3" strokeWidth="3" />
      <path d="m44 103 24 11 11-7-4 15-17 11-16-14Z" fill="#11110f" />
      <path d="m45 114 9 9m-7-13 10 10m18-4-10 9" strokeWidth=".8" />
      <path d="M33 41Q35 16 64 15q29-1 34 22l-3 24 12 18-12 5-1 17-14 16-18 1-21-17-12-28Z" fill="#f3efe3" strokeWidth="3.1" />
      <path d="m76 34 15 12-1 14 9 15-10-3-7-19-11-8-20 6-8 19-7-14 9-24Z" fill="#11110f" />
      <path d="m72 40 12 10 3 18-7 13-15 4-12-7-4-19Z" fill={`url(#${hatch})`} stroke="none" />
      <path d="m51 49 17-5 14 7m-26 9 12-4 10 2m8-1 7 2m-4 10 3 9 7 1m-32 14 13-3 9 3-9 3Z" fill="none" strokeWidth="1.6" />
      <path d="m59 61 7-1m3-1 4 1m13 0 5 1" strokeWidth="2.2" />
      <path d="m58 64 8 1 6-2m13 1 6 1m-34 10 10 5 10-4m-28-5 5 13" fill="none" strokeWidth=".85" />
      <path d="M43 55 72 52l9 4 14 1-1 16-13 1-8-16-26 3-2 16-10-3Z" fill="none" strokeWidth="2.2" />
      <path d="m74 59 7-1m-38 3-12-2" strokeWidth="1.8" />
      <path d="m52 59 7 14m-2-15 6 13m22-11 4 9" stroke="#f3efe3" strokeWidth="1.4" />
      <path d="m37 76 7 9 10 2 9 10 16 4 12-6-2 11-10 12-16 1-21-16-9-19Z" fill="#11110f" strokeWidth="1.7" />
      <path d="m60 91 12-4 13 4-9 2m-26 0 7 9m-3-11 9 12m-4-10 9 14m-4-12 9 15m-4-12 8 11m-3-12 8 8m-3-10 7 5" stroke="#f3efe3" strokeWidth=".65" />
      <path d="M37 65q-12-10-15 2-1 15 14 20l6-11" fill="#f3efe3" strokeWidth="2.3" />
      <path d="m33 79-6-10q9-5 10 6l-5-1m-4 4 5 3" fill="none" strokeWidth="1.1" />
      <path d="m35 48-6 17 10 4 5-21Z" fill="#11110f" />
      <path d="M25 58q-9-8-9-19-5-7 0-14-2-8 6-13 1-9 11-10 4-8 14-6 8-7 17-3 10-5 18 0 11-3 17 5 11 1 12 11 8 7 3 16 1 9-8 14l-11 1-8-7-12 7-12-4-10 9-9-2-5 16Z" fill="#11110f" strokeWidth="3.1" />
      <path d="M25 25q-5-8 3-11 8-3 11 5-1 6-8 6m6-18q3-8 11-5 7 5 2 12m1-14q7-7 15-1 6 7-2 11m7-12q9-4 15 3 3 8-5 11m9-10q10-1 13 8 1 6-6 8M21 34q3-9 12-6 5 6-3 10m10-16q7-7 14-1 4 7-5 11m11-18q9-6 14 2 1 8-8 9m13-10q8-4 13 3 1 8-7 10m12-6q10-2 10 5-1 7-8 8M28 43q4-9 11-4m4-5q8-5 12 1-1 7-9 7m14-12q8-4 12 3-1 7-9 6m14-11q8-5 11 3-1 6-7 7" fill="none" stroke="#f3efe3" strokeOpacity=".65" strokeWidth=".8" />
      <path d="m45 81 3 7m0-8 4 6m-8-14 5 7m-6-13 5 6m10-30 9-4m-5-1 7-2" strokeWidth=".65" />
    </g>
  )
}

export function JourneyCharacter() {
  const id = useId().replace(/:/g, "")
  const hatch = `${id}-hatch`
  const cross = `${id}-cross`
  return (
    <svg className="creation-walker" viewBox="0 0 240 640" fill="none" aria-hidden="true" focusable="false">
      <defs>
        <pattern id={hatch} width="3.5" height="3.5" patternUnits="userSpaceOnUse" patternTransform="rotate(24)"><path d="M0 0V3.5" stroke="#11110f" strokeWidth=".65" /></pattern>
        <pattern id={cross} width="5" height="5" patternUnits="userSpaceOnUse"><path d="m-1 1 7 4m-7 0 7-4" stroke="#11110f" strokeWidth=".45" /></pattern>
      </defs>
      <ellipse cx="122" cy="617" rx="72" ry="5" fill="#11110f" opacity=".17" />
      <g className="creation-walker-body" stroke="#11110f" strokeWidth="2.8" strokeLinejoin="round" strokeLinecap="round">
        <g data-walk="arm-back">
          <path d="M164 158q24-6 34 19 9 28 8 59l-2 40-28 7-12-47-15-45Z" fill="#11110f" />
          <path d="m180 172 12 16 7 34-3 31m-19-61 8 36-3 22m5 8 16-4" stroke="#f3efe3" strokeWidth=".9" />
          <path d="m177 272 27-5 4 40 9 24-1 14-9 10-8-3-7-15-3-28Z" fill="#f3efe3" />
          <path d="m183 284 6 15 2 24m8-37 2 21 7 21-1 14m-6-10 1 13m-7-14 3 14m-3-23-2 10" strokeWidth="1" />
          <path d="m178 283 8 9 4 31 6 8-4 6-7-24Z" fill={`url(#${hatch})`} stroke="none" />
        </g>
        <g data-walk="leg-back">
          <path d="m118 310 48-5q14 35 9 75l-12 74-38-1-5-73-9-38Z" fill="#11110f" />
          <path d="m151 332 11 31-10 59m-21-55 10 42 1 30m5 0 16 3m-24-103 13 16" stroke="#f3efe3" strokeWidth="1.1" />
          <g data-walk="shin-back">
            <path d="m125 447 39 1-2 29-12 81 3 26-33 3-3-39 6-62Z" fill="#11110f" />
            <path d="m140 463-7 63 1 32m14-67-7 54m-17 26 26-2m-25 8 25-2" stroke="#f3efe3" strokeWidth=".9" />
            <path d="m120 576 34 1 1 17 22 7 20 4q9 9 0 13h-75l-9-9Z" fill="#11110f" />
            <path d="m120 612 74 1m-66-27 18 1m-18 5 18 1m5 7 18 6m-34-5 2 10" stroke="#f3efe3" strokeWidth="1" />
            <path d="m126 579 24 1-2 14-17-3Z" fill="#f0ce53" strokeWidth="1.3" />
          </g>
        </g>
        <g data-walk="leg-front">
          <path d="m75 306 51 7 5 57-12 85-41 2-10-65q-5-43 7-86Z" fill="#f3efe3" />
          <path d="m80 323 20 17 13-10m-36 17 10 22-7 31m26-49 9 23-12 39 5 24m-22-29 7 19-5 13m-7 3 31-2" strokeWidth="1.2" />
          <path d="m70 346 12 19-4 30 12 36-10 14-9-41Zm38 23 11-21 5 26-11 44-4-15Z" fill={`url(#${hatch})`} stroke="none" />
          <path d="m87 340 6 9m-9-5 6 9m-9-5 5 9m28 61-6 8m8-4-7 9m6-2-7 8" strokeWidth=".65" />
          <g data-walk="shin-front">
            <path d="m78 447 42 2 2 25-13 80 4 33-36 2-10-43 5-55Z" fill="#f3efe3" />
            <path d="m83 461 15 6 12-6m-18 16-7 49 5 29m15-67-9 52m-22-9 5 22m2 16 27-2m-28 9 28-2" strokeWidth="1.1" />
            <path d="m73 473 12-5-5 54 10 31-7 19-10-24-3-21Z" fill={`url(#${cross})`} stroke="none" />
            <path d="m77 576 37 1 1 17 27 11 12 2q7 8-2 12H80l-10-11Z" fill="#11110f" />
            <path d="m78 612 70 1m-65-27 24 1m-24 5 24 1m-18 7 18 1m8 1 15 7" stroke="#f3efe3" strokeWidth="1" />
            <path d="m82 579 26 1-1 13-24-2Z" fill="#f0ce53" strokeWidth="1.3" />
          </g>
        </g>
        <path d="m78 139 28-13 30 2 32 19 12 45-16 58 2 64-34 19-58-14 2-65-15-64Z" fill="#f3efe3" strokeWidth="3.3" />
        <path d="m104 148 21-7 20 17-5 39-19 15-22-15Z" fill={`url(#${hatch})`} stroke="none" />
        <path d="m101 152 14 12 10-4 16 9m-42 12 18 12 22-7m-19 12 1 16m-19 9 17-4 18 5m-35 11 17 4 18-1m-34 10 15 5 18-4m-32 17 15 4 17-6m-15-37-1 42m-23 15 22 8 21-10" strokeWidth="1.25" />
        <path d="m102 204 11 6-7 12-8-3Zm22 11 13-10 2 15-12 7m-23 23 10 6-4 10-9-7m24-3 10-5-1 14-10 7" fill="#11110f" stroke="none" />
        <path d="m78 141 26-11-9 28 13 19-18 25 5 50-4 69-22-5 4-65-14-54 5-37Z" fill="#11110f" />
        <path d="m132 128 26 13 22 28-3 39-18 38 7 69-22 14-7-53 8-63-13-31 11-18Z" fill="#11110f" />
        <path d="m74 157 13-8-9 29 7 18-11 26m8-14 5 42-3 48m-9-24 8 7m65-130 12 14-10 22 12 13-14 27m13-19-8 33m-4 17 5 40m-4-25 10 7m-8-53 10-2m-91-3 11 3" stroke="#f3efe3" strokeWidth="1" />
        <path d="m83 138 18-14 8 8-15 23-6 17-10-8Zm44-11 11-6 20 18-13 28-8-24Z" fill="#11110f" strokeWidth="2" />
        <path d="m86 140 12-10m-14 15 10-7m-13 13 10-7m52-12 8 7m-9-2 8 7" stroke="#f3efe3" strokeWidth=".8" />
        <path d="m81 307 25 6 34-4 16-6 1 15-18 11-32-4-27-7Z" fill="#11110f" />
        <path d="m112 311 19 1-1 16-19-2Z" fill="#f0ce53" strokeWidth="1.7" /><path d="m116 316 10 1-1 6-9-1Z" fill="#11110f" stroke="none" />
        <g data-walk="head"><g transform="translate(74 35) scale(.72)"><PortraitHead hatch={hatch} /></g></g>
        <g data-walk="arm-front">
          <path d="M73 153q-22 2-29 23l-7 41 9 34 28 1 10-34 8-30q-1-23-19-35Z" fill="#11110f" strokeWidth="3.2" />
          <path d="m66 166-14 16-7 30 7 24m13-47-7 18 3 22m14-45 6 18-12 29m-17 5 20 3" stroke="#f3efe3" strokeWidth="1.15" />
          <path d="m46 243 29 3 5 29-29 8-9-18Z" fill="#11110f" />
          <path d="m48 250 26 5m-24 0 23 5m-20 10 23-3" stroke="#f3efe3" strokeWidth="1" />
          <path d="m54 256 17 3-1 9-15-3Z" fill="#f0ce53" strokeWidth="1.2" />
          <g data-walk="forearm-front">
            <path d="m50 278 29-7 4 18-8 27-3 24 5 12-3 20-8 7-16-5-4-15 4-20-5-23Z" fill="#f3efe3" strokeWidth="2.7" />
            <path d="m58 284-5 24 6 25 5-21 10-25m-16 45-3 11m11-14 4-11m-16 27 6 6 1 17m5-22 4 6-2 18m-15-16 2 15m-6-16 2 12m19-21 3 10-3 7" fill="none" strokeWidth="1.1" />
            <path d="m47 292 9-9-6 25 10 24-7 11-4-25Z" fill={`url(#${hatch})`} stroke="none" />
            <path d="m61 299 6-8m-7 13 6-8m-5 13 5-7m-14 44 4 3m-4 1 4 3m7-10 4 2" strokeWidth=".65" />
          </g>
        </g>
        <path d="m146 151 9 6-5 13-9-6Z" fill="#f0ce53" strokeWidth="1.2" /><path d="m146 156 4 3-2 5" strokeWidth=".9" />
      </g>
    </svg>
  )
}
