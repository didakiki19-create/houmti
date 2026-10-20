# Guide de Configuration et Déploiement PostgreSQL pour Hoomty

Ce guide détaille pas-à-pas la mise en place de la base de données PostgreSQL sur **Neon**, son raccordement à **Vercel** et l'exécution des migrations et du seed reproductible.

---

## 1. Création de la base sur Neon (Cloud PostgreSQL Serverless)

1. Rendez-vous sur [neon.tech](https://neon.tech) et connectez-vous ou créez un compte gratuit.
2. Cliquez sur **"New Project"**.
3. Renseignez les informations du projet :
   - **Project Name** : `hoomty-db` (ou le nom de votre choix).
   - **Postgres Version** : Version 16 ou 17 (par défaut).
   - **Region** : Choisissez la région la plus proche de vos utilisateurs (ex: `Frankfurt (eu-central-1)` ou `Paris (europe-west9)`).
4. Cliquez sur **"Create project"**.

---

## 2. Récupération de la chaîne de connexion (Pooled vs Direct)

Neon fournit deux modes de connexion :
- **Pooled Connection (Recommandé pour Vercel / Serverless)** :
  Elle contient `-pooler` dans le nom d'hôte (ex: `ep-cool-fog-123456-pooler.eu-central-1.aws.neon.tech`). Ce mode utilise PgBouncer pour gérer les connexions courtes et sans état des fonctions serverless sans saturer le serveur.
- **Direct Connection** :
  Utilisée principalement pour les opérations DDL complexes ou les migrations lourdes.

Dans la console Neon :
1. Dans l'onglet **Dashboard**, sélectionnez la base (ex: `neondb`).
2. Assurez-vous que l'option **"Pooled connection"** est cochée.
3. Copiez l'URL de connexion complète. Elle a la forme suivante :
   ```
   postgresql://[user]:[password]@[neon-host]-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```

---

## 3. Configuration des variables d'environnement sur Vercel

Pour que votre déploiement Vercel se connecte à la base de données PostgreSQL Neon :

1. Ouvrez votre tableau de bord sur [vercel.com](https://vercel.com) et sélectionnez votre projet **Hoomty**.
2. Allez dans l'onglet **Settings** > **Environment Variables**.
3. Ajoutez la variable suivante :
   - **Key** : `DATABASE_URL`
   - **Value** : Votre chaîne de connexion Neon (avec pooler et `sslmode=require`).
   - **Environments** : Cochez **Production**, **Preview**, et **Development**.
4. Cliquez sur **Save**.
5. Redéployez votre projet ou déclenchez un nouveau commit pour que la variable soit prise en compte par les fonctions Vercel.

---

## 4. Configuration locale (`.env`)

Créez ou modifiez le fichier `.env` à la racine du projet :

```env
DATABASE_URL="postgresql://[user]:[password]@[neon-host]-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require"
NODE_ENV=development
```

---

## 5. Exécution des migrations (Drizzle ORM)

Les migrations créent l'ensemble des tables relationnelles, index et clés étrangères garantissant l'intégrité référentielle.

### Générer une nouvelle migration (si le schéma change) :
```bash
npm run db:generate
```

### Appliquer les migrations sur la base PostgreSQL :
```bash
npm run db:migrate
```

*(Option alternative pour synchroniser directement le schéma en développement)* :
```bash
npm run db:push
```

---

## 6. Exécution du Seed reproductible (Idempotent)

Le script de seed injecte les boutiques locales, les produits avec prix décimaux précis, les actualités de quartier, les services de proximité, les signalements citoyens et un compte utilisateur démo.

Le seed est **idempotent** : vous pouvez l'exécuter plusieurs fois sans créer de doublons grâce aux clauses `ON CONFLICT DO UPDATE` et `ON CONFLICT DO NOTHING`.

```bash
npm run db:seed
```

---

## 7. Vérification du bon fonctionnement de l'API

### 7.1. Health Check
Effectuez une requête vers le endpoint de santé :
```bash
curl http://localhost:3000/api/health
```
**Réponse attendue avec PostgreSQL connecté :**
```json
{
  "status": "ok",
  "app": "Hoomty API",
  "database": "connected",
  "latencyMs": 42,
  "timestamp": "2026-03-15T12:00:00.000Z"
}
```

### 7.2. Récupération des boutiques
```bash
curl http://localhost:3000/api/stores
```

### 7.3. Test de transaction sur commande
Effectuez une commande via `POST /api/orders` :
L'API exécute une transaction PostgreSQL ACID :
1. Insertion de la commande dans la table `orders`.
2. Insertion des lignes avec snapshot du prix unitaire dans `order_items`.
3. Décrémentation atomique du stock dans `products`.
4. Crédit des points de fidélité dans `loyalty_transactions` et mise à jour du solde utilisateur.

---

## 8. Interface d'administration visuelle (Drizzle Studio)

Pour inspecter ou administrer vos tables graphiquement en local :
```bash
npm run db:studio
```
L'interface s'ouvre sur `https://local.drizzle.studio`.

---

## 9. Structure des Tables PostgreSQL

| Table | Rôle | Clé primaire | Clés étrangères |
| :--- | :--- | :--- | :--- |
| `users` | Comptes utilisateurs, profils & solde de points | `id` (VARCHAR) | - |
| `addresses` | Adresses de livraison enregistrées des habitants | `id` (VARCHAR) | `user_id` -> `users(id)` ON DELETE CASCADE |
| `stores` | Commerces de quartier (épiceries, boulangeries...) | `id` (VARCHAR) | - |
| `products` | Catalogue articles avec prix décimal précis (DZD) | `id` (VARCHAR) | `store_id` -> `stores(id)` ON DELETE CASCADE |
| `orders` | Commandes passées avec adresses snapshotées | `id` (VARCHAR) | `user_id` -> `users(id)`, `store_id` -> `stores(id)` |
| `order_items` | Lignes de commande avec snapshot du prix unitaire | `id` (VARCHAR) | `order_id` -> `orders(id)` ON DELETE CASCADE, `product_id` -> `products(id)` |
| `community_news` | Fil d'actualités et alertes de quartier | `id` (VARCHAR) | - |
| `community_services` | Annuaire d'artisans et services locaux | `id` (VARCHAR) | - |
| `citizen_reports` | Signalements citoyens avec coordonnées GPS | `id` (VARCHAR) | - |
| `loyalty_transactions` | Journal d'audit des points de fidélité | `id` (VARCHAR) | `user_id` -> `users(id)`, `order_id` -> `orders(id)` |
