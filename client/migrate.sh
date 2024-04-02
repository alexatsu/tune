#!/bin/sh
echo "running migration"
npx prisma migrate dev
echo "finished migration"
echo "starting container"
npm run dev
