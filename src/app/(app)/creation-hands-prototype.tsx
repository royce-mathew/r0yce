"use client"

import { useId } from "react"

export function CreationHandsPrototype() {
  const id = useId()
  const adam = "M-550 258 70 165C120 105 145 46 218 51 280 45 314 74 363 88 410 104 452 102 485 138L492 176 474 198 490 243C506 271 511 291 488 298 472 303 461 283 451 269L427 235 416 233 444 291C456 322 432 341 416 324L371 262 362 255 375 306C382 339 359 354 343 337L305 275 288 260C268 262 239 252 221 238 210 220 217 203 205 194 196 188 181 203 164 220L60 342-550 395Z"
  const creator = "M1750 44 1111 100C1090 104 1070 110 1060 116 1000 127 967 151 940 156 907 166 874 150 840 148 810 148 786 162 766 189L785 227 824 232 768 272C746 286 739 305 752 315 765 326 786 316 802 313L786 361C779 389 801 408 821 386L858 328 870 324 861 365C856 394 881 409 896 385L923 324 937 317 936 351C935 374 958 384 973 363L994 300C1024 283 1044 260 1066 240 1083 237 1094 239 1108 237L1750 223Z"
  return (
    <svg className="me-creation-art" viewBox="-500 -15 2200 440" preserveAspectRatio="xMidYMid slice" fill="none" aria-hidden="true" focusable="false">
      <defs>
        <pattern id={`${id}-tone`} width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".85" fill="currentColor" /></pattern>
        <pattern id={`${id}-hatch`} width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(28)"><path d="M0 0V9" stroke="currentColor" strokeWidth="1.2" /></pattern>
        <clipPath id={`${id}-adam`}><path d={adam} /></clipPath>
        <clipPath id={`${id}-creator`}><path d={creator} /></clipPath>
      </defs>
      <g className="me-creation-speed" stroke="currentColor" strokeWidth="1" opacity=".22">
        <path d="M0 20 380 110M10 0 280 72M0 390 238 292M110 410 289 312M1200 0 958 103M1200 350 1020 266M1200 395 971 301" />
      </g>
      <g className="me-creation-adam" stroke="currentColor" strokeLinejoin="round" strokeLinecap="round">
        <path className="me-creation-skin" d={adam} strokeWidth="3.5" />
        <g clipPath={`url(#${id}-adam)`}>
          <path d="M-20 340C87 256 130 169 191 137 226 120 248 137 279 161 306 179 321 213 354 236L394 352 269 376Z" fill={`url(#${id}-tone)`} stroke="none" opacity=".6" />
          <path d="M-20 377C85 305 145 223 193 189 218 178 239 189 256 222 268 245 284 247 303 245L341 336 308 360 268 278C231 262 211 248 206 225 195 213 180 234 155 259L16 420Z" fill={`url(#${id}-hatch)`} stroke="none" />
          <path d="M-10 364C80 296 134 208 188 180 213 166 236 190 250 213 269 239 281 238 296 240L324 272C288 260 269 259 250 247 223 228 220 205 203 204 178 218 143 260 111 293Z" fill="currentColor" stroke="none" />
          <path d="M284 119C323 121 338 146 363 166L411 218 440 281M346 101C375 117 389 134 407 153L462 218M245 91C279 99 288 111 301 124M229 157C241 170 246 183 250 198M326 228 350 269M384 202 406 244M448 174 465 200" strokeWidth="2.2" />
          <path d="m343 298 13 28m-9-34 14 26m35-47 22 36m-14-47 22 34m34-39 16 25m-9-32 15 21" strokeWidth="1.1" />
          <path d="M347 325q10-8 18-5M421 314q8-8 16-8M477 284q9-7 17-6" strokeWidth="1.5" />
        </g>
        <g className="me-creation-adam-index">
          <path className="me-creation-skin" d="M460 125C486 134 507 153 526 174L578 220C588 229 585 241 575 244 563 247 554 235 545 229L502 197 476 192" strokeWidth="3.3" />
          <path d="M479 144C506 163 526 193 550 210M499 177l-8 10m13-7-8 12m-14-41-8 9M558 224q9-5 17 2l4 5" strokeWidth="1.7" />
          <path d="M481 175 513 200 549 225 561 240 541 229 503 207 474 195Z" fill="currentColor" stroke="none" />
        </g>
        <path className="me-creation-ink" pathLength="1" d="M52 257C125 189 147 101 218 82 259 73 285 102 311 108" strokeWidth="1.6" />
      </g>
      <g className="me-creation-creator" stroke="currentColor" strokeLinejoin="round" strokeLinecap="round">
        <path className="me-creation-skin" d={creator} strokeWidth="3.5" />
        <g clipPath={`url(#${id}-creator)`}>
          <path d="M1230 170 1091 182C1040 178 1007 214 971 234L923 245 871 291 802 402 897 427 1037 321 1230 291Z" fill={`url(#${id}-tone)`} stroke="none" opacity=".6" />
          <path d="M1230 221 1101 229C1065 225 1043 255 1012 276L978 290 956 351 940 374 946 310 911 331 894 387 869 397 882 316 843 333 816 391 790 387 813 310 775 319 749 311 811 278 838 244C862 224 880 220 897 222 939 237 953 211 980 204 1025 196 1048 178 1073 174L1230 158Z" fill={`url(#${id}-hatch)`} stroke="none" />
          <path d="M1230 207 1114 222C1073 211 1045 242 1021 258L984 279 968 337 954 358 956 300 922 310 889 373 902 310 868 313 823 371 847 304 808 304 774 312 814 284 852 240C884 220 900 247 932 232 966 212 985 212 1012 207 1063 179 1078 190 1096 185L1230 170Z" fill="currentColor" stroke="none" />
          <path d="M1114 121C1043 154 1013 156 977 179 955 194 943 202 926 204M1098 155C1062 172 1038 169 1017 182M876 178C894 181 906 187 913 200M867 254q-10 21-27 34M910 273l-21 33M954 276l-12 31M1014 238q-14-11-28-9" strokeWidth="2.1" />
          <path d="m802 350 14 8m-18-1 13 8m-14 0 11 7m64-28 15 5m-17 2 14 5m-15 4 12 4m65-37 12 4m-12 3 11 4" strokeWidth="1.2" />
          <path d="M796 380q11-2 19 5M869 382q12 1 17 5M943 359q10 1 17 5M753 299q11-11 25-4" strokeWidth="1.5" />
        </g>
        <g className="me-creation-creator-index">
          <path className="me-creation-skin" d="M808 158C781 165 761 172 740 176L643 191C628 193 619 198 618 208 616 221 629 226 645 223L746 214C769 214 789 227 807 230" strokeWidth="3.3" />
          <path d="M637 198q-10 1-10 10 6 5 17 3l12-2-2-10ZM745 184l3 16m5-18 3 16M770 184q8 5 9 14M671 205l53-6" strokeWidth="1.5" />
          <path d="M655 218 745 207C772 207 793 218 809 222L806 233C780 229 769 219 744 220L656 226Z" fill="currentColor" stroke="none" />
        </g>
        <path className="me-creation-ink" pathLength="1" d="M1180 101C1091 142 1045 134 994 168" strokeWidth="1.7" />
      </g>
      <g className="me-creation-spark" stroke="var(--me-void-accent)" strokeWidth="2" strokeLinecap="round">
        <path d="m599 170 2-21m-17 28-11-16m44 13 13-17m-26 97 1 20m-23-30-14 14m49-17 14 15" />
        <circle cx="600" cy="222" r="32" strokeWidth="1" strokeDasharray="2 8" />
      </g>
    </svg>
  )
}
