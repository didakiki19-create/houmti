# 🚀 Guide de Déploiement et d'Hébergement Commercial - Hoomty

Ce guide contient l'ensemble des instructions, configurations et modules nécessaires pour héberger et exploiter l'application commerciale **Hoomty** en production.

---

## 📦 Fichiers et Modules Inclus pour l'Hébergement

| Fichier | Utilité |
| :--- | :--- |
| **`Dockerfile`** | Image de conteneur optimisée multi-stage (Node.js 20 Alpine). |
| **`docker-compose.yml`** | Déploiement orchestré en 1 commande avec vérification de santé (`healthcheck`). |
| **`.dockerignore`** | Exclusion des fichiers lourds et de développement lors du build. |
| **`ecosystem.config.cjs`** | Fichier de configuration PM2 pour cluster multi-cœurs sur serveur Linux (sans Docker). |
| **`nginx.conf.example`** | Reverse proxy Nginx avec SSL (HTTPS), compression Gzip et en-têtes de sécurité. |
| **`.env.example`** | Modèle des variables d'environnement. |
| **`server.ts`** | Serveur Full-Stack Express (API REST + Servitude statique du frontend Vite). |
| **`package.json`** | Scripts de build (`npm run build`) et de démarrage (`npm start`). |

---

## 🛠️ Prérequis Système
- **Node.js** : version `20.x` ou `22.x` LTS
- **NPM** : version `10.x` ou supérieure
- *(Optionnel mais recommandé)* : **Docker** et **Docker Compose**

---

## 🌐 Option 1 : Déploiement avec Docker & Docker Compose (Recommandé)

Cette méthode fonctionne sur n'importe quel serveur (VPS OVH, DigitalOcean, Hetzner, AWS, GCP, etc.).

### 1. Cloner ou transférer le projet sur votre serveur
```bash
git clone <votre-depot> hoomty
cd hoomty
```

### 2. Lancer l'application avec Docker Compose
```bash
docker compose up -d --build
```
L'application démarre automatiquement sur le port **3000** avec relance automatique en cas de plantage ou de redémarrage du serveur.

### 3. Commandes utiles
- Voir les logs : `docker compose logs -f`
- Arrêter : `docker compose down`
- Redémarrer : `docker compose restart`

---

## 🖥️ Option 2 : Déploiement direct sur VPS Linux (Ubuntu / Debian) avec PM2 & Nginx

Si vous préférez exécuter l'application directement sans conteneur Docker :

### 1. Installer Node.js et PM2
```bash
sudo apt update && sudo apt install -y curl nginx certbot python3-certbot-nginx
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

### 2. Installer les dépendances et compiler l'application
```bash
cd /var/www/hoomty
npm ci
npm run build
```

### 3. Démarrer avec PM2 (Mode Cluster Haute Disponibilité)
```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

### 4. Configurer Nginx et activer le HTTPS (SSL Let's Encrypt)
```bash
sudo cp nginx.conf.example /etc/nginx/sites-available/hoomty
# Modifiez 'votre-domaine.com' dans le fichier :
sudo nano /etc/nginx/sites-available/hoomty

sudo ln -s /etc/nginx/sites-available/hoomty /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Obtenir le certificat SSL gratuit :
sudo certbot --nginx -d votre-domaine.com -d www.votre-domaine.com
```

---

## ☁️ Option 3 : Déploiement sur PaaS Cloud (Render, Railway, Cloud Run)

L'application est prête pour les services Cloud modernes :
- **Google Cloud Run** : Détecte automatiquement le `Dockerfile` et déploie le conteneur sur le port 3000.
- **Render.com / Railway.app** :
  - **Build Command** : `npm ci && npm run build`
  - **Start Command** : `npm start`
  - **Port** : `3000`

---

## 🔍 Vérification du Fonctionnement
Une fois déployée, vous pouvez vérifier que l'API et le Frontend fonctionnent :
- **Page d'accueil** : `https://votre-domaine.com/`
- **Santé de l'API** : `https://votre-domaine.com/api/health`
  *(Réponse attendue : `{"status":"ok","app":"Hoomty API","version":"1.0.0",...}`)*
