FROM node:20

WORKDIR /server

COPY ./package*.json ./

RUN npm install

EXPOSE 4000

CMD ["npm", "run", "generate:start"]