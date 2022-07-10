FROM node:14

# use env variables during docker-compose build 
# https://stackoverflow.com/questions/52429984/docker-compose-build-environment-variable
ARG GROCERY_CART_URL
ARG GROCERY_CART_TOKEN
ARG WEATHER_SERVICE_URL
ARG WEATHER_SERVICE_TOKEN
ARG TASKS_MANAGER_URL
ARG TASKS_MANAGER_TOKEN

ENV REACT_APP_GROCERY_CART_URL ${GROCERY_CART_URL}
ENV REACT_APP_GROCERY_CART_TOKEN ${GROCERY_CART_TOKEN}
ENV REACT_APP_WEATHER_SERVICE_URL ${WEATHER_SERVICE_URL}
ENV REACT_APP_WEATHER_SERVICE_TOKEN ${WEATHER_SERVICE_TOKEN}
ENV REACT_APP_TASKS_MANAGER_URL ${TASKS_MANAGER_URL}
ENV REACT_APP_TASKS_MANAGER_TOKEN ${TASKS_MANAGER_TOKEN}


# Create app directory
WORKDIR /usr/src/app

COPY server/package*.json ./

RUN npm install

COPY server/ .

RUN mkdir -p public/app

COPY client-development-app/ ./client-development-app

ENV PUBLIC_URL /app

RUN cd client-development-app && \
    npm install && \
    npm run build && \
    mv -v build/* ../public/app

RUN mkdir -p public/management

COPY client-development-management/ ./client-development-management

ENV PUBLIC_URL /management

RUN cd client-development-management && \
    npm install && \
    npm run build && \
    mv -v build/* ../public/management

EXPOSE 8910

CMD bash -c "npm start"
