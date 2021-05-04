FROM node:14

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8910

CMD TESTENV=${TESTENV} npm start