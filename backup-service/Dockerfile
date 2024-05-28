FROM opensuse/tumbleweed

WORKDIR /app

RUN zypper -n install postgresql

COPY . . 

WORKDIR /app/backup-service
RUN ls -al
RUN zypper -n install nodejs npm
# RUN npm install -g bun
RUN npm install
RUN npm run build 
# RUN bun install

# USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "node",  "dist/main.js" ]