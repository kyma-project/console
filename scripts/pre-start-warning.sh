#!/usr/bin/env bash

COL_NUM=`tput cols`

re='^[0-9]+$'
if ! [[ $COL_NUM =~ $re ]] ; then
   COL_NUM=100 #fallback in case `tput cols` didn't work
fi

VERTICAL_LINE=""
MESSAGE="Don't forget to run \`npm run bootstrap\`"
MESSAGE_LENGTH=${#MESSAGE}
MESSAGE_OFFSET=$(((((COL_NUM - 5) - MESSAGE_LENGTH) / 2) + (100 % 2 > 0)))


for i in $(seq 1 $COL_NUM)
do
    VERTICAL_LINE="$VERTICAL_LINE="
done


for i in $(seq 5 $COL_NUM)
do
    FULL_EMPTY_SPACE="$FULL_EMPTY_SPACE "
done

for i in $(seq 1 $MESSAGE_OFFSET)
do
    OFFSET_BEFORE="$OFFSET_BEFORE "
done



for i in $(seq $((MESSAGE_OFFSET + MESSAGE_LENGTH + 5)) $COL_NUM)
do
    OFFSET_AFTER="$OFFSET_AFTER "
done




echo $VERTICAL_LINE
echo "||$FULL_EMPTY_SPACE||"

echo "||$OFFSET_BEFORE$MESSAGE$OFFSET_AFTER||"

echo "||$FULL_EMPTY_SPACE||"
echo $VERTICAL_LINE