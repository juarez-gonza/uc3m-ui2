#!/bin/sh

audio=${1}
out=${2}
len=${3}

ffmpeg -ss 0 -i "${audio}" -t "${len}" -c copy "${2}"
