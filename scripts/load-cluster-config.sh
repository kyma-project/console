#!/bin/bash
if [ false ]; then
    SCRIPTPATH=$0
else
    SCRIPTPATH=${BASH_SOURCE[0]}
fi

SCRIPT_DIR="$( cd "$( dirname "${SCRIPTPATH}" )" >/dev/null 2>&1 && pwd )$1"
CLUSTER_CONFIG_GEN="$SCRIPT_DIR/../.clusterConfig.gen"

if [ -r $CLUSTER_CONFIG_GEN ]; then
    set -o allexport
    source $CLUSTER_CONFIG_GEN
    set +o allexport
else
    echo "INFO: Could not find .clusterConfig.gen file. No env variables will be injected."
fi