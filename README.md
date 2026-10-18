# Finora

Finora is a personal finance app for tracking expenses, setting monthly budgets, and understanding spending patterns. It includes a public landing page, account registration and login, a dashboard, transaction management, reports, profile settings, and light/dark themes.

## Features

- Register and sign in with cookie-based authentication.
- Add, edit, search, filter, and delete expenses.
- Review monthly spending totals and recent transactions.
- Set category budgets and compare budgets with actual spending.
- View daily, category, and six-month spending reports.
- Update profile details, currency, monthly budget, and profile image (up to 500 KB).
- Choose a persistent light or dark theme.
- Responsive layout for desktop and mobile.

## Technology

- **Client:** React, Vite, Tailwind CSS, Zustand, Recharts
- **Server:** Node.js, Express, Mongoose
- **Data and cache:** MongoDB and Upstash Redis

## Requirements

- Node.js 20.19+ or 22.12+ (required by the Vite version in this project)
- npm
- A MongoDB connection string
- An Upstash Redis REST URL and token

## Setup

Install and configure the server:

```powershell
cd server
npm install
```

Create `server/.env`:

```dotenv
PORT=5000
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
UPSTASH_REDIS_REST_URL=https://<your-upstash-redis-endpoint>
UPSTASH_REDIS_REST_TOKEN=<your-upstash-redis-token>
JWT_SECRET=<long-random-secret>
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

Use your own credentials. Keep `.env` files private; do not commit credentials or production secrets.

Install and configure the client in a second terminal:

```powershell
cd client
npm install
```

Create `client/.env`:

```dotenv
VITE_API_URL=http://localhost:5000
```

Start both applications in separate terminals:

```powershell
# Terminal 1
cd server
npm run dev
```

```powershell
# Terminal 2
cd client
npm run dev
```

Open the Vite URL shown in the client terminal (normally `http://localhost:5173`). The API runs on port `5000` by default.

## Useful commands

Run these from their respective `client` or `server` directories:

| Command | Project | Description |
| --- | --- | --- |
| `npm run dev` | client | Start the Vite development server |
| `npm run lint` | client | Run ESLint |
| `npm run build` | client | Create a production client build in `client/dist` |
| `npm run preview` | client | Preview the production client build |
| `npm run dev` | server | Start the API with Node watch mode |
| `npm start` | server | Start the API |

## API overview

All endpoints are prefixed with `/api`. Authenticated endpoints require the session cookie set by login or registration.

| Method | Endpoint | Purpose | Access |
| --- | --- | --- | --- |
| `GET` | `/health` | API health check | Public |
| `POST` | `/auth/register` | Create an account | Public |
| `POST` | `/auth/login` | Sign in | Public |
| `POST` | `/auth/logout` | Sign out | Public |
| `GET` | `/auth/me` | Get the current profile | Authenticated |
| `PUT` | `/auth/me` | Update profile and preferences | Authenticated |
| `PUT` | `/auth/change-password` | Change password | Authenticated |
| `GET`, `POST` | `/expenses` | List or create expenses | Authenticated |
| `GET`, `PUT`, `DELETE` | `/expenses/:id` | Read, update, or delete one expense | Authenticated |
| `GET`, `POST` | `/budgets` | List or set category budgets | Authenticated |
| `GET` | `/budgets/summary` | Get monthly budget summary | Authenticated |
| `DELETE` | `/budgets/:id` | Delete a budget | Authenticated |
| `GET` | `/dashboard/summary` | Get dashboard summary | Authenticated |
| `GET` | `/dashboard/reports` | Get spending chart data | Authenticated |

Expense and budget list endpoints accept a `month` query parameter in `YYYY-MM` format. Expenses also support `category`, `search`, `page`, and `limit`.

## Project layout

```text
client/   React application and static assets
server/   Express API, MongoDB models, middleware, and Redis cache
```

## Notes

- Profile images are stored with the user profile and limited to 500 KB. JPEG, PNG, and WebP are accepted.
- The app requires MongoDB and Upstash Redis credentials to start the API.
- Configure `CLIENT_URL` to match the client origin when running outside local development.

## License

Finora is available under the Apache License 2.0. See [`LICENSE`](./LICENSE) for the full terms.
Copyright © 2026 Adil Hassan.