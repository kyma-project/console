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
RUN cd /app/${app_name}/brokers && npm run build
RUN cd /app/${app_name}/catalog && npm run build
RUN cd /app/${app_name}/instances && npm run build
