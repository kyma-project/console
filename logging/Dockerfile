# This Dockerfile must be execute with higher context, because firstly we have to create react components lib with local changes.
FROM alpine:3.13 AS builder
# install node
RUN apk add --update nodejs npm --repository=http://dl-cdn.alpinelinux.org/alpine/edge/main

ARG app_name=logging
WORKDIR /app

# # Install global dependencies
RUN apk update && \
  apk upgrade && \
  apk add --no-cache curl make

# Install root and app dependencies
COPY . /app
RUN cd /app/${app_name} && make resolve 

RUN cd /app/${app_name} && make verify

# Set env variables
ENV PRODUCTION true
ENV CI true

# Test & Build
RUN cd /app/${app_name} && make build

### Main image ###
FROM eu.gcr.io/kyma-project/incubator/console-nginx:f4976fad

ARG app_name=logging

COPY ./${app_name}/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/${app_name}/build var/public
COPY --from=builder /app/${app_name}/licenses/ /app/licenses/

RUN touch /var/run/nginx.pid && \
  chown -R nginx:nginx /var/run/nginx.pid

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]