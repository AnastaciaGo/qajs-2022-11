FROM node:alpine as build-stage

COPY . .
RUN npm install

CMD ["npm", "test"]