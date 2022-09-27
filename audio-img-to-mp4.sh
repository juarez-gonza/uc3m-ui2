#!/bin/sh

img=${1}
mp3=${2}
out="${mp3/mp3/mp4}"
out="${out/resources\/audios/resources\/videos}"
len=${3}

ffmpeg -loop 1 -i "${img}" -i "${mp3}" -t "${len}" -c:v libx264 -tune stillimage -c:a aac -b:a 192k -pix_fmt yuv420p -shortest "${out}"
