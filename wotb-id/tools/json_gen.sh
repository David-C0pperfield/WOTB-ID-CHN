#!/bin/bash

Countdown () {
    time=$1
    for((i=time;i>0;i--));
    do
        echo -ne "The programme will exit in ${i} sec."
        sleep 1
        echo -ne "\r"
    done
    return
}

cd $(dirname $0)
python3 clan2json.py
Countdown 5
exit
