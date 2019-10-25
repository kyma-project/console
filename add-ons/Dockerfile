FROM node:10.11.0-alpine as ui-generator

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
COPY package.json package-lock.json config-overrides.js /app/addons/
RUN cd /app/addons && npm install --no-optional

# Copy sources
COPY ./src /app/addons/src
COPY ./public /app/addons/public

# Set env variables 
ENV PRODUCTION true
ENV CI true

# Test & Build
RUN cd /app/addons && npm run build

FROM nginx:1.14.0-alpine
LABEL source git@github.com:kyma-project/console.git

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=ui-generator /app/addons/build var/public
COPY --from=ui-generator /app/licenses/ /app/licenses/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]