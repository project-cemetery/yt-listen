FROM node:14-alpine

apk add --no-cache python3 py3-pip

WORKDIR /app

COPY . .

RUN yarn

RUN yarn build

EXPOSE 3000

ENV NODE_ENV="production"

CMD [ "yarn", "start:prod" ]