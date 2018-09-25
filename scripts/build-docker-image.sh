#!/usr/bin/env bash

# arguments
IMAGE_NAME=$1

# variables
TEMP_FOLDER="react-components"

if [ -z "$IMAGE_NAME" ]; then
    echo "Please give image name as first script argument"
    exit 1
fi

# prepare react-components
sh ../scripts/prepare-react-components.sh -d $TEMP_FOLDER

# build image of app
docker build -t ${IMAGE_NAME} .
rm -rf $TEMP_FOLDER