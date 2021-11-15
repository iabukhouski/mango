docker run \
  --volume $(pwd)/nginx.conf:/etc/nginx/templates/nginx.conf.template \
  --volume $(pwd)/src:/usr/share/nginx/html:ro \
  --env-file .env \
  --env NGINX_ENVSUBST_OUTPUT_DIR=/etc/nginx \
  --detach \
  --publish 8080:80 \
  nginx
