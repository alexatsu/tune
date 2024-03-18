FROM node:18-alpine

WORKDIR /app

COPY ./client/package.json ./
COPY ./client/pnpm-lock.yaml ./
COPY ./client ./

RUN npm install -g pnpm
RUN pnpm install 

COPY ./client/prisma ./prisma
RUN pnpx prisma generate
RUN pnpm run build;

WORKDIR /app/client/

ENV HOSTNAME "0.0.0.0"
# CMD ["pnpm","run","start"]
CMD ["pnpm","run","dev"]
# CMD ["sh","migrate.sh"] 
