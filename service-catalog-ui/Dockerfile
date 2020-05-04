# This Dockerfile must be execute with higher context, because firstly we have to create react components lib with local changes.
# If you want to build image without local changes of react components, delete 16 line of code.

# copying .env in 13 line is a temporary solution for issue with babel-loader package in react-scripts 

FROM node:12.16.0-alpine3.9 as ui-generator
ARG app_name=service-catalog-ui
WORKDIR /app

RUN apk update && apk upgrade && apk add --no-cache curl make bash 
# Copy licenses
# COPY licenses/ /app/licenses/

COPY . /app

RUN cd /app/${app_name} && make resolve 

RUN cd /app/${app_name} && make verify

# Set env variables
ENV PRODUCTION true
ENV CI true
ENV NODE_OPTIONS=--max_old_space_size=2048

# Build
RUN ls /app/${app_name}/brokers
RUN cd /app/${app_name}/brokers && npm run build
# RUN cd /app/${app_name}/catalog && npm run build
RUN ls /app/${app_name}/instances
RUN cat /app/${app_name}/instances/package-lock.json | grep styled-components-grid
RUN cd /app/${app_name}/instances && npm run build

### Main image ###
FROM alpine:3.11

### Install nginx package and remove cache ###
RUN apk add --update nginx && rm -rf /var/cache/apk/*

LABEL source git@github.com:kyma-project/console.git

COPY --from=ui-generator /app/${app_name}/brokers/build var/brokers-public
COPY --from=ui-generator /app/${app_name}/catalog/build var/catalog-public
COPY --from=ui-generator /app/${app_name}/instances/build var/instances-public
COPY --from=ui-generator /app/licenses/ /app/licenses/

RUN touch /var/run/nginx.pid && \
  chown -R nginx:nginx /var/run/nginx.pid

EXPOSE 8080 8081 8082

CMD ["nginx", "-g", "daemon off;"]