# This Dockerfile must be execute with higher context, because firstly we have to create react components lib with local changes.
# If you want to build image without local changes of react components, delete 16 line of code.

FROM node:10.11.0-alpine as ui-generator

WORKDIR /app

# Copy licenses
COPY licenses/ /app/licenses/

# Install global dependencies
RUN apk update && apk upgrade && \
    apk add --no-cache curl

# Install root and app dependencies
COPY ./temp /app
RUN npm run bootstrap:prod
COPY package.json package-lock.json webpack-generateConfig.config.js /app/logging/
RUN cd /app/logging && npm install --no-optional

# Copy sources
COPY ./src /app/logging/src
COPY ./public /app/logging/public
COPY ./public-luigi /app/logging/public-luigi

# Set env variables
ENV PRODUCTION true
ENV CI true

# Test & Build
RUN cd /app/logging && npm run buildConfig
RUN cd /app/logging && npm test
RUN cd /app/logging && npm run build

FROM nginx:1.14.0-alpine
LABEL source git@github.com:kyma-project/console.git

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=ui-generator /app/logging/build var/public
COPY --from=ui-generator /app/logging/public-luigi var/public-luigi
COPY --from=ui-generator /app/licenses/ /app/licenses/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]