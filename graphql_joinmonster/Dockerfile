# # Commented code is used for developing in container
# FROM node:20

# WORKDIR /server
# COPY ./package*.json ./
# RUN npm install --force

# EXPOSE 4000

FROM node:20-alpine

WORKDIR /server

COPY ./package*.json ./
COPY ./src ./
COPY ./tsconfig.json ./

RUN npm install --force && \
    npm run compile && \
    rm -rf ./src

EXPOSE 4000

ENTRYPOINT ["node", "./dist/index.js" ]
