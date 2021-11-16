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
function Confirmation() { # Process Yes/No/Quit response
    while :; do
        echo -e "Confirm? (y/n) "
        read -p "   "
        echo
        case ${REPLY} in
        [Yy]* | [Oo][Kk] | 1) # Approved
            return 3
            ;;
        [Qq]uit* | [Ee]sc* | [Ee]xit | -1) # Leave
            Countdown 5
            exit
            ;;
        test)
            read -p "Testmode" test
            for x in $test; do
                echo $x
            done
            countDown 10
            exit
            ;;
        "") # Avoid mis-press the Enter
            continue
            ;;
        *) # Not confirmed
            return
            ;;
        esac
    done
}

Main() {
    while :; do
        echo -e "Input your clan ID."
        read clan_id
        echo -e "The clan ID is ${clan_id}"
        Confirmation
        if [[ $? -eq 3 ]]; then break; fi
    done

    cd $(dirname $(dirname $0))/img/clan
    for id in $clan_id; do
        if [[ -d ${id} ]]; then
            echo "Opening directory..."
        else
            echo "Creating directory for clan ${id}..."
            mkdir "$id"
        fi
        sleep 0.5
        open "$id"
    done

    echo "Done. The programme will exit automatically."
    countDown 10
    exit
}

Main
