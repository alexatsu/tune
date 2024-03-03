FROM node:21-alpine3.18

WORKDIR /app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install 

COPY ./prisma ./prisma
RUN pnpx prisma generate

COPY . .
# don't forget to delete container then image 
# after installing new packages
# then rebuild it

ENV HOSTNAME "0.0.0.0"

# CMD ["pnpm","run","dev"]
CMD ["sh","migrate.sh"] 
#run this when clean insall/no data in volumes