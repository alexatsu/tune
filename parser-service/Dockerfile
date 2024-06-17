FROM node:18-alpine

WORKDIR /app

COPY . .

RUN npm install -g pnpm

RUN pnpm install

CMD [ "pnpm", "run", "dev" ]