# Deploy SSS BAGS Online (for College / Portfolio)

Use this guide to put your project on the internet so you can share a **live link** and **GitHub repo** in college.

---

## 1. Put Your Code on GitHub

1. Create a new repository on [GitHub](https://github.com/new). Name it e.g. `sss-bags` or `sss-bags-ecommerce`.
2. In your project folder, run:

```bash
cd "/data/cool/projects/SSS BAGS"
git init
git add .
git commit -m "Initial commit: SSS BAGS e-commerce"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your GitHub username and repo name.

**Share this link:** `https://github.com/YOUR_USERNAME/YOUR_REPO_NAME` — good for showing code in college.

---

## 2. Deploy Backend + Database (Render.com – Free)

[Render](https://render.com) has a free tier for web services and PostgreSQL.

### 2.1 Create a PostgreSQL database

1. Go to [Render Dashboard](https://dashboard.render.com) → **New** → **PostgreSQL**.
2. Name it e.g. `sss-bags-db`.
3. Create. Copy the **Internal Database URL** (you’ll use it for the backend).

### 2.2 Deploy the Rails API

1. **New** → **Web Service**.
2. Connect your GitHub repo (the one you pushed in step 1).
3. Settings:
   - **Root Directory:** `backend`
   - **Runtime:** `Ruby`
   - **Build Command:** `bundle install`
   - **Start Command:** `bundle exec puma -C config/puma.rb -p $PORT`
   - **Release Command** (optional): `bin/rails db:migrate` — runs before each deploy so the DB is up to date.
4. **Environment** (add these):
   - `RAILS_ENV` = `production`
   - `DATABASE_URL` = *(paste the Internal Database URL from 2.1)*
   - `JWT_SECRET` = *(run `openssl rand -hex 32` and paste the result)*
   - `CORS_ORIGINS` = `https://your-frontend-url.vercel.app` *(you’ll set the real URL after deploying the frontend)*
   - `REDIS_URL` = *(leave empty for now, or add a free Redis URL from [Upstash](https://upstash.com) if you need Sidekiq)*
5. Deploy. After it’s live, copy your backend URL, e.g. `https://sss-bags-api.onrender.com`.

---

## 3. Deploy Frontend (Vercel – Free)

[Vercel](https://vercel.com) is good for React/Vite apps.

### 3.1 Build the frontend to use your backend URL

In `frontend`, create or edit `.env.production`:

```bash
cd frontend
echo "VITE_API_URL=https://YOUR_BACKEND_URL" > .env.production
```

Replace `YOUR_BACKEND_URL` with the Render backend URL (e.g. `https://sss-bags-api.onrender.com`). Do **not** add `/api/v1` — the app already uses that path.

### 3.2 Deploy on Vercel

1. Go to [Vercel](https://vercel.com) and sign in with GitHub.
2. **Add New** → **Project** → import the same GitHub repo.
3. Settings:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add **Environment Variable**: `VITE_API_URL` = `https://YOUR_BACKEND_URL` (same as above).
5. Deploy. You’ll get a URL like `https://sss-bags.vercel.app`.

### 3.3 Point backend CORS to your frontend

1. In Render → your backend service → **Environment**.
2. Set `CORS_ORIGINS` = `https://sss-bags.vercel.app` (your real Vercel URL).
3. Redeploy the backend so CORS allows the frontend.

---

## 4. Run Migrations and Seed (Backend)

After the first deploy, run migrations and seed once:

1. Render → your backend service → **Shell** (or use “Manual Deploy” with a build command that runs migrations).
2. Or install [Render CLI](https://render.com/docs/cli) and run:

```bash
# If you have Render CLI and a shell to the service:
bin/rails db:migrate db:seed
```

If Render doesn’t give you a shell, add this to the **Build Command** so it runs on every deploy:

```bash
bundle install && bin/rails db:migrate
```

Then in the dashboard, run **one-off** seed (or add `db:seed` to the build once, then remove it):

```bash
bin/rails db:seed
```

**Default admin after seed:** `admin@sssbags.com` / `admin123`.

---

## 5. What to Share in College

| What | Link |
|------|------|
| **Live app** | Your Vercel URL, e.g. `https://sss-bags.vercel.app` |
| **Source code** | Your GitHub repo URL |
| **Short description** | “Full-stack e-commerce (Rails API + React). Deployed on Render + Vercel.” |

---

## 6. Optional: Redis and Sidekiq

- **Without Redis:** The app will run; background jobs (e.g. email verification) may not run. Fine for a demo.
- **With Redis (free):** Create a free Redis database at [Upstash](https://upstash.com), copy the URL, and set `REDIS_URL` in Render. Then Sidekiq can run.

---

## 7. Quick Checklist

- [ ] Code pushed to GitHub
- [ ] Render: PostgreSQL created
- [ ] Render: Backend web service deployed, `DATABASE_URL` and `JWT_SECRET` set
- [ ] Vercel: Frontend deployed, `VITE_API_URL` = backend URL
- [ ] Backend: `CORS_ORIGINS` = your Vercel URL
- [ ] Backend: `db:migrate` and `db:seed` run
- [ ] Test: Open Vercel URL, sign up / log in (admin: `admin@sssbags.com` / `admin123`)

---

## Troubleshooting

- **CORS errors in browser:** Make sure `CORS_ORIGINS` on Render exactly matches your Vercel URL (including `https://`).
- **API 404:** Ensure `VITE_API_URL` has no trailing slash and no `/api/v1` (the app adds that).
- **Database errors:** Confirm `DATABASE_URL` in Render is the **Internal** URL from the PostgreSQL service.

Good luck with your college showcase.
