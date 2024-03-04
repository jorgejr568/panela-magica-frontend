FROM node:lts-alpine3.19
WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install --frozen-lockfile --production --silent && yarn cache clean


COPY . .

RUN yarn build

EXPOSE 3000
CMD ["yarn", "start", "-p", "3000"]
