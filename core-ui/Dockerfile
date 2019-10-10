# This Dockerfile must be execute with higher context, because firstly we have to create react components lib with local changes.
# If you want to build image without local changes of react components, delete 16 line of code.
FROM node:12.11.0-alpine as builder
ARG app_name=core-ui
WORKDIR /app

# Install global dependencies
RUN apk update && \
    apk upgrade && \
    apk add --no-cache curl make

# Install root and app dependencies
COPY . /app
RUN cd /app/${app_name} && \
    make resolve

# Set env variables
ENV PRODUCTION true
ENV CI true

# Test & Build
RUN cd /app/${app_name} && make build

FROM nginx:1.14.0-alpine
LABEL source git@github.com:kyma-project/console.git
ARG app_name=core-ui

COPY ./${app_name}/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/${app_name}/build var/public
COPY --from=builder /app/${app_name}/licenses/ /app/licenses/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]