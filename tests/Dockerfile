FROM cypress/browsers:node12.18.0-chrome83-ff77

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
LABEL source git@github.com:kyma-project/console.git
COPY . .
