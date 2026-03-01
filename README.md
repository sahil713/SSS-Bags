# SSS BAGS – Full Stack E-Commerce

Production-ready e-commerce platform with Rails 7.2 API and React 18 (Vite) frontend, purple theme.

## Tech Stack

- **Backend:** Ruby 3.3+, Rails 7.2 (API), PostgreSQL, JWT (access + refresh), Pundit, ActiveStorage, Sidekiq, Redis, Twilio (OTP), ActionMailer
- **Frontend:** React 18, Vite, React Router v6, Redux Toolkit, Axios, Tailwind CSS (purple theme)

## Quick Start (local)

Start PostgreSQL and Redis with Docker (official free images from Docker Hub):

```bash
docker-compose pull db redis    # optional: pull images first
docker-compose up -d db redis
```

### Backend

Use **Ruby 3.3.1 or newer** (3.3.0 has a parser bug with the redis/connection_pool stack). Example: `rvm install 3.3.1 && rvm use 3.3.1`.

```bash
cd backend
cp .env.example .env   # edit .env: DB_PASSWORD=postgres, DB_PORT=5433, REDIS_URL=redis://localhost:6380/0 (Docker uses ports 5433 and 6380 to avoid conflict with local Postgres/Redis)
bundle install
bin/rails db:create db:migrate db:seed
bundle exec puma -C config/puma.rb
```

API: http://localhost:3000  
Swagger: http://localhost:3000/api-docs  
Sidekiq: http://localhost:3000/sidekiq (if mounted)

### Frontend

Uses **Node 18+** (Node 20.0.0 works; for Vite 7 use 20.19+). Uses Vite 5 and Tailwind 3 for compatibility.

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

App: http://localhost:5173

### Default admin

- Email: `admin@sssbags.com`
- Password: `admin123`

### Can't login – "Please verify your email and phone"

- **Option 1 (frontend):** Open **Verify phone** (e.g. from Login page link or go to `/verify-otp`). Enter your **email** (same as signup), click **Send OTP**, then enter the code you get on your phone and verify. After that you can log in.
- **Option 2 (no Twilio / dev):** Mark the user as phone-verified from the backend so they can log in without OTP:

```bash
cd backend
bin/rails c
```

Then in the console (replace with your user email):

```ruby
u = User.find_by!(email: "your@email.com")
u.update!(phone_verified: true, phone_verified_at: Time.current, otp_code: nil, otp_sent_at: nil)
puts "OK – you can now login as #{u.email}"
exit
```

## Deploy online (college / portfolio)

See **[DEPLOYMENT.md](DEPLOYMENT.md)** for step-by-step instructions to put the app online (GitHub + Render + Vercel, free tiers).

## Docker

```bash
docker-compose up -d
# Backend: http://localhost:3000
# Frontend: http://localhost:80
```

Run migrations and seed inside backend container:

```bash
docker-compose exec backend bin/rails db:create db:migrate db:seed
```

## API Versioning

All API routes are under `/api/v1/`.

## Security

- bcrypt for passwords
- JWT access (short-lived) + refresh tokens
- OTP rate limiting
- Pundit role-based authorization
- CORS via `CORS_ORIGINS`
- Strong params and indexes on DB

## Investments module

Email-verified customers can access `/investments` to:
- Link Groww account (API key/secret)
- View portfolio, P&L, holdings
- Monthly/yearly reports with CSV export
- Sell timing (1d, 15d, 1mo, etc.)
- Tips & recommendations (rule-based + AI)
- TradingView charts

Run `bin/rails db:migrate` to create `groww_connections` and `portfolio_snapshots` tables.

## Project structure

- `backend/` – Rails API, services, jobs, mailers, policies
- `frontend/` – React app, Redux, API layer, pages (public, customer, admin, investments)

## License

Proprietary.
