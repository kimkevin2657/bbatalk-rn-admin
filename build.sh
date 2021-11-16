#!/bin/sh

# PATH Setting
NOPEOPLE_PATH=/home/ec2-user/nopeople
WEB_PATH=$NOPEOPLE_PATH/web
SERVER_PATH=$NOPEOPLE_PATH/server
WEB_DIST_PATH=$WEB_PATH/dist/spa
SERVER_DIST_PATH=$SERVER_PATH/dist
SERVER_DOC_GRAPHQL=$SERVER_PATH/doc/graphql

#Site Setting
SITE_PATH=https://ffaso.com
GRAPHQL_PATH=$SITE_PATH/graphql

# git pull
cd $NOPEOPLE_PATH && git pull

# node server shutdown
#PID=`ps -ef | grep node | grep index | awk '{ print $2 }'`
#kill -2 $PID

# mongodb start (Only if mongodb process is dead)
DB_PID=`ps -ef | grep mongod | grep -v grep | awk '{ print $2 }'`
if [ "$DB_PID" == "" ]; then
cd $SERVER_PATH
#mongod --dbpath data --fork --logpath logs/mongodb.log --logappend --bind_ip=0.0.0.0
npm run mongo:linux
else
        echo "MongoDB is already running"
        echo "Process ID : $DB_PID"
fi

cd $SERVER_PATH

pm2 stop all
npm ci
pm2 start config/pm2.config.js
pm2 save

# GraphqlDoc Create
npx graphqldoc -f -e $GRAPHQL_PATH -o $SERVER_DOC_GRAPHQL

#forever stop ffaso
#npm install
#NODE_ENV=production forever --id "ffaso" start index.js

