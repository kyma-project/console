#!/bin/bash

# USAGE:
# `checkClusterAvailability.sh` will check availability of all addresses listed in clusterRegistry.txt file
# `checkClusterAvailability.sh <url>` will check availability of the <url> provided and display the result
# `checkClusterAvailability.sh -s <url>` will check availability of the <url> provided, not display anything and return 0 or 1 (available/unavailable)
SCRIPT_DIR="$( cd "$( dirname "${0}" )" >/dev/null 2>&1 && pwd )"
CLUSTER_HISTORY_REGISTRY_FILE=$SCRIPT_DIR/clusterRegistry.txt
SILLENT_MODE=false
HOST="$(echo $CLUSTER_HOST)"

timeout() { perl -e 'alarm shift; exec @ARGV' "$@"; }

displaySingleClusterAvailibility() {
    if timeout 2 nc -z dex.$1 80 2>/dev/null
    then
        echo -e "\033[42m\033[30m $1 ✓ \033[39m\033[49m"
        
    else
        echo -e "\033[91m\033[2m $1 ✗ \033[0m\033[39m"
    fi
}

while getopts ":s" arg; do
    case $arg in
        s)
            SILLENT_MODE=true
        ;;
    esac
done

if [ -z $1 ]
then
    # not set
    if [ -r $CLUSTER_HISTORY_REGISTRY_FILE ]
    then
        for i in `cat $CLUSTER_HISTORY_REGISTRY_FILE`
        do
            displaySingleClusterAvailibility $i
        done
    else
        echo -e "\033[91mThe cluster registry file is empty or doesn't exist\033[0m"
    fi
else
    if [ "$SILLENT_MODE" = true ]; then
        if nc -z dex.$2 80 2>/dev/null
        then
            exit 0
        else
            exit 1
        fi
    else
        if [[ $1 == *"."* ]]; then
            displaySingleClusterAvailibility $1
        else
            echo -e "\033[30mAdding domain to registry...\033[39m\033[49m"
            displaySingleClusterAvailibility "$1.$HOST"
        fi
    fi
fi

