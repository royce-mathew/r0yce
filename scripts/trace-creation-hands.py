# /// script
# requires-python = ">=3.11"
# dependencies = ["numpy", "opencv-python-headless"]
# ///
"""Trace Michelangelo's Creation of Adam hands into layered manga-ink SVG paths.

Run from the repo root: `uv run scripts/trace-creation-hands.py`
Writes src/app/(app)/creation-hands-paths.ts. The fresco is public domain; the
source JPEG is downloaded once into the system temp directory.
"""
import json
import tempfile
import urllib.request
from pathlib import Path

import cv2
import numpy as np

SOURCE = "https://upload.wikimedia.org/wikipedia/commons/5/5b/Michelangelo_-_Creation_of_Adam_%28cropped%29.jpg"
CROP = (700, 500, 2020, 860)  # x0, y0, x1, y1 in the 3524x1599 source: both forearms and the fingertip gap.
OUT = Path(__file__).resolve().parent.parent / "src/app/(app)/creation-hands-paths.ts"
S = 2  # Trace at 2x, emit crop pixels with one decimal.


def load_crop():
    cache = Path(tempfile.gettempdir()) / "creation-of-adam-cropped.jpg"
    if not cache.exists():
        request = urllib.request.Request(SOURCE, headers={"User-Agent": "royce.sh creation-hands tracer"})
        cache.write_bytes(urllib.request.urlopen(request).read())
    image = cv2.imread(str(cache))
    x0, y0, x1, y1 = CROP
    return image[y0:y1, x0:x1]


def segment(image):
    """GrabCut both arms out of the plaster sky, seeded by saturation and hand-placed hints."""
    saturation = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)[..., 1].astype(int)
    mask = np.full(image.shape[:2], cv2.GC_PR_BGD, np.uint8)
    mask[saturation > 70] = cv2.GC_PR_FGD
    mask[saturation < 45] = cv2.GC_BGD

    def hint(points, value):
        cv2.fillPoly(mask, [np.array(points, np.int32)], value)

    # Adam's knee, God's cloak, the cherub and the robe are as saturated as skin.
    hint([(160, 360), (190, 338), (240, 328), (300, 333), (340, 360)], cv2.GC_BGD)
    hint([(1000, 0), (1320, 0), (1320, 40), (1250, 60), (1180, 80), (1060, 108), (1000, 118), (985, 60)], cv2.GC_BGD)
    hint([(1230, 0), (1320, 0), (1320, 360), (1230, 360)], cv2.GC_BGD)
    hint([(980, 250), (1110, 238), (1210, 190), (1235, 185), (1235, 360), (980, 360)], cv2.GC_BGD)
    hint([(0, 270), (120, 245), (300, 205), (400, 165), (450, 165), (520, 175), (530, 200), (440, 210), (300, 260), (150, 300), (0, 330)], cv2.GC_FGD)
    hint([(700, 215), (800, 195), (900, 175), (1000, 145), (1100, 130), (1200, 115), (1200, 160), (1100, 200), (1000, 225), (900, 230), (800, 225), (720, 228)], cv2.GC_FGD)

    cv2.grabCut(image, mask, None, np.zeros((1, 65)), np.zeros((1, 65)), 6, cv2.GC_INIT_WITH_MASK)
    arms = np.where((mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD), 255, 0).astype(np.uint8)
    arms = cv2.morphologyEx(arms, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    arms = cv2.morphologyEx(arms, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
    _, labels, stats, _ = cv2.connectedComponentsWithStats(arms)
    biggest = np.argsort(-stats[1:, cv2.CC_STAT_AREA])[:2] + 1
    return np.isin(labels, biggest).astype(np.uint8) * 255


def smooth_closed(points, sigma):
    if len(points) < 8:
        return points
    k = int(sigma * 3)
    kernel = cv2.getGaussianKernel(2 * k + 1, sigma)[:, 0]
    padded = np.concatenate([points[-k:], points, points[:k]])
    return np.stack([np.convolve(padded[:, i], kernel, "valid") for i in (0, 1)], 1)


def number(value):
    text = f"{value:.1f}".removesuffix(".0")
    return "0" if text == "-0" else text


def to_path(binary, sigma, epsilon, min_area):
    """Contours become closed quadratic splines through edge midpoints, so corners stay soft like a brush."""
    contours, _ = cv2.findContours(binary, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_NONE)
    parts = []
    for contour in contours:
        if abs(cv2.contourArea(contour)) < min_area:
            continue
        points = smooth_closed(contour[:, 0, :].astype(np.float64), sigma)
        points = cv2.approxPolyDP(points.astype(np.float32).reshape(-1, 1, 2), epsilon, True)[:, 0, :] / S
        if len(points) < 3:
            continue
        mids = (points + np.roll(points, -1, 0)) / 2
        pair = lambda p: f"{number(p[0])} {number(p[1])}"
        parts.append(f"M{pair(mids[-1])}" + "".join(f"Q{pair(p)} {pair(m)}" for p, m in zip(points, mids)) + "Z")
    return "".join(parts)


def main():
    image = load_crop()
    mask = cv2.resize(segment(image), None, fx=S, fy=S, interpolation=cv2.INTER_LINEAR)
    mask = (cv2.GaussianBlur(mask, (0, 0), 3) > 127).astype(np.uint8) * 255
    inside = mask > 0
    image = cv2.resize(image, None, fx=S, fy=S, interpolation=cv2.INTER_CUBIC)
    lightness = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)[..., 0].astype(np.float32)
    # Fresco cracks and plaster grain would trace into noise; flatten them before thresholding.
    tone_source = cv2.bilateralFilter(cv2.bilateralFilter(lightness, 0, 18, 9), 0, 14, 7)
    line_source = cv2.bilateralFilter(lightness, 0, 12, 5)
    black, dense, light = np.percentile(tone_source[inside], [3, 20, 46])

    def clean(binary, kernel, min_area):
        if kernel:
            binary = cv2.morphologyEx(binary, cv2.MORPH_OPEN, np.ones((kernel, kernel), np.uint8))
            binary = cv2.morphologyEx(binary, cv2.MORPH_CLOSE, np.ones((kernel, kernel), np.uint8))
        count, labels, stats, _ = cv2.connectedComponentsWithStats(binary)
        keep = np.zeros(count, bool)
        keep[1:] = stats[1:, cv2.CC_STAT_AREA] >= min_area
        return (keep[labels] * 255).astype(np.uint8) & mask

    below = lambda threshold: ((tone_source < threshold) & inside).astype(np.uint8) * 255
    # Difference of Gaussians picks up knuckles, finger separations and tendons as drawn lines.
    dog = cv2.GaussianBlur(line_source, (0, 0), 2) - .99 * cv2.GaussianBlur(line_source, (0, 0), 3.2)
    lines = ((dog < -1.1) & (cv2.erode(mask, np.ones((7, 7), np.uint8)) > 0)).astype(np.uint8) * 255
    # Manga outlines swell on the side away from the light (upper left in the fresco); the crescent
    # between the silhouette and a copy nudged up-left reads as brush pressure.
    nudged = np.zeros_like(mask)
    nudged[:-6, :-3] = mask[6:, 3:]
    layers = {
        "silhouette": (mask, (2.2, .9, 400)),
        "light": (clean(below(light), 11, 900), (3, 1.1, 500)),
        "dense": (clean(below(dense), 9, 700), (2.5, 1, 400)),
        "shadow": (clean(below(black), 7, 900), (2, .8, 120)),
        "lines": (clean(lines, 0, 90), (1, .6, 40)),
        "weight": (clean(cv2.bitwise_and(mask, cv2.bitwise_not(nudged)), 3, 60), (1.2, .6, 40)),
    }

    count, components = cv2.connectedComponents(mask)
    arms = sorted(range(1, count), key=lambda i: -(components == i).sum())[:2]
    adam, creator = sorted(arms, key=lambda i: np.nonzero(components == i)[1].mean())
    result = {}
    for name, component in (("adam", adam), ("creator", creator)):
        region = cv2.dilate(((components == component) * 255).astype(np.uint8), np.ones((3, 3), np.uint8))
        traced = {layer: to_path(binary & region, *spec) for layer, (binary, spec) in layers.items()}
        result[name] = {
            "silhouette": traced["silhouette"],
            "light": traced["light"],
            "dense": traced["dense"],
            "ink": traced["shadow"] + traced["lines"] + traced["weight"],
        }

    OUT.write_text(
        "// Generated by scripts/trace-creation-hands.py from Michelangelo's Creation of Adam (public domain).\n"
        "// Coordinates are fresco crop pixels; edit the script and rerun instead of hand-editing.\n"
        f"export const creationHands = {json.dumps(result, indent=2)} as const\n"
    )
    print(f"wrote {OUT} ({OUT.stat().st_size // 1024} KiB)")


if __name__ == "__main__":
    main()
