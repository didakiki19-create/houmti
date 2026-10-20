# Étape 1 : Construction (Builder)
FROM node:20-alpine AS builder

WORKDIR /app

# Copie des fichiers de configuration et dépendances
COPY package*.json ./
RUN npm ci

# Copie du code source complet
COPY . .

# Compilation du frontend (Vite) et du backend (esbuild -> dist/server.cjs)
RUN npm run build

# Étape 2 : Image de production optimisée
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Installation des dépendances de production uniquement
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copie des builds (frontend + backend compilé)
COPY --from=builder /app/dist ./dist

# Port d'écoute du serveur
EXPOSE 3000

# Démarrage du serveur Full-Stack
CMD ["node", "dist/server.cjs"]
