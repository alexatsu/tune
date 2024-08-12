#!/bin/bash

# Apply migrations
npx prisma migrate dev

exec "$@"