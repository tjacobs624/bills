# Bill Manager

A simple web application for tracking paychecks and bills. The backend is an Express server with SQLite storage and the frontend is built with React and Bootstrap.

## Setup

Install dependencies for both server and client:

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

The API server runs on `http://localhost:3001` and the React app runs on `http://localhost:5173`.

## Documentation

See [docs/README.md](docs/README.md) for screenshots and additional usage notes.
