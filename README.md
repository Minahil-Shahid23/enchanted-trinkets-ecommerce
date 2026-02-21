# Enchanted Trinkets 💍

**Elegant Jewelry. Timeless Memories. Handcrafted for You.**

A full-stack MERN e-commerce platform designed for a premium jewelry brand, featuring a dynamic storefront and a robust administrative backend.

## Overview

Enchanted Trinkets is a **full-stack MERN e-commerce application** that provides a seamless shopping experience for handcrafted jewelry. Built with the modern MERN stack (MongoDB, Express, React, Node.js), it features a responsive storefront for users and a comprehensive Admin Dashboard for inventory and order management. The platform integrates **Cloudinary** for high-performance image hosting and **Vercel** for automated CI/CD deployment.

## Features

- **Dynamic Storefront** — Responsive catalog with category-based filtering (Rings, Necklaces, Charms).
- **Product Discovery** — 10+ unique product detail views powered by dynamic routing.
- **Admin Dashboard** — Full CRUD operations for product management and system statistics.
- **Media Management** — Optimized jewelry images hosted via Cloudinary API for fast loading.
- **Persistent Shopping Cart** — Seamless cart flow with state management that saves user selections.
- **Search Functionality** — Real-time product search to help users find specific trinkets easily.
- **Responsive UI** — Fully optimized for mobile, tablet (Nest Hub), and desktop (Tailwind CSS).
- **CI/CD Pipeline** — Automated deployment and production updates via GitHub and Vercel.

## Tech Stack

- **Frontend:** React.js, Tailwind CSS, React Router
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Media Hosting:** Cloudinary API
- **State Management:** React Context API & Hooks
- **Deployment:** Vercel (Production Hosting)

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Cloudinary API credentials

### Installation

```bash
# Clone the repository
git clone [https://github.com/your-username/enchanted-trinkets.git](https://github.com/your-username/enchanted-trinkets.git)

# Install dependencies
npm install
cd client && npm install

```

### Environment Setup

Create a `.env` file in the root directory:

```env
# Database
MONGO_URI="your-mongodb-connection-string"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

```

### Run Development Server

```bash
# Run backend and frontend concurrently
npm run dev

```

Visit [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000)

## Project Structure

```
Enchanted-Trinkets/
├── Backend/               # Node.js & Express API, MongoDB Models
├── frontend-react/        # React.js SPA with Tailwind CSS
├── .gitignore             # Standard git ignore file
└── README.md              # Project documentation

```

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/products` | Fetch all jewelry products |
| GET | `/api/products/:id` | Get single product detail |
| POST | `/api/products` | Add new product (Admin) |
| PUT | `/api/products/:id` | Update product info (Admin) |
| DELETE | `/api/products/:id` | Delete product (Admin) |
| GET | `/api/admin/stats` | Get store statistics |
| POST | `/api/orders` | Submit new customer order |

## Technical Highlights

* **Dynamic Routing:** Handled hundreds of products via a single dynamic detail template using `react-router-dom`.
* **Image Optimization:** Integrated Cloudinary’s REST API to deliver lightweight, high-resolution assets.
* **Responsive Breakpoints:** Custom-tuned CSS for unique screen resolutions like Nest Hub (1024x600).
* **Reusable Architecture:** Built a library of modular React components to ensure code maintainability.
* **Production Deployment:** Configured environment variables and secure API headers for Vercel deployment.
