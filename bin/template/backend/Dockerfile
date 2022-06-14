FROM node:16.15.0-alpine as builder

LABEL name="backend-server"
LABEL maintainer = "xueyunfeng<pinus0716@163.com>"
LABEL version="1.0"

WORKDIR /app

COPY ./backend-service/package.json .
COPY ./backend-service/yarn.lock  .
RUN yarn --registry https://registry.npm.taobao.org/

COPY ./backend-service .
EXPOSE 7001

CMD yarn start

