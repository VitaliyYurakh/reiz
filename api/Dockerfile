FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate resolve --rolled-back 20260325120000_set_mazda_cx5_coverage_rules 2>/dev/null; npx prisma migrate resolve --rolled-back 20260325140000_add_price_fixed_30 2>/dev/null; npx prisma migrate deploy; npx prisma db seed; npm run dev"]