#!/bin/bash
if [ -z "${BASH_SOURCE}" ]; then
    SCRIPTPATH=$(dirname -- "$(rreadlink "$0")")
    echo "bash source is not defined. SCRIPTPATH=$SCRIPTPATH"
else
    SCRIPTPATH=${BASH_SOURCE[0]}
    echo "bash source is defined. SCRIPTPATH=$SCRIPTPATH"
fi

SCRIPT_DIR="$( cd "$( dirname "${SCRIPTPATH}" )" >/dev/null 2>&1 && pwd )"
echo "SCRIPT_DIR=$SCRIPT_DIR"
CLUSTER_CONFIG_ORIGINAL="$SCRIPT_DIR/../.clusterConfig.default"
CLUSTER_CONFIG_GEN="$SCRIPT_DIR/../.clusterConfig.gen"

if [ -r $CLUSTER_CONFIG_GEN ]; then
    CURRENT_CONFIG_FILE=$CLUSTER_CONFIG_GEN
else
    CURRENT_CONFIG_FILE=$CLUSTER_CONFIG_ORIGINAL
fi

set -o allexport
. $CURRENT_CONFIG_FILE
set +o allexport