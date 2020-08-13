FROM node:alpine3.12

USER root
WORKDIR /usr/src/app

RUN apk add --no-cache curl chromium firefox-esr

COPY package*.json ./
RUN npm ci
LABEL source git@github.com:kyma-project/console.git
COPY . .
