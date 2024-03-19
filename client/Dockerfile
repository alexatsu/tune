FROM node:18-alpine

WORKDIR /app

COPY ./package.json ./
COPY ./pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install 

COPY ./prisma ./prisma
COPY ./migrate.sh ./migrate.sh


ENV HOSTNAME "0.0.0.0"

CMD ["sh","migrate.sh"] 
