#!/bin/sh
GIT_CHANGE_LOG=$(git log --pretty="$GIT_LOG_FORMAT" 		
$LAST_SUCCESS_REV..HEAD)
echo "GIT_CHANGE_LOG=$(git log --no-merges --	
pretty="$GIT_LOG_FORMAT" $LAST_SUCCESS_REV..HEAD | while 	
read line
do
echo $line\\\\n | tr -d \n
done)" > env_vars