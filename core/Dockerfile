FROM eu.gcr.io/kyma-project/prow/test-infra/buildpack-node-chromium:v20181207-d46c013 as builder
ARG app_name=core
WORKDIR /app

# Set env variables
ENV PRODUCTION true
ENV CI true

COPY . /app

RUN cd /app/${app_name} && \
  make resolve && \
  make verify && \
  make pull-licenses && \
  make build

### Main image ###
FROM alpine:3.12

### Install nginx package and remove cache ###
RUN apk update && apk add openssl curl ca-certificates
RUN printf "%s%s%s\n" \
    "http://nginx.org/packages/mainline/alpine/v" \
    `egrep -o '^[0-9]+\.[0-9]+' /etc/alpine-release` \
    "/main" \
    | sudo tee -a /etc/apk/repositories
RUN curl -o /tmp/nginx_signing.rsa.pub https://nginx.org/keys/nginx_signing.rsa.pub
RUN openssl rsa -pubin -in /tmp/nginx_signing.rsa.pub -text -noout
RUN mv /tmp/nginx_signing.rsa.pub /etc/apk/keys/
RUN apk add nginx=1.19.1 && rm -rf /var/cache/apk/*

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
