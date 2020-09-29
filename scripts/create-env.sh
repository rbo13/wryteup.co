#!/bin/sh

cat << EOF > .env
APP_ENV='dev'
APP_PORT=9001
ENABLED_PREFORK='false'
DB_HOST='database'
POSTGRES_DB='wryteup_dev'
POSTGRES_USER='postgres'
POSTGRES_PASSWORD='postgres'
EOF

