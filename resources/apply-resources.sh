if [ -z "$1" ] ; then  
    echo "No domain passed as first argument, aborting." 
    exit 1
fi

mkdir -p ../temp/resources 

cp -rf . ../temp/resources

for i in ../temp/resources/**{/*,}.yaml; do
    sed -i '' "s/%DOMAIN%/$1/g" $i
done

kubectl apply -k ../temp/resources
