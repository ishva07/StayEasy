FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY tsconfig.json ./
COPY tsconfig.seed.json ./
COPY src ./src
COPY public ./public

RUN npm run build
RUN npx tsc -p tsconfig.seed.json



FROM node:22-alpine AS production

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/public ./public

RUN mkdir -p uploads

EXPOSE 5000

CMD ["npm", "start"]