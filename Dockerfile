FROM node:18.20-alpine

WORKDIR /app
COPY ./ /app

RUN apk update \
 && apk add git openssh-client

RUN yarn install
RUN yarn build
CMD yarn prod
