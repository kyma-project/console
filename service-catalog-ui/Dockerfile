# This Dockerfile must be execute with higher context, because firstly we have to create react components lib with local changes.
# If you want to build image without local changes of react components, delete 16 line of code.

# copying .env in 13 line is a temporary solution for issue with babel-loader package in react-scripts 

FROM node:10.11.0-alpine as ui-generator

WORKDIR /app

COPY licenses/ /app/licenses/

RUN mkdir -p brokers && mkdir -p catalog && mkdir -p instances

# Install app dependencies
COPY ./temp /app
RUN npm install --only=prod

COPY package.json package-lock.json /app/service-catalog/
COPY brokers/package.json brokers/package-lock.json brokers/config-overrides.js /app/service-catalog/brokers/
COPY catalog/package.json catalog/package-lock.json catalog/config-overrides.js catalog/.env /app/service-catalog/catalog/
COPY instances/package.json instances/package-lock.json instances/config-overrides.js instances/.env /app/service-catalog/instances/
RUN cd /app/service-catalog && npm install --no-optional --unsafe-perm

RUN npm install --no-optional --unsafe-perm

# Copy sources
COPY brokers/src /app/service-catalog/brokers/src
COPY brokers/public /app/service-catalog/brokers/public

COPY catalog/src /app/service-catalog/catalog/src
COPY catalog/public /app/service-catalog/catalog/public

COPY instances/src /app/service-catalog/instances/src
COPY instances/public /app/service-catalog/instances/public

# Copy local changes from react-components package
COPY react-components/index.js /app/service-catalog/brokers/node_modules/@kyma-project/react-components/lib/index.js
COPY react-components/index.js /app/service-catalog/catalog/node_modules/@kyma-project/react-components/lib/index.js
COPY react-components/index.js /app/service-catalog/instances/node_modules/@kyma-project/react-components/lib/index.js

# Set env variables 
ENV PRODUCTION true

# Build
ENV CI true
RUN cd /app/service-catalog && npm run build

FROM nginx:1.14.0-alpine
LABEL source git@github.com:kyma-project/console.git

COPY --from=ui-generator /app/service-catalog/brokers/build var/brokers-public
COPY --from=ui-generator /app/service-catalog/catalog/build var/catalog-public
COPY --from=ui-generator /app/service-catalog/instances/build var/instances-public
COPY --from=ui-generator /app/licenses/ /app/licenses/

EXPOSE 8080 8081 8082

CMD ["nginx", "-g", "daemon off;"]