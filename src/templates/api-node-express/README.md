# {{PROJECT_NAME}}

Scaffolded with [program-starter](https://github.com/PIAAR/program-starter) (Node + Express API/SaaS template).

## Getting started

```bash
docker compose up -d   # Postgres + Redis for local dev
npm install
cp .env.example .env   # or `doppler setup` if you use Doppler
npm run dev
```

`GET /health` confirms the service is up.
