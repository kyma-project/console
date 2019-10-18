#!/bin/zsh

# USAGE:
# 'setClusterConfig.sh example' will generate clusterConfig.gen file for domain example.$CLUSTER_HOST (CLUSTER_HOST is taken from your environment)
# 'setClusterConfig.sh example.that.has.dot' will generate clusterConfig.gen file for domain example.that.has.dot
# in both cases, the full domain will also be added to clusterRegistry.txt file

SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"
HOST="$(echo $CLUSTER_HOST)"
CLUSTER_HISTORY_REGISTRY_FILE=clusterRegistry.txt
CLUSTER_CONFIG_ORIGINAL="$SCRIPTPATH/../.clusterConfig.default"
CLUSTER_CONFIG_GEN="$SCRIPTPATH/../.clusterConfig.gen"

if [  -z "$HOST"  ]
then
    echo "\e[91mIt looks like your \e[92mCLUSTER_HOST\e[91m environment variable is not set.
    The script might not work properly.
    \e[39m"
else
    echo "Cluster host read from your environment: \e[92m$HOST\e[91m"
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

./checkClusterAvailability.sh -s $DOMAIN

if [ $? != 0 ]
then
    echo "\e[31mIt looks like the cluster isn't running ✗ \e[39m"
    read "continue?Would you like to continue running the script anyway? (y/n)"
    if [[ "$continue" =~ ^[Yy]$ ]]
    then
    else
        exit 0;
    fi
    
else
    echo "\e[32mIt looks like the cluster is running ✓ \e[39m"
fi


if grep -Fxq $DOMAIN $CLUSTER_HISTORY_REGISTRY_FILE
then
    echo "\e[2mThe cluster address has already been registered.\e[0m"
else
    echo "\e[2mThe cluster address not been registered yet. It is now.\e[0m"
    echo $DOMAIN>>$CLUSTER_HISTORY_REGISTRY_FILE
fi


echo "\e[39mSetting config for: \e[36m$1\e[0m"
echo ""

if [ ! -r $CLUSTER_CONFIG_ORIGINAL ]; then
    echo "\e[91mThe source clusterConfig file is empty or doesn't exist\e[0m"
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
echo -e "Please run \e[91mnpm run bootstrap\e[0m in a root Console folder"
echo -e "Then you can open \e[93mhttp://console-dev.$DOMAIN:4200\e[0m"
exit 0