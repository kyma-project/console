#!/bin/zsh

SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"
HOST="$(echo $CLUSTER_HOST)"
CLUSTER_HISTORY_REGISTRY_FILE=clusterRegistry.txt

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

# replace variables in config.js. Running 'npm run bootstrap' is necessary to bring them deeper into Console
sed -i '' "s/var localDomain = .*/var localDomain = '$LOCALDOMAIN';/" $SCRIPTPATH/console/config.js
sed -i '' "s/var domain = .*/var domain = '$DOMAIN';/" $SCRIPTPATH/console/config.js


echo "Root permissions needed to remove previous cluster->localhost bindings in /etc/hosts"
sudo sed -i '' "/.$HOST/d" /etc/hosts


# add new cluster->localhost binding to hosts file
echo "127.0.0.1 console-dev.$DOMAIN localhost"| sudo tee -a /etc/hosts

echo "Added ClusterConfig to Luigi and Console"
echo ""
echo -e "Please run \e[91mnpm run bootstrap\e[0m in a root Console folder"
echo -e "Then you can open \e[93mhttp://console-dev.$DOMAIN:4200\e[0m"
echo ""
echo ""
echo "Luigi OIDC Settings which you can use for extendedConfig.js:"
echo ""
echo "use: \"openIdConnect\","
echo "openIdConnect: {"
echo "  authority: \"https://dex.$DOMAIN\","
echo "  client_id: \"console\","
echo "  scope: \"audience:server:client_id:kyma-client audience:server:client_id:console openid profile email groups\","

exit 0