FROM node:18-alpine
RUN addgroup -g 1001 -S appuser && adduser -u 1001 -S appuser -G appuser
WORKDIR /usr/src/app
COPY ./package.json .
RUN npm install
COPY dist/ /usr/src/app
RUN ls -l
USER appuser
EXPOSE 8080
CMD [ "npm", "start"]