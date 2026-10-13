#!/usr/bin/env bash
# scripts/encode-media.sh — the hero cut, its phone cut and poster, and the BTS loop.
# Run from the project root. Needs ffmpeg and ImageMagick.
set -euo pipefail
SRC=public/assets/experience-media-show-reel.mp4
OUT=public/assets/webgl
CLIPS=public/assets/clips
mkdir -p "$OUT" "$CLIPS"
BRIGHT="${BRIGHT:--0.14}"
# The CSS scrim's opacity (.hero-scrim); the gate assumes the same value.
SCRIM="${SCRIM:-0.6}"

# A shade baked into the grade: ink, strongest at the lower left where the
# type sits, gone by the centre. The footage keeps its light on the right.
SHADE="$OUT/.shade.png"
convert -size 3840x2160 radial-gradient:"rgba(0,0,0,0.78)"-"rgba(0,0,0,0)" -crop 1920x1080+1632+162 +repage "$SHADE"

# The hero: six of the reel's strongest shots, ~1.2s each, crossfaded, darkened
# and desaturated so paper type sits on it. In-points in seconds.
FILTER="[0:v]trim=0.5:1.7,setpts=PTS-STARTPTS[a];
[0:v]trim=2.2:3.4,setpts=PTS-STARTPTS[b];
[0:v]trim=10.5:11.7,setpts=PTS-STARTPTS[c];
[0:v]trim=16:17.2,setpts=PTS-STARTPTS[d];
[0:v]trim=20:21.2,setpts=PTS-STARTPTS[e];
[0:v]trim=24:25.2,setpts=PTS-STARTPTS[f];
[a][b]xfade=transition=fade:duration=0.25:offset=0.95[ab];
[ab][c]xfade=transition=fade:duration=0.25:offset=1.9[abc];
[abc][d]xfade=transition=fade:duration=0.25:offset=2.85[abcd];
[abcd][e]xfade=transition=fade:duration=0.25:offset=3.8[abcde];
[abcde][f]xfade=transition=fade:duration=0.25:offset=4.75[cut];
[cut]eq=brightness=${BRIGHT}:saturation=0.85:contrast=1.05,fps=30[eq];
[eq][1:v]overlay=format=auto[graded]"

ffmpeg -v error -y -i "$SRC" -i "$SHADE" -filter_complex "$FILTER;[graded]scale=1920:1080[v1080]" -map "[v1080]" -an \
  -c:v libx264 -preset slow -crf 22 -pix_fmt yuv420p -movflags +faststart "$OUT/hero-loop.mp4"
ffmpeg -v error -y -i "$SRC" -i "$SHADE" -filter_complex "$FILTER;[graded]scale=1280:720[v720]" -map "[v720]" -an \
  -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p -movflags +faststart "$OUT/hero-loop-720.mp4"
ffmpeg -v error -y -i "$OUT/hero-loop.mp4" -frames:v 1 -q:v 3 "$OUT/hero-poster.jpg"

# On set: the reel's podcast shoot at 1.5–6.5s (the 9–14s passage is a title card), silent, 720p, for the belief and the offer.
ffmpeg -v error -y -ss 1.5 -t 5 -i "$SRC" -an -vf "scale=1280:720,fps=30" \
  -c:v libx264 -preset slow -crf 24 -pix_fmt yuv420p -movflags +faststart "$CLIPS/bts.mp4"
ffmpeg -v error -y -i "$CLIPS/bts.mp4" -frames:v 1 -q:v 4 "$CLIPS/bts-poster.jpg"

# Contrast gate: every shot, not just the poster. Sample the loop at 4 fps and
# crop two bands where the type sits: the headline (x 3–60%, y 45–82%), which
# is large text and needs 3:1, and the links and strip (x 3–60%, y 82–97%),
# which are small and need 4.5:1. Linearise, take each frame's 90th-percentile
# luminance, put the ink scrim over it, and require paper to clear both.
GATE=$(mktemp -d)
ffmpeg -v error -y -i "$OUT/hero-loop.mp4" -vf "fps=4,crop=iw*0.57:ih*0.37:iw*0.03:ih*0.45,format=gray" "$GATE/h%03d.png"
ffmpeg -v error -y -i "$OUT/hero-loop.mp4" -vf "fps=4,crop=iw*0.57:ih*0.15:iw*0.03:ih*0.82,format=gray" "$GATE/s%03d.png"
python3 - "$GATE" "$SCRIM" <<'PY'
import sys, glob, struct, zlib
SCRIM = float(sys.argv[2])
def gray_png(path):
    data = open(path, "rb").read()
    pos = 8; w = h = None; idat = b""
    while pos < len(data):
        n = struct.unpack(">I", data[pos:pos+4])[0]; t = data[pos+4:pos+8]; body = data[pos+8:pos+8+n]
        if t == b"IHDR": w, h, depth, ctype = struct.unpack(">IIBB", body[:10]); assert ctype == 0 and depth == 8, (ctype, depth)
        if t == b"IDAT": idat += body
        pos += 12 + n
    raw = zlib.decompress(idat); px = []; prev = bytearray(w); stride = w + 1
    for y in range(h):
        f = raw[y*stride]; line = bytearray(raw[y*stride+1:(y+1)*stride])
        for x in range(w):
            a = line[x-1] if x else 0; b = prev[x]; c = prev[x-1] if x else 0
            if f == 1: line[x] = (line[x] + a) & 255
            elif f == 2: line[x] = (line[x] + b) & 255
            elif f == 3: line[x] = (line[x] + (a + b)//2) & 255
            elif f == 4:
                pp = a + b - c; pa, pb, pc = abs(pp-a), abs(pp-b), abs(pp-c)
                pr = a if pa <= pb and pa <= pc else (b if pb <= pc else c); line[x] = (line[x] + pr) & 255
        px.extend(line); prev = line
    return px
def lin(v):
    c = v/255; return c/12.92 if c <= 0.03928 else ((c+0.055)/1.055)**2.4
def worst(prefix):
    w = 99; wf = ""
    for f in sorted(glob.glob(f"{sys.argv[1]}/{prefix}*.png")):
        px = sorted(gray_png(f)); p90 = px[int(len(px)*0.9)]
        l = (1-SCRIM)*lin(p90) + SCRIM*0.008
        r = (0.93+0.05)/(l+0.05)
        if r < w: w, wf = r, f.split("/")[-1]
    return w, wf
hw, hf = worst("h"); sw, sf = worst("s")
print(f"headline band worst {hf}: {hw:.2f}:1 (needs 3.0) · strip band worst {sf}: {sw:.2f}:1 (needs 4.5)")
sys.exit(0 if hw >= 3.0 and sw >= 4.5 else 1)
PY
rm -rf "$GATE" "$SHADE"
ls -la "$OUT" "$CLIPS"
