FROM testcafe/testcafe:alpha

USER root
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
LABEL source git@github.com:kyma-project/console.git
COPY . .
RUN apk add curl
