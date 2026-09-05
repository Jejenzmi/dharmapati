FROM node:22-bookworm-slim AS dasar
WORKDIR /app

FROM dasar AS pemasangan
COPY package*.json ./
RUN npm ci --no-audit --no-fund

FROM dasar AS pembangun
ARG NEXT_PUBLIC_SITE_URL=https://dharmapati.co.id
ARG NEXT_PUBLIC_API_URL=https://dharmapati.co.id
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_TELEMETRY_DISABLED=1
COPY --from=pemasangan /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM dasar AS jalan
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*
COPY --from=pembangun /app/public ./public
COPY --from=pembangun /app/.next/standalone ./
COPY --from=pembangun /app/.next/static ./.next/static
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=5 \
  CMD curl -fsS http://127.0.0.1:3000/ >/dev/null || exit 1
CMD ["node", "server.js"]
