#!/bin/bash

function countDown() {
    _time=$1
    echo
    for ((i = _time; i > 0; i--)); do
        echo -ne "Countdown ${i}"
        sleep 1
        echo -ne "\r"
    done
}

Main() {
    while :; do
        echo -e "\
Input your option.
\033[32m0)\033[0m sudo apachectl stop
\033[32m1)\033[0m sudo apachectl start
\033[32m2)\033[0m sudo apachectl restart
Type \033[31mesc\033[0m to exit
"
        read
        case $REPLY in
        0)
            sudo apachectl stop
            ;;
        1)
            sudo apachectl start
            ;;
        2)
            sudo apachectl restart
            ;;
        e | esc | exit)
            countDown 5
            exit
            ;;
        *)
            echo continue
            ;;
        esac
    done
}

Main
