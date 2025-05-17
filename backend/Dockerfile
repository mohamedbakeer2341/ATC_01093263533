
FROM node:18-alpine


WORKDIR /usr/src/app


COPY package*.json ./

COPY .npmrc ./


RUN npm install


COPY . .


EXPOSE 8000


CMD [ "node", "src/index.js" ] 