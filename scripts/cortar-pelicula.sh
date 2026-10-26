#!/bin/bash
# Corta la película completa de «Cómo trabajamos» en sus seis escenas, en los mismos
# cuadros que los cortes actuales, y codifica cada una con scripts/escena.sh. Sirve para
# reemplazar los videos por una versión de más resolución (por ejemplo, 1080p) sin que
# las uniones salten.
#
#   bash scripts/cortar-pelicula.sh ~/Desktop/Zektra/pelicula-1080p.mp4
#
# Los cortes actuales duran 192, 168, 168, 168, 168 y 168 cuadros a 24 fps, y el último
# cuadro de cada escena es el mismo que el primero de la siguiente. Si la película trae esos
# cuadros repetidos (1032 en total), se corta en seco; si los trae una sola vez (1027), cada
# escena empieza en el último cuadro de la anterior. Con otro total el script se detiene:
# la película no es la misma y habría que medir los cortes de nuevo.
#
# Requiere ffmpeg (brew install ffmpeg) y Node.
set -euo pipefail

src="$1"
root="$(cd "$(dirname "$0")/.." && pwd)"
FRAMES=(192 168 168 168 168 168)
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

fps="$(ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate -of csv=p=0 "$src")"
total="$(ffprobe -v error -select_streams v:0 -count_packets -show_entries stream=nb_read_packets -of csv=p=0 "$src")"
if [ "$fps" != "24/1" ]; then
  echo "La película va a $fps; los cortes están medidos a 24 fps." >&2
  exit 1
fi
case "$total" in
  1032) overlap=0 ;;
  1027) overlap=1 ;;
  *) echo "La película tiene $total cuadros; se esperaban 1032 (o 1027 sin repetir uniones)." >&2; exit 1 ;;
esac

start=0
for i in 1 2 3 4 5 6; do
  n=${FRAMES[$((i - 1))]}
  end=$((start + n - 1))
  # Corte casi sin pérdida: la compresión final la hace escena.sh.
  ffmpeg -v error -y -i "$src" -an \
    -vf "select='between(n\,$start\,$end)',setpts=N/FRAME_RATE/TB" \
    -c:v libx264 -preset slow -crf 10 -pix_fmt yuv420p "$tmp/escena-$i.mp4"
  echo "Escena $i: cuadros $start–$end"
  bash "$root/scripts/escena.sh" "$tmp/escena-$i.mp4" "$i"
  start=$((end + 1 - overlap))
done

echo "Listo. Revisa las uniones en /como-trabajamos/ y ajusta los focus en src/data/proceso-video.ts si hace falta."
