#!/bin/sh
echo "running migration"
pnpx prisma migrate deploy
echo "finished migration"
echo "starting container"
pnpm run start
