## Automatic Paychecks

Send a POST request to `/api/paychecks/generate` to create a bi-weekly schedule. Example:

```bash
curl -X POST http://localhost:3001/api/paychecks/generate \
  -H "Content-Type: application/json" \
  -d '{"startDate":"2025-01-01","amount":2000,"count":26}'
```

You can update individual paychecks later with `PUT /api/paychecks/:id`. When a new bill is created without specifying a paycheck it will automatically attach to the paycheck immediately preceding its due date.

