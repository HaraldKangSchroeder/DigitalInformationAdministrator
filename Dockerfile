FROM node:14

# Create app directory
WORKDIR /usr/src/app

COPY Server/package*.json ./

RUN npm install

COPY Server/ .

RUN mkdir public

COPY client-development-app/ ./client-development-app

RUN cd client-development-app && \
    npm install && \
    npm run build && \
    mv build app && \
    mv app ../public/

COPY client-development-exercises-management/ ./client-development-exercises-management

RUN cd client-development-exercises-management && \
    npm install && \
    npm run build && \
    mv build management && \
    mv management ../public/

EXPOSE 8910

CMD bash -c "npm start"
