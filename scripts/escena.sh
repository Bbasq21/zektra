#!/bin/bash
# Codifica una escena de «Cómo trabajamos» (/como-trabajamos/).
#
#   bash scripts/escena.sh <video-original.mp4> <número> [primero|ultimo|<segundos>]
#   bash scripts/escena.sh ~/Desktop/Zektra/Escenas/escena-2.mp4 2
#
# Deja en public/como-trabajamos/, con un hash del contenido en el nombre (los archivos
# se sirven con caché de un año e «immutable»: un archivo nuevo = un nombre nuevo):
#   escena-N.<hash>.mp4         escritorio: resolución original, crf 20, GOP 8, sin audio
#   escena-N-m.<hash>.mp4       celulares y conexiones lentas: 960×540, crf 24, GOP 4
#   escena-N-<ancho>.<hash>.avif / .webp   póster en 640, 960, 1280 y 1920 de ancho
#   og.<hash>.jpg               solo la escena 1: imagen para redes, 1200×630
# Borra las versiones anteriores de esa escena y actualiza src/data/proceso-media.json.
#
# El póster es el cuadro que se ve mientras el video no ha cargado y el único que se ve
# con movimiento reducido, ahorro de datos o conexiones lentas. Por defecto la escena 1
# usa su primer cuadro (coincide con el inicio del video) y las demás el último, donde la
# cámara ya llegó a la isla. Pasa «primero», «ultimo» o un segundo exacto para cambiarlo.
#
# Requiere ffmpeg con libx264, libaom-av1 y libwebp (brew install ffmpeg) y Node.
set -euo pipefail

src="$1"
n="$2"
frame="${3:-}"
if [ -z "$frame" ]; then
  if [ "$n" = 1 ]; then frame=primero; else frame=ultimo; fi
fi
root="$(cd "$(dirname "$0")/.." && pwd)"
name="escena-$n"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

if [ "${SOLO_POSTER:-0}" != 1 ]; then
  ffmpeg -v error -y -i "$src" -an -vf "unsharp=5:5:0.8:5:5:0.0" \
    -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p \
    -g 8 -keyint_min 8 -sc_threshold 0 -movflags +faststart "$tmp/$name.mp4"

  ffmpeg -v error -y -i "$src" -an -vf "scale=960:-2:flags=lanczos" \
    -c:v libx264 -preset slow -crf 24 -pix_fmt yuv420p \
    -g 4 -keyint_min 4 -sc_threshold 0 -movflags +faststart "$tmp/$name-m.mp4"
fi

case "$frame" in
  primero) ffmpeg -v error -y -ss 0 -i "$src" -frames:v 1 "$tmp/cuadro.png" ;;
  ultimo) ffmpeg -v error -y -sseof -0.5 -i "$src" -update 1 "$tmp/cuadro.png" ;;
  *) ffmpeg -v error -y -ss "$frame" -i "$src" -frames:v 1 "$tmp/cuadro.png" ;;
esac

# La escena 1 es el elemento LCP: más calidad (Chrome descarta como LCP las imágenes con
# muy pocos bits por píxel, y el póster tiene que verse bien por sí solo).
if [ "$n" = 1 ]; then crf=20; else crf=32; fi
for w in 640 960 1280 1920; do
  ffmpeg -v error -y -i "$tmp/cuadro.png" -vf "scale=$w:-2:flags=lanczos,format=yuv420p" \
    -c:v libaom-av1 -still-picture 1 -crf "$crf" -cpu-used 3 "$tmp/$name-$w.avif"
  ffmpeg -v error -y -i "$tmp/cuadro.png" -vf "scale=$w:-2:flags=lanczos" \
    -c:v libwebp -quality 74 -compression_level 6 "$tmp/$name-$w.webp"
done

if [ "$n" = 1 ]; then
  ffmpeg -v error -y -i "$tmp/cuadro.png" \
    -vf "scale=1200:630:force_original_aspect_ratio=increase:flags=lanczos,crop=1200:630" \
    -q:v 3 "$tmp/og.jpg"
fi

node "$root/scripts/escena-manifest.mjs" "$tmp" "$n"
