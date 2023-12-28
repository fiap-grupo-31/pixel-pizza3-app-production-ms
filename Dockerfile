FROM node:18-alpine
WORKDIR /usr/src/app
COPY ./package.json .
RUN npm install
COPY dist/ /usr/src/app
RUN ls -l
EXPOSE 8080
CMD [ "npm", "start"]