FROM opensuse/tumbleweed

WORKDIR /app

RUN zypper -n install postgresql

COPY . . 

RUN ls -al
RUN zypper -n install nodejs npm
RUN npm install -g bun
RUN bun install

CMD [ "bun", "run", "dev" ]