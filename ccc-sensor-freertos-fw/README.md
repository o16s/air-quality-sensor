## Create a FAT image

1. install mtools
2. mformat -v "EMBEDDED FS" -t 1 -h 1 -s 10 -S 2 -C -i fs.img -c 1 -r 1 -L 1
3. echo 'T,H,PM2.5,PM10,UTC,LAT,LON,FIX\r\n' > log.csv
4. mcopy -i fs.img log.csv ::/
5. verify with mdir -i fs.img
6. xxd -i fs.img