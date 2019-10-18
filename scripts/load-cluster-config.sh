CLUSTER_CONFIG_ORIGINAL="${BASH_SOURCE%/*}/../.clusterConfig.default"
CLUSTER_CONFIG_GEN="${BASH_SOURCE%/*}/../.clusterConfig.gen"


if [ -r $CLUSTER_CONFIG_GEN ]; then
    CURRENT_CONFIG_FILE=$CLUSTER_CONFIG_GEN
else
    CURRENT_CONFIG_FILE=$CLUSTER_CONFIG_ORIGINAL
fi

set -o allexport
source $CURRENT_CONFIG_FILE
set +o allexport