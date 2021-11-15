if [ -f .env ]; then
  export $(echo $(cat .env | sed 's/#.*//g'| xargs) | envsubst)
fi

# Pushing Images to ACR, so ACI can use them
docker context use default

docker compose push

# Starting Containers in ACI
docker context use mango

docker compose up \
  --environment MYSQL_DATABASE=${MYSQL_DATABASE} \
  --environment MYSQL_USER=${MYSQL_USER} \
  --environment MYSQL_PASSWORD=${MYSQL_PASSWORD} \
  --environment MYSQL_RANDOM_ROOT_PASSWORD=${MYSQL_RANDOM_ROOT_PASSWORD}

docker ps
