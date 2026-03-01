# SSS BAGS – Full Stack E-Commerce Platform
## Comprehensive Project Documentation for College Showcase

---

## 1. Project Overview

**SSS BAGS** is a production-ready, full-stack e-commerce platform designed for selling bags, handbags, backpacks, wallets, and luggage. The application features a modern purple-themed UI, complete authentication with email and phone verification, role-based access control (Admin & Customer), shopping cart, order management, and an admin dashboard for managing products, orders, users, banners, and announcements.

### 1.1 Key Highlights
- **Full-stack architecture**: Rails 7.2 API backend + React 18 frontend
- **Production deployment**: Live on Render (backend) + Vercel (frontend)
- **Security**: JWT authentication, bcrypt passwords, OTP verification, Pundit authorization
- **Modern UX**: Purple theme, responsive design, animations (Framer Motion)
- **Complete e-commerce flow**: Browse → Cart → Checkout → Order tracking

---

## 2. Technology Stack

### 2.1 Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Ruby | 3.3+ | Programming language |
| Rails | 7.2 | API framework |
| PostgreSQL | 16 | Primary database |
| Redis | 7 | Caching, Sidekiq background jobs |
| JWT | - | Access + refresh token authentication |
| bcrypt | 3.1 | Password hashing |
| Pundit | 2.3 | Role-based authorization |
| ActiveStorage | - | Image uploads (products, avatars) |
| Sidekiq | 7.2 | Background job processing |
| Twilio | 6.0 | SMS OTP for phone verification |
| ActionMailer | - | Email verification |
| RSwag | 2.14 | API documentation (Swagger) |
| Rack-CORS | - | Cross-origin requests |

### 2.2 Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2 | UI framework |
| Vite | 5.4 | Build tool, dev server |
| React Router | 6.28 | Client-side routing |
| Redux Toolkit | 2.11 | State management |
| Axios | 1.13 | HTTP client |
| Tailwind CSS | 3.4 | Styling (purple theme) |
| Framer Motion | 12.34 | Animations |

### 2.3 DevOps & Deployment
- **Docker** & **Docker Compose** for local development
- **Render.com** – Backend API + PostgreSQL (free tier)
- **Vercel** – Frontend hosting (free tier)
- **GitHub** – Source code repository

---

## 3. System Architecture

### 3.1 High-Level Architecture
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   React SPA     │────▶│  Rails API      │────▶│  PostgreSQL     │
│   (Vercel)      │     │  (Render)       │     │  (Render)       │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                 │
                                 ├────▶ Redis (Sidekiq)
                                 ├────▶ Twilio (SMS OTP)
                                 └────▶ ActionMailer (Email)
```

### 3.2 API Versioning
All API routes are under `/api/v1/` for versioned, stable endpoints.

### 3.3 Project Structure
```
SSS BAGS/
├── backend/                 # Rails API
│   ├── app/
│   │   ├── controllers/    # API controllers (auth, products, orders, etc.)
│   │   ├── models/         # User, Product, Order, Cart, etc.
│   │   ├── policies/       # Pundit authorization policies
│   │   ├── services/       # JWT, OTP, OrderCreation, EmailVerification
│   │   ├── jobs/           # EmailVerificationJob (Sidekiq)
│   │   └── mailers/        # UserMailer (verification emails)
│   ├── config/
│   ├── db/                 # Migrations, schema, seeds
│   └── spec/               # RSpec tests
├── frontend/               # React app
│   ├── src/
│   │   ├── api/            # API client (auth, products, cart, orders)
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route pages (Landing, Products, Admin)
│   │   ├── store/          # Redux slices (auth, cart)
│   │   ├── hooks/          # useAuth, useTheme
│   │   └── context/        # ThemeContext
│   └── public/
├── docker-compose.yml      # Local dev (db, redis, backend, frontend)
├── README.md
├── DEPLOYMENT.md
└── PROJECT_DOCUMENTATION.md
```

---

## 4. Database Schema & Models

### 4.1 Core Entities

| Table | Description |
|-------|-------------|
| **users** | Customers and admins. Fields: name, email, phone_number, password_digest, role, email_verified, phone_verified, refresh_token |
| **categories** | Product categories (Handbags, Backpacks, Wallets, Luggage). Slug-based URLs |
| **products** | Items for sale. Fields: name, description, price, discount_price, stock_quantity, slug, status, featured |
| **carts** | One cart per user. Contains cart_items |
| **cart_items** | Product + quantity in cart |
| **orders** | Placed orders. Fields: total_price, shipping_address, status, payment_status |
| **order_items** | Line items in order (product, quantity, price_at_purchase) |
| **addresses** | User shipping addresses (line1, city, pincode, default) |
| **payments** | Payment records linked to orders (transaction_id, status) |
| **banners** | Homepage promo banners (title, subtitle, button_link, priority) |
| **announcements** | Top strip announcements (message, is_active, dates) |
| **otp_rate_limits** | Rate limiting for OTP sends per phone number |

### 4.2 Relationships
- User → has_one Cart, has_many Addresses, has_many Orders
- Product → belongs_to Category, has_many cart_items, has_many order_items
- Order → belongs_to User, has_many order_items, has_many payments
- Cart → has_many cart_items

### 4.3 Soft Delete
Models `User`, `Product`, `Banner`, `Announcement` use `SoftDeletable` concern (deleted_at column).

---

## 5. Authentication & Authorization

### 5.1 Authentication Flow
1. **Signup**: User provides name, email, phone, password → Account created → Email verification sent (background job)
2. **Email verification**: User clicks link in email → Token validated → User marked email_verified
3. **Phone verification**: User requests OTP → Twilio sends SMS → User enters code → phone_verified
4. **Login**: Email + password → JWT access + refresh tokens returned
5. **Token refresh**: Frontend uses refresh token when access token expires

### 5.2 JWT Tokens
- **Access token**: Short-lived (e.g., 15 min), used for API requests
- **Refresh token**: Long-lived (7 days), stored in DB, used to obtain new access token
- **Algorithm**: HS256, issuer verification

### 5.3 Roles & Authorization (Pundit)
| Role | Access |
|------|--------|
| **customer** | Profile, Cart, Addresses, Orders, Product browse |
| **admin** | Dashboard, Products CRUD, Orders management, Users, Banners, Announcements, Payments |

### 5.4 Security Features
- bcrypt for password hashing
- OTP rate limiting (prevents abuse)
- CORS configured via `CORS_ORIGINS`
- Strong parameters on all controllers
- Database indexes on email, phone_number, slug

---

## 6. API Endpoints

### 6.1 Public (No Auth)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/signup` | Register new user |
| POST | `/api/v1/auth/login` | Login |
| POST | `/api/v1/auth/refresh` | Refresh access token |
| POST | `/api/v1/auth/verify_email` | Verify email via token |
| GET | `/api/v1/products` | List products |
| GET | `/api/v1/products/:slug` | Product detail |
| GET | `/api/v1/products/search` | Search products |
| GET | `/api/v1/categories` | List categories |
| GET | `/api/v1/banners` | Homepage banners |
| GET | `/api/v1/announcements` | Announcement strip |

### 6.2 Customer (Auth Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/PATCH | `/api/v1/customer/profile` | Profile |
| GET/POST/PATCH/DELETE | `/api/v1/customer/cart` | Cart CRUD |
| GET/POST/PATCH/DELETE | `/api/v1/customer/addresses` | Addresses |
| GET/POST | `/api/v1/customer/orders` | Orders list, create |
| GET | `/api/v1/customer/orders/:id/track` | Order tracking |
| POST | `/api/v1/customer/orders/:id/cancel` | Cancel order |
| POST | `/api/v1/auth/send_otp` | Send OTP |
| POST | `/api/v1/auth/verify_otp` | Verify OTP |

### 6.3 Admin (Auth Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/admin/dashboard` | Dashboard stats |
| CRUD | `/api/v1/admin/products` | Products management |
| PATCH | `/api/v1/admin/products/:slug/toggle_status` | Activate/deactivate |
| CRUD | `/api/v1/admin/orders` | Orders management |
| PATCH | `/api/v1/admin/orders/:id/update_status` | Update order status |
| CRUD | `/api/v1/admin/users` | Users management |
| CRUD | `/api/v1/admin/categories` | Categories |
| CRUD | `/api/v1/admin/banners` | Banners |
| CRUD | `/api/v1/admin/announcements` | Announcements |
| GET | `/api/v1/admin/payments` | Payments list |
| POST | `/api/v1/admin/uploads` | Image upload |

### 6.4 Swagger Documentation
- **URL**: `http://localhost:3000/api-docs` (or your backend URL + `/api-docs`)

---

## 7. Frontend Pages & Features

### 7.1 Public Pages
| Route | Page | Description |
|-------|------|-------------|
| `/` | Landing | Hero, featured products, categories, testimonials, newsletter |
| `/home` | Home | Main store home |
| `/products` | Products | Product listing with filters, search |
| `/products/:slug` | ProductDetail | Single product, add to cart |
| `/login` | Login | Email/password login |
| `/signup` | Signup | Registration form |
| `/verify-email` | VerifyEmail | Email verification |
| `/verify-otp` | VerifyOtp | Phone OTP verification |

### 7.2 Customer Pages
| Route | Page | Description |
|-------|------|-------------|
| `/profile` | Profile | View/edit profile, avatar |
| `/cart` | Cart | Cart items, update quantity, checkout |
| `/orders` | Orders | Order history |
| `/my-orders` | MyOrders | Orders list |
| `/orders/:id/track` | OrderTrack | Order status timeline |

### 7.3 Admin Pages
| Route | Page | Description |
|-------|------|-------------|
| `/admin` | Dashboard | Overview stats |
| `/admin/products` | Products | Product list, create/edit |
| `/admin/orders` | Orders | Order management |
| `/admin/users` | Users | User list |
| `/admin/banners` | Banners | Banner management |
| `/admin/announcements` | Announcements | Announcement management |

### 7.4 UI Components
- **Layout**: Navbar, Footer, AnnouncementBar
- **BannerCarousel**: Homepage promo carousel
- **ProductCard**: Product display with image, price, discount
- **CartDrawer**: Slide-out cart
- **OrderTimeline**: Order status visualization
- **ProtectedRoute**: Role-based route guard

---

## 8. Order Flow & Business Logic

### 8.1 Order Creation (OrderCreationService)
1. Validate cart is not empty
2. Check stock for each cart item
3. Calculate total (using effective_price: discount_price or price)
4. Create Order with shipping_address
5. Create OrderItems, decrement product stock
6. Clear cart
7. Create Payment record (placeholder for gateway)

### 8.2 Order Statuses
- `pending` → `confirmed` → `shipped` → `delivered`
- `cancelled` (customer or admin)

### 8.3 Payment Statuses
- `pending` → `initiated` → `success` / `failed`

### 8.4 Shipping Address
Stored as JSONB: `{ line1, line2, city, state, pincode, phone }`

---

## 9. Services & Background Jobs

### 9.1 JwtService
- `encode_access(payload)` – Short-lived access token
- `encode_refresh(user_id)` – Refresh token
- `decode_access(token)` / `decode_refresh(token)` – Decode and validate

### 9.2 OtpService
- `send_otp(user)` – Generate 6-digit OTP, send via Twilio, rate limit
- `verify_otp(user, code)` – Validate OTP (10 min expiry)

### 9.3 EmailVerificationService
- Validates token from verification email link
- Marks user as email_verified

### 9.4 OrderCreationService
- `call(user, shipping_address)` – Creates order from cart

### 9.5 Background Jobs
- **EmailVerificationJob**: Sends verification email via ActionMailer (Sidekiq)

---

## 10. Deployment & Environment

### 10.1 Live URLs
- **Frontend**: https://sss-bags-nine.vercel.app/products
- **Backend**: https://sss-bags.onrender.com
- **API Docs**: https://sss-bags.onrender.com/api-docs

### 10.2 Default Admin Credentials
- **Email**: admin@sssbags.com
- **Password**: admin123

### 10.3 Environment Variables

**Backend (Render)**
| Variable | Purpose |
|----------|---------|
| `RAILS_ENV` | production |
| `SECRET_KEY_BASE` | Rails secret |
| `DATABASE_URL` | PostgreSQL connection |
| `JWT_SECRET` | JWT signing |
| `CORS_ORIGINS` | Allowed frontend origin (Vercel URL) |
| `REDIS_URL` | Optional, for Sidekiq |
| `TWILIO_*` | OTP (Account SID, Auth Token, Phone) |

**Frontend (Vercel)**
| Variable | Purpose |
|----------|---------|
| `VITE_API_URL` | Backend API base (e.g. https://sss-bags.onrender.com/api/v1) |

### 10.4 Local Development
```bash
# Start DB & Redis
docker-compose up -d db redis

# Backend
cd backend && cp .env.example .env
bundle install && bin/rails db:create db:migrate db:seed
bundle exec puma -C config/puma.rb

# Frontend
cd frontend && npm install && npm run dev
```

---

## 11. Seed Data

- **Admin**: admin@sssbags.com / admin123
- **Categories**: Handbags, Backpacks, Wallets, Luggage
- **Products**: 8 sample products (Classic Leather Handbag, Designer Tote, Travel Backpack, etc.)
- **Banners**: 3 promo banners (Diwali Sale, Buy 2 Get 1 Free, Festival Collection)
- **Announcements**: 1 top strip

---

## 12. Testing & Quality

- **Backend**: RSpec, Factory Bot
- **API**: Versioned, documented via Swagger
- **Frontend**: React 18, Redux Toolkit for predictable state

---

## 13. Summary for College Presentation

**SSS BAGS** demonstrates:
1. **Full-stack development**: Rails API + React SPA
2. **Authentication & security**: JWT, OTP, email verification, role-based access
3. **E-commerce features**: Products, cart, checkout, orders, tracking
4. **Admin capabilities**: Dashboard, CRUD for products, orders, users, content
5. **Production deployment**: Render + Vercel, live URLs
6. **Modern tooling**: Docker, Vite, Tailwind, Redux
7. **API design**: RESTful, versioned, documented

---

*Document generated for SSS BAGS college project showcase.*
