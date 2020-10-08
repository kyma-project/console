FROM node:12.16.0-alpine3.9 as builder
ARG app_name=core
WORKDIR /app

# Set env variables
ENV PRODUCTION true
ENV CI true
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Install global dependencies
RUN apk update && \
  apk upgrade && \
  apk add --no-cache curl make && \
  apk add chromium-browser

COPY . /app

RUN cd /app/${app_name} && \
  make resolve && \
  make verify && \
  make pull-licenses && \
  make build

### Main image ###
FROM alpine:3.12

### Install nginx package and remove cache ###
RUN apk add --update nginx && rm -rf /var/cache/apk/*

LABEL source git@github.com:kyma-project/console.git
ARG app_name=core

COPY ./${app_name}/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/${app_name}/dist /usr/share/nginx/html/
COPY --from=builder /app/${app_name}/licenses/ /app/licenses/
COPY --from=builder /app/${app_name}/nginx/conf.d /etc/nginx/conf.d/
COPY --from=builder /app/${app_name}/nginx/nginx.conf /etc/nginx/
COPY --from=builder /app/${app_name}/nginx/mime.types /etc/nginx/

RUN touch /var/run/nginx.pid && \
  chown -R nginx:nginx /var/run/nginx.pid

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
