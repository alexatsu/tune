#!/bin/sh
echo "running migration"
pnpx prisma migrate dev
echo "finished migration"
echo "starting container"
pnpm run dev
