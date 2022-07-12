FROM node:16.15.0-alpine as builder

LABEL maintainer = "xueyunfeng<pinus0716@163.com>"

WORKDIR /app

COPY ./web-home/package.json .
COPY ./web-home/yarn.lock .
# 安装依赖
RUN yarn --registry https://registry.npm.taobao.org/


COPY ./web-home .
RUN yarn build

# 设置nginx镜像
FROM nginx:alpine
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 3001

CMD [ "nginx", "-g", "daemon off;" ]


