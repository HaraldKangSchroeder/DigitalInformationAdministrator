FROM nginx:latest

RUN apt-get update && apt-get install -y \
    nano \
    openssl \
    apache2-utils

COPY ./setup.sh /

RUN ["chmod", "+x", "./setup.sh"]

ENTRYPOINT ["./setup.sh"]

CMD ["nginx","-g","daemon off;"]