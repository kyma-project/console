FROM cypress/included:3.2.0

USER root
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
LABEL source git@github.com:kyma-project/console.git
COPY . .
