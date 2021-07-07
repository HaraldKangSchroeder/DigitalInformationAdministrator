FROM node:14

# use env variables during docker-compose build 
# https://stackoverflow.com/questions/52429984/docker-compose-build-environment-variable
ARG REACT_APP_BASEPATH_APP
ARG REACT_APP_BASEPATH_MANAGEMENT
ARG SOCKET_PATH

ENV REACT_APP_BASEPATH_APP $REACT_APP_BASEPATH_APP
ENV REACT_APP_BASEPATH_MANAGEMENT $REACT_APP_BASEPATH_MANAGEMENT
ENV REACT_APP_SOCKET_PATH $SOCKET_PATH

# Create app directory
WORKDIR /usr/src/app

COPY Server/package*.json ./

RUN npm install

COPY Server/ .

RUN mkdir -p public${REACT_APP_BASEPATH_APP}

COPY client-development-app/ ./client-development-app

ENV PUBLIC_URL ${REACT_APP_BASEPATH_APP}

RUN cd client-development-app && \
    npm install && \
    npm run build && \
    mv -v build/* ../public${REACT_APP_BASEPATH_APP}

RUN mkdir -p public${REACT_APP_BASEPATH_MANAGEMENT}

COPY client-development-exercises-management/ ./client-development-exercises-management

ENV PUBLIC_URL ${REACT_APP_BASEPATH_MANAGEMENT}

RUN cd client-development-exercises-management && \
    npm install && \
    npm run build && \
    mv -v build/* ../public${REACT_APP_BASEPATH_MANAGEMENT}

EXPOSE 8910

CMD bash -c "npm start"
