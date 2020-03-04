### Main image ###
FROM alpine:3.11

### Install nginx package and remove cache ###
RUN apk add --update nginx && rm -rf /var/cache/apk/*

### Copy file ###
COPY ./dist /usr/share/nginx/html
COPY ./nginx /etc/nginx
COPY ./licenses/ /app/licenses/

### Expose ports ###
EXPOSE 80

LABEL source="git@github.com:kyma-project/console.git"
### Run app ###
CMD ["nginx", "-g", "daemon off;"]
