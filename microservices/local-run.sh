#!/bin/sh
trap 'killall' INT

killall() {
    trap '' INT TERM     # ignore INT and TERM while shutting down
    echo "**** Shutting down... ****"     # added double quotes
    kill -TERM 0         # fixed order, send TERM not INT
    wait
    echo DONE
}


echo "Starting the services..."
cwd=$(pwd)

export GOOGLE_APPLICATION_CREDENTIALS=$cwd/../google-application-auth.json
cd $cwd/users
python main.py > $cwd/logs/users.log 2>&1 &
cd $cwd/checkout
python main.py > $cwd/logs/checkout.log 2>&1 &
cd $cwd/catalog
python main.py > $cwd/logs/catalog.log 2>&1 &
cd $cwd/frontend
export REACT_APP_USERS_SERVICE_URL=http://localhost:8080 
export REACT_APP_CATALOG_SERVICE_URL=http://localhost:8081 
export REACT_APP_CHECKOUT_SERVICE_URL=http://localhost:8082

npm start