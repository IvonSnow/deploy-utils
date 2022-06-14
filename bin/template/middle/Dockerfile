FROM node:16.15.0-alpine as builder

LABEL maintainer = "xueyunfeng<pinus0716@163.com>"
LABEL version="1.0"

WORKDIR /app

COPY ./qingyun-middle/package.json .
COPY ./qingyun-middle/yarn.lock    .
# 安装依赖
RUN yarn --registry https://registry.npm.taobao.org/

COPY ./qingyun-middle .
RUN yarn build

FROM nginx:alpine
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8000

CMD [ "nginx", "-g", "daemon off;" ]


