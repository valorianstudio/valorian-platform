# Build from the repository root:  docker build -f apps/api/Dockerfile -t valorian-api .
FROM node:22-slim AS build
WORKDIR /repo
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
RUN npm ci -w @valorian/api --include-workspace-root
COPY apps/api apps/api
RUN npm run build -w @valorian/api

FROM node:22-slim
WORKDIR /repo
ENV NODE_ENV=production
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*
COPY --from=build /repo/package.json /repo/package-lock.json ./
COPY --from=build /repo/node_modules node_modules
COPY --from=build /repo/apps/api apps/api
# Uploaded files live on a mounted volume, never inside the image.
RUN mkdir -p /data/uploads /data/private-uploads && chown -R node:node /data
ENV UPLOAD_DIR=/data/uploads PRIVATE_UPLOAD_DIR=/data/private-uploads
USER node
WORKDIR /repo/apps/api
EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD node -e "fetch('http://localhost:'+(process.env.PORT||4000)+'/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
# Migrations are a separate deploy step (npm run db:deploy). The app never migrates on boot.
CMD ["node", "dist/main.js"]
