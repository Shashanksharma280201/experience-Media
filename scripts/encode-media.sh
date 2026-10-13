#!/usr/bin/env bash
# scripts/encode-media.sh — the hero cut, its phone cut and poster, and the BTS loop.
# Run from the project root. Needs ffmpeg and ImageMagick.
set -euo pipefail
SRC=public/assets/experience-media-show-reel.mp4
OUT=public/assets/webgl
CLIPS=public/assets/clips
mkdir -p "$OUT" "$CLIPS"
BRIGHT="${BRIGHT:--0.12}"

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
[cut]eq=brightness=${BRIGHT}:saturation=0.85:contrast=1.05,fps=30[graded]"

ffmpeg -v error -y -i "$SRC" -filter_complex "$FILTER;[graded]scale=1920:1080[v1080]" -map "[v1080]" -an \
  -c:v libx264 -preset slow -crf 22 -pix_fmt yuv420p -movflags +faststart "$OUT/hero-loop.mp4"
ffmpeg -v error -y -i "$SRC" -filter_complex "$FILTER;[graded]scale=1280:720[v720]" -map "[v720]" -an \
  -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p -movflags +faststart "$OUT/hero-loop-720.mp4"
ffmpeg -v error -y -i "$OUT/hero-loop.mp4" -frames:v 1 -q:v 3 "$OUT/hero-poster.jpg"

# On set: the reel's podcast shoot at 1.5–6.5s (the 9–14s passage is a title card), silent, 720p, for the belief and the offer.
ffmpeg -v error -y -ss 1.5 -t 5 -i "$SRC" -an -vf "scale=1280:720,fps=30" \
  -c:v libx264 -preset slow -crf 24 -pix_fmt yuv420p -movflags +faststart "$CLIPS/bts.mp4"
ffmpeg -v error -y -i "$CLIPS/bts.mp4" -frames:v 1 -q:v 4 "$CLIPS/bts-poster.jpg"

# Contrast gate: mean luminance of the poster under the headline box
# (left 4%–60%, top 45%–88% of the frame). Paper on it must clear 4.5:1.
MEAN=$(convert "$OUT/hero-poster.jpg" -crop 56%x43%+4%+45% -colorspace Gray -format "%[fx:mean]" info:)
python3 - "$MEAN" <<'PY'
import sys
m=float(sys.argv[1])
# After the 0.5 ink scrim: 0.5*m + 0.5*lum(ink≈0.008)
l=0.5*m+0.5*0.008
paper=0.93
ratio=(paper+0.05)/(l+0.05)
print(f"poster mean {m:.3f}, under scrim {l:.3f}, paper contrast {ratio:.2f}:1")
sys.exit(0 if ratio>=4.5 else 1)
PY
ls -la "$OUT" "$CLIPS"
