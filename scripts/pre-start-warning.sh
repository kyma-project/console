#!/bin/zsh

#============ EDIT ZONE ============
MESSAGE_PREFIX="Don't forget to run"
MESSAGE_COMMAND="npm run bootstrap"
#===================================


COL_NUM=`tput cols`
COLORS=`tput colors`
COLOR_FRAME="\e[31m"
COLOR_MESSAGE="\e[92m"

isNumber='^[0-9]+$'
if ! [[ $COL_NUM =~ $isNumber ]] ; then
   COL_NUM=100 #fallback in case `tput cols` didn't work
fi

if ! [[ $COLORS =~ $isNumber ]] ; then
   COLORS=0 #fallback in case colors are not supported
   COLOR_FRAME=""
   COLOR_MESSAGE=""
fi



PREFIX_LENGTH=${#MESSAGE_PREFIX} 
COMMAND_LENGTH=${#MESSAGE_COMMAND} 

MESSAGE="$COLOR_MESSAGE $MESSAGE_PREFIX \e[1m$MESSAGE_COMMAND\e[0m$COLOR_FRAME"

INVISIBLE_CHARS_OFFSET=2
MESSAGE_LENGTH=$((PREFIX_LENGTH + COMMAND_LENGTH + $INVISIBLE_CHARS_OFFSET))
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




echo -e "$COLOR_FRAME$VERTICAL_LINE"
echo -e "||$FULL_EMPTY_SPACE||"

echo -e "||$OFFSET_BEFORE$MESSAGE$OFFSET_AFTER||"

echo -e "||$FULL_EMPTY_SPACE||"
echo -e "$COLOR_FRAME$VERTICAL_LINE"

