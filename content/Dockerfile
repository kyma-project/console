FROM node:12.16.0-alpine3.9 as builder
ARG app_name=content
WORKDIR /app

# # Install global dependencies
RUN apk update && \
  apk upgrade && \
  apk add --no-cache curl make 

RUN npm i -g typescript 

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
FROM alpine:3.12
ARG app_name=content

### Install nginx package and remove cache ###
RUN apk add --update nginx && rm -rf /var/cache/apk/*

LABEL source git@github.com:kyma-project/console.git

COPY ./${app_name}/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/${app_name}/build var/public
COPY --from=builder /app/${app_name}/licenses/ /app/licenses/

RUN touch /var/run/nginx.pid && \
  chown -R nginx:nginx /var/run/nginx.pid

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]