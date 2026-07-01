# {{PROJECT_NAME}}

Scaffolded with [program-starter](https://github.com/PIAAR/program-starter) (Python + FastAPI template).

## Getting started

```bash
docker compose up -d              # Postgres + Redis for local dev
conda env create -f environment.yml
conda activate {{PROJECT_NAME}}
cp .env.example .env              # or `doppler setup` if you use Doppler
uvicorn app.main:app --reload
```

`GET /health` confirms the service is up.
