# Footynet – Frontend

Next.js 15 (App Router) + React 19 + TypeScript frontend for Footynet. See the [main README](../README.md) for the project overview, architecture and backend setup.

## Setup

```bash
cp .env.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:5067/api
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run check:i18n` | Checks that `hr.json` and `en.json` have the same keys and that every key used in the code exists |

## Structure

```
app/          # Routes: player/, club/, admin/, messages/, auth and legal pages
components/   # Shared UI components (landing/, legal/, admin/)
contexts/     # AuthContext, ChatContext (SignalR connection)
hooks/        # useFetch, useLogout
i18n/         # next-intl setup (hr default, en)
lib/          # Axios API clients per area
messages/     # Translations: hr.json, en.json
types/        # Shared TypeScript types
```
