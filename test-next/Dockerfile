FROM node:18-alpine

WORKDIR /app

COPY ./test-next/package.json ./
COPY ./test-next/pnpm-lock.yaml ./
COPY ./test-next ./

RUN npm install -g pnpm
RUN pnpm install 

# COPY ./test-next/prisma ./prisma
# RUN pnpx prisma generate
RUN pnpm run build;

WORKDIR /app/client/

ENV HOSTNAME "0.0.0.0"
CMD ["pnpm","run","start"]
# CMD ["pnpm","run","dev"]
# CMD ["sh","migrate.sh"] 


# add volume to music service
# bootstrap new next app and add a secret
# then try to dockerize next without standalone prop, no matter how big image will be
# deploy