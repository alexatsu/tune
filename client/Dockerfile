FROM node:18-alpine

WORKDIR /app

COPY ./package.json ./
COPY ./pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install 

COPY ./prisma ./prisma
RUN pnpx prisma generate

WORKDIR /app/client/

ENV HOSTNAME "0.0.0.0"
CMD ["pnpm","run","dev"]
