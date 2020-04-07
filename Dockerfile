FROM nginx

RUN apt-get update && apt-get install -y inotify-tools

COPY . /usr/share/nginx/html/frontend-client

WORKDIR /usr/share/nginx/html/

#COPY container/auto-reload-nginx.sh /
COPY ./auto-reload-nginx.sh /

RUN chmod +x /auto-reload-nginx.sh

CMD ["/auto-reload-nginx.sh"]
