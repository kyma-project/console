# This Dockerfile must be execute with higher context, because firstly we have to create react components lib with local changes.
# If you want to build image without local changes of react components, delete 16 line of code.

FROM node:12.16.0-alpine3.9 as ui-generator

WORKDIR /app

# Copy licenses
COPY licenses/ /app/licenses/

# Install global dependencies
RUN apk update && apk upgrade && \
    apk add --no-cache curl

# Install root and app dependencies
COPY ./temp /app
RUN npm run bootstrap:prod

COPY package.json package-lock.json webpack-generateConfig.config.js jsconfig.json /app/compass/
RUN cd /app/compass && npm install --no-optional

# Copy sources
COPY ./src /app/compass/src
COPY ./public /app/compass/public
COPY ./public-luigi /app/compass/public-luigi

# Set env variables
ENV PRODUCTION true
ENV CI true

# Test & Build
RUN cd /app/compass && npm run buildConfig
RUN cd /app/compass && npm run build

### Main image ###
FROM alpine:3.11

### Install nginx package and remove cache ###
RUN apk add --update nginx && rm -rf /var/cache/apk/*

LABEL source git@github.com:kyma-project/console.git

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=ui-generator /app/compass/build var/public
COPY --from=ui-generator /app/compass/public-luigi var/public-luigi
COPY --from=ui-generator /app/licenses/ /app/licenses/

RUN touch /run/nginx/nginx.pid && \
  chown -R nginx:nginx /run/nginx/nginx.pid

EXPOSE 80 8888

CMD ["nginx", "-g", "daemon off;"]