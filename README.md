# Footynet

[![CI/CD](https://github.com/rknezevic/Footynet/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/rknezevic/Footynet/actions/workflows/ci-cd.yml)
![.NET 8](https://img.shields.io/badge/.NET-8-512BD4?logo=dotnet&logoColor=white)
![Next.js 15](https://img.shields.io/badge/Next.js-15-000000?logo=nextdotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)

**Footynet connects football players and clubs in Croatia's lower leagues (4th tier and below).** Clubs post ads for the positions they need to fill. Players apply with their profile and a cover letter. Once a club accepts an application, the two sides can talk in a real-time chat.

I built it as my graduation thesis and kept developing it into a deployed full-stack app: an ASP.NET Core Web API, a Next.js frontend, PostgreSQL, Docker and a GitHub Actions CI/CD pipeline.

<!-- TODO: add the live demo link here, e.g.  **Live demo:** https://...  -->
https://footynet-ten.vercel.app/
<!-- TODO: add 2–4 screenshots (landing page, job ads, chat, admin dashboard), e.g.
![Job ads](docs/screenshots/job-ads.png)
-->

---

## Features

**Players**
- Profile with photo, multiple positions, preferred foot, availability status and career history
- Browse open job ads and filter by position, league or keyword
- Apply with a cover letter, track application status, withdraw an application

**Clubs**
- Club profile with crest, league and county
- Create, edit, close and reopen job ads
- Review applicants' profiles, then accept or reject them
- Message players whose applications were accepted

**Admins**
- Dashboard with platform statistics
- Approve or reject club registrations (clubs can't post ads until they are approved)
- Deactivate and reactivate users, remove job ads

**Across the whole platform**
- Real-time chat with read receipts and an unread counter
- Email confirmation, password reset, and email alerts about new messages while the user is offline
- Fully bilingual, Croatian and English, in both the UI and the API's error messages
- City autocomplete through the Mapbox Search API
- Legal pages (terms of use, privacy policy) and account deletion

## Tech stack

| Layer | Technologies |
|---|---|
| Backend | ASP.NET Core 8 Web API, C#, Entity Framework Core 8, Dapper, FluentValidation, SignalR, Serilog, MailKit |
| Frontend | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, next-intl, Axios, SignalR client |
| Database | PostgreSQL (EF Core code-first migrations) |
| Auth | JWT bearer tokens, role-based authorization (Player / Club / Admin), BCrypt password hashing |
| Testing | xUnit, Moq |
| DevOps | Docker (multi-stage build), GitHub Actions, Render (API), Vercel (frontend) |

## Architecture

```
┌──────────────────────┐   REST (JSON)    ┌──────────────────────────┐        ┌────────────┐
│  footynet-frontend   │ ───────────────▶ │  Footynet.WebApi         │ ─────▶ │ PostgreSQL │
│  Next.js / React     │ ◀─────────────── │  ASP.NET Core 8          │        └────────────┘
│                      │   SignalR (WS)   │                          │ ─────▶ SMTP (Brevo)
└──────────────────────┘                  └──────────────────────────┘ ─────▶ Mapbox API
```

The backend is a layered solution: **Controller → Service → Repository → Data**.

| Project | Responsibility |
|---|---|
| `Footynet.WebApi` | Controllers, SignalR hub, validators, middleware, rate limiting, email sending |
| `Footynet.Service` | Business logic, JWT issuing |
| `Footynet.Repository` | Data access with EF Core and hand-written SQL through Dapper |
| `Footynet.Data` | `DbContext`, migrations, seed data |
| `Footynet.Model` | Entities, DTOs, localized messages (`.resx`) |
| `Footynet.Tests` | Unit tests |

## Implementation highlights

- **Real-time messaging.** The SignalR hub only pushes events. Sending a message goes through a normal REST endpoint, so validation and persistence work like the rest of the API. Browsers can't set headers on WebSockets, so the JWT is accepted from the query string, but only on the hub path. A presence tracker records who is online. A user who is offline gets an email about a new message, at most once every 30 minutes.
- **Background email queue.** Emails go through a queue processed by a hosted service, so requests don't wait on SMTP. In development, when no SMTP host is configured, emails are written to the log instead.
- **Security hardening.**
  - Per-IP rate limits: 10 requests/min on auth endpoints, 5 per 15 min on endpoints that send email.
  - `X-Forwarded-For` handling that a client can't spoof.
  - Security headers and a CSP on both the API and the frontend.
  - Uploaded photos are checked by their actual bytes, not by file name or declared type.
- **Localization end to end.** The frontend sends `Accept-Language`. The API returns errors in a consistent `{ status, message, code }` shape with translated messages. A CI step fails the build if the Croatian and English translation files get out of sync.
- **Data model.** Players, clubs and admins share one users table (TPH inheritance). Lookup data, all 21 Croatian counties and 80+ leagues from the 4th tier down, is seeded through migrations with fixed IDs. Migrations run automatically on startup.
- **Container fix.** The API's .NET container crashed on the hosting platform with exit code 139. The cause was W^X memory protection in the sandboxed runtime, and the fix is documented in the [Dockerfile](Footynet/Dockerfile).

## Getting started

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 20+](https://nodejs.org/)
- PostgreSQL, either installed locally or in Docker:

```bash
docker run --name footynet-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:16
```

### Backend

```bash
cd Footynet/Footynet
cp appsettings.Example.json appsettings.json
```

Fill in `appsettings.json` (see [Configuration](#configuration)), then run:

```bash
dotnet run --launch-profile http
```

The API starts on `http://localhost:5067` and opens Swagger UI at `/swagger`. On startup it applies all migrations and creates the admin account from `AdminSeed`.

### Frontend

```bash
cd footynet-frontend
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Tests and checks

```bash
cd Footynet
dotnet test
```

```bash
cd footynet-frontend
npm run lint
npm run check:i18n
```

## Configuration

The backend reads `appsettings.json` locally and environment variables in production. In environment variable names, `:` becomes `__`, for example `Jwt__Key`.

| Key | Description |
|---|---|
| `ConnectionStrings:DefaultConnection` | PostgreSQL connection string |
| `Jwt:Key` | Secret used to sign tokens, at least 32 characters |
| `Jwt:Issuer`, `Jwt:Audience` | Token issuer and audience |
| `Mapbox:AccessToken` | Mapbox public token for city autocomplete |
| `AdminSeed:Email`, `AdminSeed:Password` | Admin account created on first start |
| `Cors:AllowedOrigins` | Frontend origins allowed to call the API |
| `App:FrontendUrl` | Base URL used for links in emails |
| `Email:*` | SMTP settings. Leave `Email:Host` empty to log emails instead of sending them |

The frontend needs one variable: `NEXT_PUBLIC_API_URL`, the API base URL (for example `http://localhost:5067/api`).

## CI/CD

[GitHub Actions](.github/workflows/ci-cd.yml) runs on every push and pull request to `main`:

1. **Backend:** restore, build, run the xUnit tests
2. **Frontend:** lint, translation check, type-check, production build
3. **Docker:** build the API image
4. **Deploy:** on `main`, after every job passes, a Render deploy hook redeploys the API. Vercel deploys the frontend from the repository.

## Project structure

```
.
├── .github/workflows/      # CI/CD pipeline
├── Footynet/               # .NET solution
│   ├── Footynet/           # Web API: controllers, SignalR hub, security, validators
│   ├── Footynet.Service/   # Business logic
│   ├── Footynet.Repository/# Data access (EF Core + Dapper)
│   ├── Footynet.Data/      # DbContext, migrations, seed data
│   ├── Footynet.Model/     # Entities, DTOs, localization resources
│   ├── Footynet.Tests/     # xUnit tests
│   └── Dockerfile
└── footynet-frontend/      # Next.js app
    ├── app/                # Routes: player/, club/, admin/, messages/, auth pages
    ├── components/         # Shared UI components
    ├── contexts/           # Auth and chat state
    ├── lib/                # API clients
    └── messages/           # hr.json, en.json translations
```

## Author

**Robert Knezevic** · [GitHub](https://github.com/rknezevic)
