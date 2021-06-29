FROM node:14-alpine

RUN apk add --no-cache python3 py3-pip
RUN ln -sf python3 /usr/bin/python

WORKDIR /app

COPY . .

RUN yarn

RUN yarn build

EXPOSE 3000

ENV NODE_ENV="production"

CMD [ "yarn", "start:prod" ]