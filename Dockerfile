FROM node:14

# use env variables during docker-compose build 
# https://stackoverflow.com/questions/52429984/docker-compose-build-environment-variable
ARG BASEPATH_APP
ARG BASEPATH_MANAGEMENT
ARG GROCERY_CART_URL
ARG GROCERY_CART_TOKEN
ARG WEATHER_PROVIDER_URL

ENV REACT_APP_BASEPATH_APP $BASEPATH_APP
ENV REACT_APP_BASEPATH_MANAGEMENT $BASEPATH_MANAGEMENT
ENV REACT_APP_GROCERY_CART_URL ${GROCERY_CART_URL}
ENV REACT_APP_WEATHER_PROVIDER_URL ${WEATHER_PROVIDER_URL}
ENV REACT_APP_GROCERY_CART_TOKEN ${GROCERY_CART_TOKEN}

# Create app directory
WORKDIR /usr/src/app

COPY server/package*.json ./

RUN npm install

COPY server/ .

RUN mkdir -p public${REACT_APP_BASEPATH_APP}

COPY client-development-app/ ./client-development-app

ENV PUBLIC_URL ${REACT_APP_BASEPATH_APP}

RUN cd client-development-app && \
    npm install && \
    npm run build && \
    mv -v build/* ../public${REACT_APP_BASEPATH_APP}

RUN mkdir -p public${REACT_APP_BASEPATH_MANAGEMENT}

COPY client-development-management/ ./client-development-management

ENV PUBLIC_URL ${REACT_APP_BASEPATH_MANAGEMENT}

RUN cd client-development-management && \
    npm install && \
    npm run build && \
    mv -v build/* ../public${REACT_APP_BASEPATH_MANAGEMENT}

EXPOSE 8910

CMD bash -c "npm start"
