# FROM node:8-alpine as build-env
# FROM gcr.io/cloud-builders/yarn:node-12.18.3 as build-env
FROM gcr.io/cloud-builders/yarn:node-8.12.0 as build-env
WORKDIR /app

# Install yarn and other dependencies via apk
# RUN apk update && apk add yarn python2 g++ make && rm -rf /var/cache/apk/*
# RUN npm view yarn versions

COPY . .
# RUN ls

WORKDIR resource
# RUN npm i caniuse-lite browserslist
# RUN yarn install

RUN node -v
# RUN npm install --save-dev @babel/plugin-proposal-class-static-block
RUN  yarn install
# RUN yarn add @babel/plugin-proposal-class-static-block
RUN  yarn run build


FROM nginx

RUN apt-get update && apt-get install -y inotify-tools

COPY --from=build-env /app/. /usr/share/nginx/html/frontend-client

WORKDIR /usr/share/nginx/html/

#COPY container/auto-reload-nginx.sh /
COPY --from=build-env /app/auto-reload-nginx.sh /

RUN chmod +x /auto-reload-nginx.sh

CMD ["/auto-reload-nginx.sh"]
