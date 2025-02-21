FROM node:18.16.0-alpine3.17
RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY app/package.json .
COPY app/package-lock.json .
RUN npm install
COPY app/ .
EXPOSE 3000
CMD [ "npm", "start"]