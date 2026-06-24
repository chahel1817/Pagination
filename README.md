# Bazaario: High-Performance Cursor Pagination

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)

Bazaario is a full-stack e-commerce demonstration built specifically to solve the massive performance and UX issues associated with standard `OFFSET` pagination at high scales.

## 🚀 The Problem with Standard Pagination
In traditional systems using `LIMIT 20 OFFSET 10000`, the database must scan and discard 10,000 rows before returning data, which severely damages performance as the dataset grows. Furthermore, if new data is inserted while a user is browsing, the entire list shifts down, causing the user to experience **duplicate items** or **skip items entirely** on the next page.

## 💡 The Solution: Cursor-Based Pagination
This project implements strict **Cursor-Based Pagination** using a multi-column index (`created_at`, `id`). 

Instead of guessing an offset, the API locks onto the exact timestamp of the last seen item:
`WHERE (created_at < ?) OR (created_at = ? AND id < ?)`

### Key Features
1. **O(1) Pagination Speed:** Instantaneous query returns regardless of how deep into the 200,000 products the user scrolls.
2. **Real-Time Immunity:** New products can be inserted or deleted by other users dynamically without breaking the pagination state of active users.
3. **High-Speed Data Seeding:** Includes a specialized script using chunked native bulk-inserts to shoot 200,000 randomized products into the cloud database in seconds.
4. **Premium UI:** A fully responsive, glassmorphic React frontend built with Vite.

## 🛠 Tech Stack
* **Frontend:** React, Vite, Vanilla CSS
* **Backend:** Node.js, Express
* **Database:** MySQL (Hosted on Aiven)
* **Deployment:** Vercel (UI) & Render (API)

## 💻 Running Locally

### 1. Database Setup
Create your local database or connect to a cloud provider like Aiven.
Run the following SQL commands:
```sql
CREATE DATABASE ecommerce;
USE ecommerce;

CREATE TABLE products (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);

CREATE INDEX idx_created_id ON products(created_at DESC, id DESC);
CREATE INDEX idx_category_created_id ON products(category, created_at DESC, id DESC);
```

### 2. Backend Setup
```bash
cd product-pagination-backend
npm install
```
Create a `.env` file in the backend folder:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ecommerce
```
Seed the database with 200,000 products:
```bash
npm run seed
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd product-pagination-frontend
npm install
npm run dev
```

## 🧪 Live Demonstration Test
To prove the cursor pagination works perfectly under real-time data mutation:
1. Start the frontend and scroll down.
2. Open a new terminal and run: `node product-pagination-backend/scripts/insert-live.js`
3. Click "Load More" on the UI. Notice how it seamlessly picks up exactly where you left off, completely ignoring the 5 new items injected at the top of the database.
