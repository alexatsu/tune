FROM node:18-alpine

WORKDIR /app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install 

COPY ./prisma/schema.prisma ./prisma/schema.prisma
RUN pnpx prisma generate

COPY . .
# don't forget to delete container then image 
# after installing new packages
# then rebuild it

CMD ["pnpm","run","dev"]