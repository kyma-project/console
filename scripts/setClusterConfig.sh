#!/bin/bash

# USAGE:
# 'setClusterConfig.sh example' will generate clusterConfig.gen file for domain example.$CLUSTER_HOST (CLUSTER_HOST is taken from your environment)
# 'setClusterConfig.sh example.that.has.dot' will generate clusterConfig.gen file for domain example.that.has.dot
# in both cases, the full domain will also be added to clusterRegistry.txt file

if [ -z "${BASH_SOURCE}" ]; then
    SCRIPTPATH=$0
else
    SCRIPTPATH=${BASH_SOURCE[0]}
fi

SCRIPT_DIR="$( cd "$( dirname "${SCRIPTPATH}" )" >/dev/null 2>&1 && pwd )"
HOST="$(echo $CLUSTER_HOST)"
CLUSTER_HISTORY_REGISTRY_FILE=$SCRIPT_DIR/clusterRegistry.txt
CLUSTER_CONFIG_ORIGINAL="$SCRIPT_DIR/../.clusterConfig.default"
CLUSTER_CONFIG_GEN="$SCRIPT_DIR/../.clusterConfig.gen"

if [  -z "$HOST"  ]
then
    echo -e "\033[91mIt looks like your \033[92mCLUSTER_HOST\033[91m environment variable is not set.
    The script might not work properly.
    \033[39m"
else
    echo -e "Cluster host read from your environment: \033[92m$HOST\033[91m"
fi

if [ $1 = "local" ]
then
    DOMAIN=kyma.local
else
    if [[ $1 == *"."* ]]; then
        DOMAIN=$1 # given argument (cluster name) contains a dot => it is a full cluster URL
    else
        DOMAIN=$1.$HOST # given argument (cluster name) doesn't contain a dot => it is just a cluster name
    fi
fi

LOCALDOMAIN=console-dev.$DOMAIN
$SCRIPT_DIR/checkClusterAvailability.sh -s $DOMAIN

if [ $? != 0 ]
then
    echo -e "\033[31mIt looks like the cluster isn't running ✗ \033[39m"
    read "continue?Would you like to continue running the script anyway? (y/n)"
    if [[ "$continue" =~ ^[Yy]$ ]]; then :
    else
        exit 0
    fi
    
else
    echo -e "\033[32mIt looks like the cluster is running ✓ \033[39m"
fi

if [ ! -f $CLUSTER_HISTORY_REGISTRY_FILE ]; then
    touch $CLUSTER_HISTORY_REGISTRY_FILE
fi

if grep -Fxq $DOMAIN $CLUSTER_HISTORY_REGISTRY_FILE
then
    echo -e "\033[2mThe cluster address has already been registered.\033[0m"
else
    echo -e "\033[2mThe cluster address not been registered yet. It is now.\033[0m"
    echo $DOMAIN>>$CLUSTER_HISTORY_REGISTRY_FILE
fi


echo -e "\033[39mSetting config for: \033[36m$1\033[0m"
echo ""

if [ ! -r $CLUSTER_CONFIG_ORIGINAL ]; then
    echo -e "\033[91mThe source clusterConfig file is empty or doesn't exist\033[0m"
    exit 1
fi

cp -rf $CLUSTER_CONFIG_ORIGINAL $CLUSTER_CONFIG_GEN

# replace variables in .clusterConfig.gen
sed -i '' "s/REACT_APP_localDomain=.*/REACT_APP_localDomain=\"$LOCALDOMAIN\"/" $CLUSTER_CONFIG_GEN
sed -i '' "s/REACT_APP_domain=.*/REACT_APP_domain=\"$DOMAIN\"/" $CLUSTER_CONFIG_GEN


echo "Root permissions needed to remove previous cluster->localhost bindings in /etc/hosts"
sudo sed -i '' "/.$HOST/d" /etc/hosts


# add new cluster->localhost binding to hosts file
echo "127.0.0.1 console-dev.$DOMAIN localhost"| sudo tee -a /etc/hosts

echo "Added ClusterConfig to Console"
echo ""
echo -e "Please run \033[91mnpm run bootstrap\033[0m, then run \033[94mnpm start\033[0m in the root Console folder"
echo -e "After that you can open \033[93mhttp://console-dev.$DOMAIN:4200\033[0m"
exit 0