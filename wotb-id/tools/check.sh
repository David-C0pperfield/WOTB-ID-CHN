#!/bin/bash
cd /Library/WebServer/Documents/WOTB-ID-CHN/tools
count=0
readonly off_count=0
checkWithPylint() {
    while true; do
        if [ $count == 0 ]; then
            count=1
        else
            read -s -n1 -p "Press Enter" usr_input
            if [ $usr_input == "q" ]; then
                return 0
            fi
        fi
        pylint clanPicDownloader.py
    done
}
checkWithPylint
exit
