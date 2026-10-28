# Greenfield School Management System — Backend

Express API backed by PostgreSQL.

## Included API routes

- `GET /` — API status
- `GET /api/health` — database health
- `POST /api/auth/login` — authenticate an existing account
- `POST /api/auth/signup` — create a regular `staff` account (never grants admin privileges)
- `GET /api/auth/me` — return the authenticated account
- `/api/students` — authenticated student list/detail; create/update/delete requires `super_admin`
- `/api/teachers` — authenticated teacher list/detail; create/update/delete requires `super_admin`

## Local setup

1. Use Node.js 20 or newer.
2. Run `npm install` in this directory.
3. Create `.env` from `.env.example` and enter your PostgreSQL connection string and a strong `JWT_SECRET`.
4. Create the database if it does not exist.
5. Run `npm run db:schema`.
6. Create the first administrator using `npm run admin:create`, then grant the intended role in PostgreSQL if necessary.
7. Run `npm start`.

The schema command is safe to rerun for the tables/columns defined in `database/schema.sql`.

## Production deployment

- Set `DATABASE_URL` to the hosted PostgreSQL connection string.
- Set `DATABASE_SSL=true` if your database requires TLS.
- Set `JWT_SECRET` to a unique random secret of at least 32 characters.
- Set `CORS_ORIGINS` to the exact production frontend origin(s), comma-separated.
- Set `NODE_ENV=production`.
- Set the host's start command to `npm start`.
- Run `npm run db:schema` once against the production database before using the new API.
- Configure the frontend's API base URL to the deployed backend URL. Do not use `localhost` in a deployed frontend.

## Frontend authentication requirement

After login, store the returned token using the frontend's existing secure session strategy and send it on protected API requests:

`Authorization: Bearer <token>`

Signup only creates a `staff` account. It cannot set `super_admin` or `viewer` in the request body. A super administrator must explicitly grant elevated roles. Only `super_admin` can create, update, or delete students and teachers.

## Security notes

- Never commit `.env`, database credentials, or JWT secrets.
- Do not upload `node_modules`; the deployment platform installs dependencies from `package.json`/`package-lock.json`.
- Rotate any credential that has accidentally been published.
