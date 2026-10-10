# 🛒 ShopKart - Full-Stack MERN E-Commerce Platform

A modern, responsive full-stack e-commerce web application built using the **MERN** stack (**M**ongoDB, **E**xpress.js, **R**eact, **N**ode.js) with **Razorpay** payment gateway integration.

---

## 📑 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Prerequisites](#prerequisites)
- [Getting Started & Setup](#getting-started--setup)
  - [1. Clone Repository](#1-clone-repository)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
- [Environment Variables](#environment-variables)
- [API Endpoints Overview](#api-endpoints-overview)
- [Payment Gateway Testing](#payment-gateway-testing)
- [Available Scripts](#available-scripts)
- [Contributing](#contributing)
- [License](#license)

---

## 🌟 Overview

**ShopKart** provides an end-to-end shopping experience—from product discovery and category filtering to cart/wishlist management, secure user authentication with HTTP-only cookies, and payment processing with Razorpay.

---

## ✨ Key Features

- **🔐 Authentication & Security**:
  - Secure customer registration and login with `bcrypt` password hashing.
  - JSON Web Tokens (JWT) stored in HTTP-only, secure cookies.
  - Protected API routes and authenticated sessions.
- **🛍️ Product Discovery & Catalog**:
  - Browse products with instant real-time search.
  - Category-based filtering and price sorting (low-to-high, high-to-low, newest).
  - Detailed product view with stock availability indicators.
- **❤️ Wishlist Management**:
  - Save favorite items to user-specific wishlist.
  - Add or remove items with instant UI updates.
- **🛒 Shopping Cart**:
  - Add items to cart with dynamic quantity adjustments.
  - Subtotal and order total calculations.
  - Persistent cart synced with MongoDB.
- **💳 Checkout & Razorpay Payment Integration**:
  - Multi-step checkout with shipping address details.
  - Server-side Razorpay order generation.
  - Cryptographic payment signature verification (`HMAC SHA256`) for transaction safety.
- **📦 Order History & Tracking**:
  - View past orders with payment and delivery status (`Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`).
  - Detailed order invoice summaries.
- **🎨 Modern UI/UX**:
  - Fast, responsive design built with React 19 and Vite.
  - Clean layout, responsive cards, toast alerts, and modal dialogs.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/)
- **Bundler & Dev Server**: [Vite 8](https://vitejs.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Linter**: [Oxlint](https://oxc.rs/)
- **Styling**: Vanilla CSS with modern custom properties, flexbox & grid

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) (v18+ recommended)
- **Framework**: [Express.js 5](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose 9](https://mongoosejs.com/)
- **Authentication**: `jsonwebtoken` (JWT) & `cookie-parser`
- **Security & Utilities**: `bcrypt`, `cors`, `dotenv`
- **Payments**: [Razorpay Node SDK](https://razorpay.com/)

---

## 📂 Project Architecture

```text
ShopKart/
├── backend/
│   ├── config/              # Configuration (Razorpay client, etc.)
│   ├── controllers/         # Request handlers (auth, cart, order, product, wishlist)
│   ├── middlewares/         # Auth verification and route guards
│   ├── models/              # Mongoose data schemas (Customer, Order, Product)
│   ├── routes/              # Express REST API routes
│   ├── utils/               # Token generators and helpers
│   ├── .env.example         # Backend environment variables template
│   ├── index.js             # Express server entry point
│   └── package.json         # Backend dependencies & scripts
│
├── frontend/
│   ├── public/              # Static public assets
│   ├── src/
│   │   ├── assets/          # Icons and images
│   │   ├── components/      # Reusable UI components (Navbar, CartItem, ProductCard, etc.)
│   │   ├── context/         # React Context for global state (Auth, Cart)
│   │   ├── pages/           # Application views (Home, Products, Cart, Checkout, Orders, etc.)
│   │   ├── services/        # API client and service endpoints
│   │   ├── App.jsx          # Route definitions and layouts
│   │   ├── main.jsx         # React application entry point
│   │   └── App.css          # Core styles
│   ├── .env.example         # Frontend environment variables template
│   ├── index.html           # HTML template
│   ├── vite.config.js       # Vite configuration
│   └── package.json         # Frontend dependencies & scripts
│
├── .gitignore
└── README.md
```

---

## 📋 Prerequisites

Before starting, ensure you have the following installed on your machine:
- **Node.js**: `v18.x` or higher (tested with `v20+` and `v24+`)
- **npm**: `v9.x` or higher (or `yarn` / `pnpm`)
- **MongoDB**: A running local MongoDB instance (`mongodb://127.0.0.1:27017`) or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
- **Razorpay Account**: A free [Razorpay Dashboard](https://dashboard.razorpay.com/) account for test API keys

---

## 🚀 Getting Started & Setup

### 1. Clone Repository

```bash
git clone https://github.com/nideshkaarthikrs/ShopKart.git
cd ShopKart
```

---

### 2. Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file from the example template:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and fill in your configuration:
   ```env
   PORT=3000
   MONGO_URI=mongodb://127.0.0.1:27017/shopkart
   JWT_SECRET=your_super_secret_jwt_key
   RAZORPAY_KEY_ID=rzp_test_your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```

4. **Start the backend server**:
   - For development (with watch mode):
     ```bash
     npm run dev
     ```
   - For standard start:
     ```bash
     npm start
     ```
   The backend API will start on: **`http://localhost:3000`**

---

### 3. Frontend Setup

1. **Open a new terminal window and navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables (optional)**:
   Create a `.env` file if you want to customize the API URL:
   ```bash
   cp .env.example .env
   ```
   ```env
   VITE_API_URL=http://localhost:3000
   ```

4. **Start the Vite development server**:
   ```bash
   npm run dev
   ```
   The client application will run on: **`http://localhost:5173`**

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `PORT` | Port for the Express server to listen on | `3000` |
| `MONGO_URI` | MongoDB connection URI (local instance) | `mongodb://127.0.0.1:27017/shopkart` |
| `DB_URL` | Optional alternative MongoDB Atlas connection URI | `mongodb+srv://<user>:<password>@cluster.mongodb.net/shopkart` |
| `JWT_SECRET` | Secret key used to sign and verify JWT tokens | `your_secret_key` |
| `RAZORPAY_KEY_ID` | Razorpay API Key ID (test mode) | `rzp_test_xxxxxxxxx` |
| `RAZORPAY_KEY_SECRET` | Razorpay API Key Secret (test mode) | `your_test_secret` |

### Frontend (`frontend/.env`)

| Variable | Description | Default |
| :--- | :--- | :--- |
| `VITE_API_URL` | Backend API base URL | `http://localhost:3000` |

---

## 📡 API Endpoints Overview

All backend endpoints are prefixed by their respective resource paths on `http://localhost:3000`:

### 👤 Customer & Auth (`/customers`)
- `POST /customers/register` - Register a new customer
- `POST /customers/login` - Authenticate customer & set auth cookie
- `GET /customers/me` - Get currently authenticated customer profile
- `POST /customers/logout` - Clear auth cookie and logout

### 📦 Products (`/products`)
- `GET /products` - Fetch all products (supports `?search=`, `?category=`, `?sort=price_asc|price_desc`)
- `GET /products/:id` - Fetch single product by ID
- `POST /products` - Create new product (Admin)

### ❤️ Wishlist (`/wishlist`)
- `GET /wishlist` - Get current user's wishlist
- `POST /wishlist/:productId` - Add product to wishlist
- `DELETE /wishlist/:productId` - Remove product from wishlist

### 🛒 Cart (`/cart`)
- `GET /cart` - Get current user's cart
- `POST /cart/:productId` - Add product to cart
- `PATCH /cart/:productId` - Update item quantity in cart
- `DELETE /cart/:productId` - Remove product from cart

### 💳 Orders & Payments (`/orders`)
- `POST /orders/create-payment-order` - Create Razorpay order for current cart
- `POST /orders/verify-payment` - Verify Razorpay signature and finalize order
- `GET /orders` - Get current customer's order history
- `GET /orders/:id` - Get order details by ID
- `PATCH /orders/:id/status` - Update order delivery status

---

## 💳 Payment Gateway Testing

When testing the checkout flow in development:
1. Ensure `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in `backend/.env` are populated with your Razorpay Test API Keys.
2. Complete checkout using Razorpay Test Cards or Netbanking simulation.
3. Refer to the [Razorpay Test Card Details](https://razorpay.com/docs/payments/payments/test-card-details/) documentation for valid test credentials.

---

## 📜 Available Scripts

### Backend (`/backend`)
- `npm run dev` - Starts server with Node.js `--watch` mode
- `npm start` - Starts production server with `node index.js`

### Frontend (`/frontend`)
- `npm run dev` - Starts Vite development server at `http://localhost:5173`
- `npm run build` - Builds production bundle into `dist/`
- `npm run preview` - Previews the production build locally
- `npm run lint` - Runs Oxlint code linter

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).
