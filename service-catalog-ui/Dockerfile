# This Dockerfile must be execute with higher context, because firstly we have to create react components lib with local changes.
# If you want to build image without local changes of react components, delete 16 line of code.

# copying .env in 13 line is a temporary solution for issue with babel-loader package in react-scripts 

FROM node:10.11.0-alpine as ui-generator

WORKDIR /app

COPY licenses/ /app/licenses/

RUN mkdir -p brokers && mkdir -p catalog && mkdir -p instances

# Install app dependencies
COPY package.json package-lock.json /app/

COPY brokers/package.json brokers/package-lock.json brokers/config-overrides.js /app/brokers/
COPY catalog/package.json catalog/package-lock.json catalog/config-overrides.js catalog/.env /app/catalog/
COPY instances/package.json instances/package-lock.json instances/config-overrides.js instances/.env /app/instances/

RUN npm install --no-optional --unsafe-perm

# Copy sources
COPY brokers/src /app/brokers/src
COPY catalog/src /app/catalog/src
COPY instances/src /app/instances/src
COPY brokers/public /app/brokers/public
COPY catalog/public /app/catalog/public
COPY instances/public /app/instances/public

# Copy local changes from react-components package
COPY react-components/index.js /app/brokers/node_modules/@kyma-project/react-components/lib/index.js
COPY react-components/index.js /app/catalog/node_modules/@kyma-project/react-components/lib/index.js
COPY react-components/index.js /app/instances/node_modules/@kyma-project/react-components/lib/index.js

# Set env variables 
ENV PRODUCTION true

# Test & Build
ENV CI true
RUN npm test
RUN npm run build

FROM nginx:1.14.0-alpine
LABEL source git@github.com:kyma-project/console.git

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=ui-generator /app/brokers/build var/brokers-public
COPY --from=ui-generator /app/catalog/build var/catalog-public
COPY --from=ui-generator /app/instances/build var/instances-public
COPY --from=ui-generator /app/licenses/ /app/licenses/

EXPOSE 8080 8081 8082

CMD ["nginx", "-g", "daemon off;"]