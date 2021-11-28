FROM node:14-alpine
# app directory
WORKDIR /usr/movieapp
# install dependencies
COPY package*.json ./
RUN yarn install
# Bundle app source
COPY . .
# port binding
EXPOSE 3001
# run
CMD [ "node", "./src/index.js" ]
