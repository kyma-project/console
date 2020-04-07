### Main image ###
FROM alpine:3.11

COPY ./licenses/ /app/licenses/

### Install nginx package and remove cache ###
RUN apk add --update nginx && rm -rf /var/cache/apk/*

### Copy the dist and nginx config into nginx ###
COPY ./dist /usr/share/nginx/html/
COPY ./nginx/conf.d /etc/nginx/conf.d/
COPY ./nginx/nginx.conf /etc/nginx/
COPY ./nginx/mime.types /etc/nginx/

RUN touch /var/run/nginx.pid && \
  chown -R nginx:nginx /var/run/nginx.pid

### Expose ports ###
EXPOSE 8080

LABEL source git@github.com:kyma-project/console.git

### Default command to run app ###
CMD ["nginx", "-g", "daemon off;"]
