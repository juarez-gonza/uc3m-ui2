#!/bin/sh

img=${1}
mp3=${2}
out="${3}.mp4"
len=${4}

ffmpeg -loop 1 -i ${img} -i ${out} -t ${len} -c:v libx264 -tune stillimage -c:a aac -b:a 192k -pix_fmt yuv420p -shortest ${out}
