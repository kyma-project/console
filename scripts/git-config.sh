#!/usr/bin/env bash

RED='\033[0;31m'
GREEN='\033[0;32m'
INVERTED='\033[7m'
NC='\033[0m' # No Color

# arguments
SSH_FILE=

# read arguments
while test $# -gt 0; do
    case "$1" in
        --ssh-file | -s)
            shift
            SSH_FILE=$1
            shift
            ;;
        *)
            echo "$1 is not a recognized flag!"
            exit 1;
            ;;
    esac
done

# configure git
git config --global user.email "kyma.bot@sap.com"
git config --global user.name "Kyma Bot"

git config --global core.sshCommand 'ssh -i '$SSH_FILE''
gitConfResult=$?

if [ ${gitConfResult} != 0 ]; then
    echo -e "${RED}✗ git config failNC}\n$gitResult${NC}\n"
    exit 1
else echo -e "${GREEN}√ git config${NC}\n"
fi