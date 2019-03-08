#!/usr/bin/env bash

# arguments
TEMP_FOLDER=

# variables
REACT_COMPONENTS_FOLDER="components/react-odata"
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
cp -a ../${REACT_COMPONENTS_FOLDER}/lib ./${TEMP_FOLDER}
rm -rf ./node_modules/@kyma-project/odata-react/lib
cp -a ../${REACT_COMPONENTS_FOLDER}/lib ./node_modules/@kyma-project/odata-react/lib
