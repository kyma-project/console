#!/usr/bin/env bash

# arguments
TEMP_FOLDER=

# variables
REACT_COMPONENTS_FOLDER="components/react"
CWD=$PWD

# read arguments
while test $# -gt 0; do
    case "$1" in
        --temp-folder | -d)
            shift
            TEMP_FOLDER=$1
            shift
            ;;
        *)
            echo "$1 is not a recognized flag!"
            exit 1;
            ;;
    esac
done

# prepare react-components
cd ../${REACT_COMPONENTS_FOLDER}
npm install
npm run build

cd $CWD

# copy lib index.js for DOCKERFILE
mkdir $TEMP_FOLDER
cp ../${REACT_COMPONENTS_FOLDER}/lib/index.js ./${TEMP_FOLDER}/index.js

if [ -d "./node_modules/@kyma-project/react-components/lib/" ]; then
    rm -rf ./node_modules/@kyma-project/react-components/lib/index.js
    cp ./${TEMP_FOLDER}/index.js ./node_modules/@kyma-project/react-components/lib/index.js
fi

for d in */; do
    if [ -d "./"$d"node_modules/@kyma-project/react-components/lib/" ]; then
        rm -rf "./"$d"node_modules/@kyma-project/react-components/lib/index.js"
        cp ./${TEMP_FOLDER}/index.js "./"$d"node_modules/@kyma-project/react-components/lib/index.js"
    fi 
done