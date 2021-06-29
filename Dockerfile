FROM node:14-alpine

WORKDIR /app

COPY . .

RUN yarn

RUN yarn build

EXPOSE 3000

ENV NODE_ENV="production"

CMD [ "yarn", "start:prod" ]