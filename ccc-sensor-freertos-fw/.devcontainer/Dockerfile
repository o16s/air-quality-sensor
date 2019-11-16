#the first thing we need to do is define from what image we want to build from.
#Here we will use a 14.04 LTS(long term support) version of ubuntu from docker Hub :
FROM ubuntu:18.04

MAINTAINER Guillaume Thivolet guillaume@octanis.com

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update -q
#install software requirements
RUN apt-get install --no-install-recommends -y software-properties-common build-essential curl git libncurses5-dev symlinks

RUN mkdir -p "${HOME}/opt" \
&& cd "${HOME}/opt" \
&& curl -L https://developer.arm.com/-/media/Files/downloads/gnu-rm/8-2019q3/RC1.1/gcc-arm-none-eabi-8-2019-q3-update-linux.tar.bz2?revision=c34d758a-be0c-476e-a2de-af8c6e16a8a2?product=GNU%20Arm%20Embedded%20Toolchain,64-bit,,Linux,8-2019-q3-update -o armgcc.tar.bz2 \
&& tar xjf armgcc.tar.bz2 \
&& rm -rf armgcc.tar.bz2 \
&& chmod -R -w "${HOME}/opt/gcc-arm-none-eabi-8-2019-q3-update"

#install Debugging dependancies
#install OPENOCD Build dependancies and gdb
RUN apt-get install --no-install-recommends -y \
libhidapi-hidraw0 \
libusb-0.1-4 \
libusb-1.0-0 \
libhidapi-dev \
libusb-1.0-0-dev \
libusb-dev \
libtool \
make \
automake \
pkg-config \
autoconf \
texinfo
#build and install OPENOCD from repository
RUN cd /usr/src/ \
&& git clone --depth 1 https://github.com/ntfreak/openocd.git \
&& cd openocd \
&& ./bootstrap \
&& ./configure --enable-stlink --enable-jlink --enable-ftdi --enable-cmsis-dap \
&& make -j"$(nproc)" \
&& make install
#remove unneeded directories
RUN cd ..
ENV PATH="/root/opt/gcc-arm-none-eabi-8-2019-q3-update/bin/:${PATH}"

#EXPOSE OPENOCD PORT
EXPOSE 4444
EXPOSE 6666
EXPOSE 50000