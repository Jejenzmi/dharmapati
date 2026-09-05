# Basis Debian agar OpenSSL yang dibutuhkan Prisma tersedia
FROM node:22-bookworm-slim AS dasar
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates curl \
    && rm -rf /var/lib/apt/lists/*

FROM dasar AS pemasangan
COPY package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund && npm i tsx@^4.19.2 --no-audit --no-fund

FROM dasar AS jalan
ENV NODE_ENV=production
COPY --from=pemasangan /app/node_modules ./node_modules
COPY package*.json ./
COPY prisma ./prisma
COPY src ./src
COPY masuk.sh ./masuk.sh
RUN npx prisma generate && chmod +x masuk.sh
EXPOSE 5041
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=5 \
  CMD curl -fsS http://127.0.0.1:5041/sehat || exit 1
CMD ["./masuk.sh"]
