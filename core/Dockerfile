### Main image ###
FROM nginx:1.14.0-alpine


COPY ./licenses/ /app/licenses/

### Copy the dist and nginx config into nginx ###
COPY ./dist /usr/share/nginx/html/
COPY ./nginx/conf.d /etc/nginx/conf.d/
COPY ./nginx/nginx.conf /etc/nginx/
COPY ./nginx/mime.types /etc/nginx/

RUN touch /var/run/nginx.pid && \
  chown -R nginx:nginx /var/run/nginx.pid && \
  chown -R nginx:nginx /var/cache/nginx

### Expose ports ###
EXPOSE 8080
USER nginx

LABEL source git@github.com:kyma-project/console.git

### Default command to run app ###
CMD ["nginx", "-g", "daemon off;"]
