#!/usr/bin/env bash

RED='\033[0;31m'
GREEN='\033[0;32m'
INVERTED='\033[7m'
NC='\033[0m' # No Color

# arguments
SSH_FILE=
OVERWRITE=

# read arguments
while test $# -gt 0; do
    case "$1" in
        --ssh-file | -s)
            shift
            SSH_FILE=$1
            shift
            ;;
        --overwrite-git-config)
            shift
            OVERWRITE=$1
            shift
            ;;
        *)
            echo "$1 is not a recognized flag!"
            exit 1;
            ;;
    esac
done

echo "Configure git to push..."

# configure git
if $OVERWRITE; then
    sh ./scripts/git-config.sh -s $SSH_FILE
fi

# push to remote
echo "Push new version of react-components..."

git add .

git commit -m "Bump version of @kyma-project/react-components"
git push origin HEAD:master
gitResult=$?

if [ ${gitResult} != 0 ]; then
    echo -e "${RED}✗ git push fail${NC}\n$gitResult${NC}\n"
    exit 1
else echo -e "${GREEN}√ git push${NC}\n"
fi
