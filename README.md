# StockAI Platform

Application Next.js SSR avec authentification sécurisée, sessions et persistance MongoDB. L'interface s'appuie exclusivement sur les composants Shadcn/Radix pour un rendu professionnel.

## Stack technique

- Next.js 15 (App Router, Server Components, sortie `standalone`)
- NextAuth (provider "Credentials" + sessions JWT sécurisées)
- MongoDB (connexion mutualisée avec driver officiel)
- Tailwind CSS 4 + Shadcn UI (design system Radix)
- Docker & docker-compose pour l'orchestration locale

## Pré-requis

1. Copier le fichier d'environnement et compléter les valeurs sensibles :
   ```bash
   cp .env.example .env
   # Modifier NEXTAUTH_SECRET avec une valeur robuste
   ```
2. Avoir Docker/Docker Compose installés pour l'exécution conteneurisée (facultatif mais recommandé).

## Lancer le projet

### Mode développement

```bash
npm install
npm run dev
```

L'application est disponible sur http://localhost:3000. Les redirections automatiques vous amènent vers `/login` ou `/dashboard` selon l'état de la session.

### Mode production via Docker

```bash
docker compose up --build
```

- `web` : build Next.js en production (mode standalone)
- `mongo` : MongoDB 7 avec volume persistant `mongo_data`

## Structure clés

- `src/app/(auth)` : pages d'authentification (login/register) + layout dédié
- `src/app/dashboard` : première page authentifiée, exemple de SSR avec session
- `src/app/api/auth` : routes API Next.js (NextAuth + inscription personnalisée)
- `src/components/auth` : formulaires et bouton de déconnexion basés sur Shadcn
- `src/lib` : configuration MongoDB, logique de sécurité, validations Zod

## Sécurité & bonnes pratiques

- Hash Argon2id (paramètres renforcés)
- Sessions JWT signées (NextAuth) avec cookie HTTP-only
- Validation stricte des formulaires (Zod + messages en français)
- Rate-limiting prêt à ajouter sur les routes API (structure déjà isolée)
- `poweredByHeader` désactivé et build `standalone` pour déploiement optimisé

## Observabilité

- Logs structurés JSON : `auth.signup`, `auth.login`, `auth.logout`, `auth.refresh`
- Métriques Prometheus exposées sur `GET /api/metrics`
  - `stock_ai_auth_login_success_total` / `stock_ai_auth_login_failure_total`
  - `stock_ai_auth_login_duration_seconds`
  - `stock_ai_auth_signup_success_total` / `stock_ai_auth_signup_failure_total`
  - `stock_ai_auth_active_sessions`
  - `stock_ai_auth_session_refresh_total`

## Prochaines étapes suggérées

- Ajouter des tests E2E/contract pour couvrir les parcours auth (objectif 80 %+ coverage service)
- Brancher la stack de monitoring externe (Grafana/Datadog) sur `/api/metrics`
- Étendre le dashboard avec les fonctionnalités métiers de StockAI
