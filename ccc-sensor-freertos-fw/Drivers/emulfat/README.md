## Create a FAT image

e.g. 250 sectors * 512 B fits a 123k file.

1. install mtools
2. mformat -v "AIR QUALITY" -t 1 -h 1 -s 250 -S 2 -C -i fs.img -c 1 -r 1 -L 1
3. echo 'T,H,PM2.5,PM10,UTC,LAT,LON,FIX,BAT\r\n' > log.csv (50B per line incl. \r\n)
4. mcopy -i fs.img log.csv ::/
5. verify with mdir -i fs.img
6. xxd -i fs.img


Ref: http://www.disc.ua.es/~gil/FAT12Description.pdf