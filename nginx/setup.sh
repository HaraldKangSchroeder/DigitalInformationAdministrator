#!/bin/bash

#https://www.youtube.com/watch?v=X3Pr5VATOyA
printf ${COUNTRY_NAME_2LETTER_CODE}"\n" >> /etc/ssl/input.txt
printf ${STATE_NAME}"\n" >> /etc/ssl/input.txt
printf ${CITY_NAME}"\n" >> /etc/ssl/input.txt
printf ${ORGANIZATION_NAME}"\n" >> /etc/ssl/input.txt
printf ${ORGANIZATION_UNIT_NAME}"\n" >> /etc/ssl/input.txt
printf ${SERVER_NAME}"\n" >> /etc/ssl/input.txt
printf ${EMAIL}"\n" >> /etc/ssl/input.txt
cat /etc/ssl/input.txt | openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/localhost.key -out /etc/ssl/localhost.crt

#https://docs.nginx.com/nginx/admin-guide/security-controls/configuring-http-basic-authentication/
mkdir -p  /etc/apache2/
htpasswd -b -c  /etc/apache2/.htpasswd ${AUTH_USERNAME} ${AUTH_PASSWORD}

exec "$@"

