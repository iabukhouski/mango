# Mango Client

# Build Docker Image
```sh
  docker build . \
    --tag mango-client
```

# Run Docker Image
```sh
  docker run \
    --interactive \
    --tty \
    --env NGINX_ENVSUBST_OUTPUT_DIR=/etc/nginx \
    --env API_SERVER_HOST=172.20.133.10 \
    --env API_SERVER_PORT=3000 \
    --env PORT=80 \
    --publish 8080:80 \
    mango-client
```

# Run Docker Image (Local)
```sh
  docker run \
    --volume $(pwd)/nginx.conf:/etc/nginx/templates/nginx.conf.template \
    --volume $(pwd)/build:/usr/share/nginx/html:ro \
    --interactive \
    --tty \
    --publish 8080:80 \
    --env PORT=80 \
    --env NGINX_ENVSUBST_OUTPUT_DIR=/etc/nginx \
    --env API_SERVER_HOST=172.20.133.10 \
    --env API_SERVER_PORT=3000 \
    nginx
```
