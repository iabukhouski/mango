if [ -f .env ]; then
  export $(echo $(cat .env | sed 's/#.*//g'| xargs) | envsubst)
fi

docker context use default

docker compose up \
  --environment MYSQL_DATABASE=${MYSQL_DATABASE} \
  --environment MYSQL_USER=${MYSQL_USER} \
  --environment MYSQL_PASSWORD=${MYSQL_PASSWORD} \
  --environment MYSQL_RANDOM_ROOT_PASSWORD=${MYSQL_RANDOM_ROOT_PASSWORD}
