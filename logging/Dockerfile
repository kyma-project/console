# This Dockerfile must be execute with higher context, because firstly we have to create react components lib with local changes.

FROM node:12.16.0-alpine3.9 as ui-generator

WORKDIR /app

# Copy licenses
COPY licenses/ /app/licenses/

# Install global dependencies
RUN apk update && apk upgrade && \
    apk add --no-cache curl && \
    apk add --no-cache bash

# Install root and app dependencies
COPY ./temp /app
RUN npm run bootstrap:prod
COPY package.json package-lock.json /app/logging/
RUN cd /app/logging && npm install --no-optional

# Copy sources
COPY ./src /app/logging/src
COPY ./public /app/logging/public

# Set env variables
ENV PRODUCTION true
ENV CI true

# Test & Build
#RUN cd /app/logging && npm run test:single
RUN cd /app/logging && npm run build

### Main image ###
FROM alpine:3.11

### Install nginx package and remove cache ###
RUN apk add --update nginx && rm -rf /var/cache/apk/*

LABEL source git@github.com:kyma-project/console.git

COPY nginx.conf /etc/nginx/
COPY --from=ui-generator /app/logging/build var/public
COPY --from=ui-generator /app/licenses/ /app/licenses/

RUN touch /var/run/nginx.pid && \
  chown -R nginx:nginx /var/run/nginx.pid

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]