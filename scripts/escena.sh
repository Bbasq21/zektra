#!/bin/bash
# Prepara un video de escena o de transición para /historia-video/.
#
#   bash scripts/escena.sh <video-original.mp4> <nombre>
#   bash scripts/escena.sh ~/Desktop/Zektra/Escenas/mi-video.mp4 escena-2
#   bash scripts/escena.sh ~/Desktop/Zektra/Escenas/transicion.mp4 transicion-1-2
#
# Deja en public/historia/:
#   <nombre>.mp4     escritorio: resolución original, crf 20, GOP 8, sin audio
#   <nombre>-m.mp4   celulares: 1280 de ancho, crf 23, GOP 4 (busca cuadros más rápido)
#   <nombre>.webp    primer cuadro, póster mientras carga el video
# Y junto al original, para generar las transiciones en Flow:
#   <nombre>-primer-frame.png  y  <nombre>-ultimo-frame.png
#
# Requiere ffmpeg (brew install ffmpeg).
set -euo pipefail

src="$1"
name="$2"
out="$(cd "$(dirname "$0")/.." && pwd)/public/historia"
dir="$(dirname "$src")"
mkdir -p "$out"

ffmpeg -v error -y -i "$src" -an -vf "unsharp=5:5:0.8:5:5:0.0" \
  -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p \
  -g 8 -keyint_min 8 -sc_threshold 0 -movflags +faststart "$out/$name.mp4"

ffmpeg -v error -y -i "$src" -an -vf "scale=1280:-2,unsharp=5:5:0.6:5:5:0.0" \
  -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p \
  -g 4 -keyint_min 4 -sc_threshold 0 -movflags +faststart "$out/$name-m.mp4"

ffmpeg -v error -y -ss 0 -i "$src" -frames:v 1 -c:v libwebp -quality 82 "$out/$name.webp"
ffmpeg -v error -y -ss 0 -i "$src" -frames:v 1 "$dir/$name-primer-frame.png"
ffmpeg -v error -y -sseof -0.15 -i "$src" -frames:v 1 "$dir/$name-ultimo-frame.png"

ls -lh "$out/$name.mp4" "$out/$name-m.mp4" "$out/$name.webp"
echo "Listo. Ahora llena el capítulo en src/data/story-video.ts."
