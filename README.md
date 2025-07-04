# Bill Manager

A simple web application for tracking paychecks and bills. The backend is an Express server with SQLite storage and the frontend is built with React and Bootstrap.

## Setup

The project requires **Node.js 18 or newer**. Install dependencies for both server and client:

```bash
npm install
npm install --prefix client
```

Start only the API server (use this if you don't need the client running):

```bash
npm start
```

Run the tests:

```bash
npm test
```

## Database

The server uses a SQLite database whose location is determined by the `DB_PATH`
environment variable. If `DB_PATH` is not set, the database defaults to
`bills.db` in the project root.

The test suite runs with `process.env.DB_PATH=':memory:'` to create an
in-memory database.

To start the server with a custom database file you can set `DB_PATH` when
launching the server (the same works for `npm run dev`):

```bash
DB_PATH=/tmp/my-bills.db node server.js
```

## Development

Start the API server and React client concurrently:

```bash
npm run dev
```

This runs both the backend and frontend together. If you only want to start the
backend API server, run:

```bash
npm start
```

## Automatic Paychecks

Generate a bi-weekly paycheck schedule with a single request:

```bash
curl -X POST http://localhost:3001/api/paychecks/generate \
  -H "Content-Type: application/json" \
  -d '{"startDate":"2025-01-01","amount":2000,"count":26}'
```

Update an individual paycheck using `PUT /api/paychecks/:id`. Any bill created
without a `paycheckId` will be linked to the paycheck just before its due date.

The API server runs on `http://localhost:3001` and the React app runs on `http://localhost:5173`.

## Documentation

See [docs/README.md](docs/README.md) for screenshots and additional usage notes.
