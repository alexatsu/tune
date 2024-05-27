FROM opensuse/tumbleweed

WORKDIR /app

RUN zypper -n install postgresql

COPY . . 
RUN zypper -n install nodejs npm
RUN npm install -g bun
RUN bun install

# USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "dev" ]