# OD ARCHITECTS

Marketing website and project portfolio for OD Architects — interior and exterior design, AI visualization, and drone delivery.

## Tech stack

- [Next.js 14](https://nextjs.org/) (App Router)
- React 18 + TypeScript
- Tailwind CSS
- Framer Motion + GSAP
- [Resend](https://resend.com/) (contact and service-request email)

## Requirements

- Node.js 20+
- npm

## Setup

```bash
npm install
cp .env.example .env.local
```

Edit `.env.local` with production values (see [Environment variables](#environment-variables)).

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other useful commands:

| Command | Description |
| --- | --- |
| `npm run dev:simple` | Next.js dev server without the fresh-cache wrapper |
| `npm run dev:lan` | Dev server bound to `0.0.0.0` |
| `npm run lint` | ESLint |

## Environment variables

Copy `.env.example` to `.env.local` and configure:

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Resend API key for transactional email |
| `RESEND_FROM_EMAIL` | Verified sender on your domain (e.g. `contact@od-architects.com`) |
| `RESEND_FROM_NAME` | Sender display name |
| `CONTACT_EMAIL` | Inbox for form submissions |

Optional (build-time hero tooling only — not used by the running site):

| Variable | Purpose |
| --- | --- |
| `IMAGE_AI_PROVIDER` | Provider for `npm run hero:expand` |
| `IMAGE_AI_API_KEY` | API key for hero expansion script |

## Production build

```bash
npm run build
npm start
```

`npm start` serves on `0.0.0.0` (suitable for VPS or container hosting).

## Content maintenance

Project data and gallery imports are generated from the `imgs/` folder:

```bash
npm run generate:projects   # interior + exterior
npm run generate:interior
npm run generate:exterior
```

Hero asset helpers:

```bash
npm run hero:crops
npm run hero:expand
```

## Project structure

| Path | Description |
| --- | --- |
| `app/` | Routes, layouts, global styles |
| `components/` | UI components |
| `lib/` | Data, content, utilities, generated gallery modules |
| `imgs/` | Source imagery referenced by the app |
| `public/` | Static assets (fonts, video, favicon) |
| `scripts/` | Content generation and image tooling |

## Deployment

Standard Next.js deployment. Set the environment variables above on the host. No database is required.