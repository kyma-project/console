# This Dockerfile must be execute with higher context, because firstly we have to create react components lib with local changes.

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
COPY scripts/load-cluster-config.sh /app/scripts
COPY .clusterConfig.default /app/
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

FROM nginx:1.14.0-alpine
LABEL source git@github.com:kyma-project/console.git

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=ui-generator /app/logging/build var/public
COPY --from=ui-generator /app/licenses/ /app/licenses/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]