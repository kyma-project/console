# This Dockerfile must be execute with higher context, because firstly we have to create react components lib with local changes.
# If you want to build image without local changes of react components, delete 16 line of code.

FROM node:10.11.0-alpine as ui-generator

WORKDIR /app

COPY licenses/ /app/licenses/

# Install app dependencies
COPY package.json package-lock.json webpack-generateConfig.config.js /app/
RUN npm install --no-optional

# Copy sources
COPY src /app/src
COPY public /app/public
COPY public-luigi /app/public-luigi

# Copy local changes from react-components package
COPY react-components/index.js /app/node_modules/@kyma-project/react-components/lib/index.js

# Set env variables
ENV PRODUCTION true

RUN npm run buildConfig

# Test & Build
ENV CI true
RUN npm run build

FROM nginx:1.14.0-alpine
LABEL source git@github.com:kyma-project/console.git

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=ui-generator /app/build var/public
COPY --from=ui-generator /app/public-luigi var/public-luigi
COPY --from=ui-generator /app/licenses/ /app/licenses/

EXPOSE 80 8888

CMD ["nginx", "-g", "daemon off;"]