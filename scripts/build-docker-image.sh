#!/usr/bin/env bash

# arguments
IMAGE_NAME=$1

if [ -z "$IMAGE_NAME" ]; then
    echo "Please give image name as first script argument"
    exit 1
fi

# resolve root dependencies
sh ./pre-build-docker-image.sh

# build image of app
docker build -t ${IMAGE_NAME} .
rm -rf $TEMP_FOLDER