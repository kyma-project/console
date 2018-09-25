#!/usr/bin/env bash

RED='\033[0;31m'
GREEN='\033[0;32m'
INVERTED='\033[7m'
NC='\033[0m' # No Color

# arguments
NPM_RC=
VERSION_TYPE=

# variables
VERSION=

# read arguments
while test $# -gt 0; do
    case "$1" in
        --token | -t)
            shift
            NPM_RC=$1
            shift
            ;;
        --version | -v)
            shift
            VERSION_TYPE=$1
            shift
            ;;
        *)
            echo "$1 is not a recognized flag!"
            exit 1;
            ;;
    esac
done

echo "Configure npmrc to publish..."

# configure global .npmrc file
echo "$NPM_RC
strict-ssl=true
registry=https://registry.npmjs.org/" > /.npmrc

npm config set globalconfig /.npmrc

# bump version of @kyma-project/react-components
if [ -z "$VERSION_TYPE" ] || [ ${VERSION_TYPE} == "null" ]; then
    VERSION_TYPE="patch"
fi

VERSION=`npm version $VERSION_TYPE --git-tag-version=false -m "Upgrade to %s by Kyma bot"`
npmVersionResult=$?

if [ ${npmVersionResult} != 0 ]; then
    echo -e "${RED}✗ npm version fail${NC}\n$npmVersionResult${NC}\n"
    exit 1
else echo -e "${GREEN}√ npm version${NC}\n"
fi

 publish new version of package
npm publish
npmPublishResult=$?

if [ ${npmPublishResult} != 0 ]; then
    echo -e "${RED}✗ npm publish fail${NC}\n$npmPublishResult${NC}\n"
    exit 1
else echo -e "${GREEN}√ npm publish push${NC}\n"
fi

# change @kyma-project/react-components version in package.json files
prefix="v"
VERSION=${VERSION/#$prefix}

# mac must have a prefix "" for -i flag, but linux doesn't...
sed -i "s/\"\@kyma-project\/react-components\":.*/\"\@kyma-project\/react-components\": \"$VERSION\",/" ../../catalog/package.json ../../instances/package.json  ../../content/package.json
