# ShopKart - Full-Stack MERN E-Commerce Platform

A full-stack e-commerce web application built using MongoDB, Express.js, React, and Node.js with Razorpay payment gateway integration.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [1. Clone Repository](#1-clone-repository)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Payment Gateway Testing](#payment-gateway-testing)
- [Available Scripts](#available-scripts)

## Features

- **Authentication & Security**:
  - Customer registration and login with bcrypt password hashing.
  - JWT stored in HTTP-only cookies.
  - Protected API routes and authenticated sessions.
- **Product Discovery & Catalog**:
  - Real-time product search.
  - Category filtering and price sorting (low-to-high, high-to-low, newest).
  - Product details with stock availability indicators.
- **Wishlist**:
  - Save favorite items to user-specific wishlist.
  - Instant UI updates for adding and removing items.
- **Cart Management**:
  - Add items to cart with dynamic quantity adjustments.
  - Subtotal and order total calculations synced with MongoDB.
- **Checkout & Razorpay Payment**:
  - Multi-step checkout with shipping address details.
  - Server-side Razorpay order generation.
  - Cryptographic payment signature verification (HMAC SHA256).
- **Order History & Tracking**:
  - View past orders with payment and delivery status (`Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`).
  - Detailed order invoice summaries.
- **Responsive UI**:
  - Clean and responsive interface built with React 19 and Vite.

## Tech Stack

### Frontend
- **Framework**: React 19
- **Bundler & Dev Server**: Vite
- **Routing**: React Router v7
- **Linter**: Oxlint
- **Styling**: Vanilla CSS

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5
- **Database**: MongoDB via Mongoose 9
- **Authentication**: `jsonwebtoken` & `cookie-parser`
- **Security & Utilities**: `bcrypt`, `cors`, `dotenv`
- **Payments**: Razorpay Node SDK

## Project Architecture

```text
ShopKart/
├── backend/
│   ├── config/              # Razorpay and DB config
│   ├── controllers/         # Request handlers
│   ├── middlewares/         # Auth verification
│   ├── models/              # Mongoose data schemas
│   ├── routes/              # Express API routes
│   ├── utils/               # Token generators and helpers
│   ├── .env.example         # Environment template
│   ├── index.js             # Server entry point
│   └── package.json
│
├── frontend/
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── context/         # Auth and Cart state
│   │   ├── pages/           # Views (Home, Products, Cart, Checkout, etc.)
│   │   ├── services/        # API client
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── App.css
│   ├── .env.example
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

## Prerequisites

- **Node.js**: v18.x or higher
- **npm** (or yarn / pnpm)
- **MongoDB**: Local MongoDB instance (`mongodb://127.0.0.1:27017`) or MongoDB Atlas
- **Razorpay Account**: Razorpay Dashboard account for test API keys

## Getting Started

### 1. Clone Repository

```bash
git clone https://github.com/nideshkaarthikrs/ShopKart.git
cd ShopKart
```

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file from the example template:
   ```bash
   cp .env.example .env
   ```
   Fill in your configuration:
   ```env
   PORT=3000
   MONGO_URI=mongodb://127.0.0.1:27017/shopkart
   JWT_SECRET=your_jwt_secret_key
   RAZORPAY_KEY_ID=rzp_test_your_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```
   The backend API will run on `http://localhost:3000`.

### 3. Frontend Setup

1. In a new terminal, navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   ```env
   VITE_API_URL=http://localhost:3000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   The application will run on `http://localhost:5173`.

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
| :--- | :--- | :--- |
| `PORT` | Express server port | `3000` |
| `MONGO_URI` | MongoDB connection URI | `mongodb://127.0.0.1:27017/shopkart` |
| `DB_URL` | MongoDB Atlas URI (optional) | `mongodb+srv://<user>:<password>@cluster.mongodb.net/shopkart` |
| `JWT_SECRET` | Secret key for JWT signing | `your_secret_key` |
| `RAZORPAY_KEY_ID` | Razorpay API Key ID (test mode) | `rzp_test_xxxxxxxxx` |
| `RAZORPAY_KEY_SECRET` | Razorpay API Key Secret (test mode) | `your_test_secret` |

### Frontend (`frontend/.env`)

| Variable | Description | Default |
| :--- | :--- | :--- |
| `VITE_API_URL` | Backend API base URL | `http://localhost:3000` |

## API Endpoints

Base URL: `http://localhost:3000`

### Customers (`/customers`)
- `POST /customers/register` - Register a new customer
- `POST /customers/login` - Authenticate customer & set cookie
- `GET /customers/me` - Get current customer profile
- `POST /customers/logout` - Clear auth cookie

### Products (`/products`)
- `GET /products` - Fetch all products (`?search=`, `?category=`, `?sort=price_asc|price_desc`)
- `GET /products/:id` - Fetch single product by ID
- `POST /products` - Create new product

### Wishlist (`/wishlist`)
- `GET /wishlist` - Get current user's wishlist
- `POST /wishlist/:productId` - Add product to wishlist
- `DELETE /wishlist/:productId` - Remove product from wishlist

### Cart (`/cart`)
- `GET /cart` - Get current user's cart
- `POST /cart/:productId` - Add product to cart
- `PATCH /cart/:productId` - Update item quantity
- `DELETE /cart/:productId` - Remove product from cart

### Orders (`/orders`)
- `POST /orders/create-payment-order` - Create Razorpay order
- `POST /orders/verify-payment` - Verify payment signature
- `GET /orders` - Get customer order history
- `GET /orders/:id` - Get single order by ID
- `PATCH /orders/:id/status` - Update order status

## Payment Gateway Testing

1. Provide valid test keys in `backend/.env` for `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`.
2. Test checkout with Razorpay test card credentials (refer to Razorpay test card documentation).

## Available Scripts

### Backend
- `npm run dev` - Starts server with watch mode
- `npm start` - Starts server with `node index.js`

### Frontend
- `npm run dev` - Starts Vite dev server
- `npm run build` - Builds production bundle
- `npm run preview` - Previews production build
- `npm run lint` - Runs Oxlint
