# Chat Application

A full-stack chat application where users can create accounts, send and accept friend requests, and chat with their friends in real-time.

## Tech Stack

**Frontend:** React, Vite, react-router-dom, redux, daisyUi 
**Backend:** Node.js, Express.js, Prisma ORM, MySQL, JWT, socket.io

## Prerequisites

- Node.js (v14+)
- MySQL Database

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <repository-folder>
```

### 2. Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Create a `.env` file:

```env
API_URL="http://localhost:3000"
```

Install dependencies and start:

```bash
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`.

---

### 3. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a `.env` file:

```env
DATABASE_URL="mysql://your_username:your_password@localhost:3306/chat_app"
DATABASE_USER="your_username"
DATABASE_PASSWORD="your_password"
DATABASE_NAME="chat_app"
DATABASE_HOST="localhost"
DATABASE_PORT=3306

CLIENT_URL="http://localhost:5173"

PORT=3000

JWT_SECRET=your_secure_random_secret_key_here
```

**Important:** Replace `your_username`, `your_password`, and `your_secure_random_secret_key_here` with your actual values.

Install dependencies and set up the database:

```bash
npm install
npx prisma generate
npx prisma migrate dev
```

Start the server:

```bash
npm run dev
```

The backend will run on `http://localhost:3000`.

---

## Important Notes

⚠️ **This application requires MySQL.** The Prisma schema is configured for MySQL and may not work with PostgreSQL or SQLite.

- Use a strong, random `JWT_SECRET` 
- If you change ports, update the corresponding `.env` files

---

## Running the Application

1. Start MySQL server
2. Start backend: `cd backend && npm run devt`
3. Start frontend: `cd frontend && npm run dev`
4. Open `http://localhost:5173` in your browser

---

## Features

- User registration and authentication
- Send and accept friend requests
- Real-time chat with friends

---

## Troubleshooting

- **Database connection error**: Check MySQL is running and `.env` credentials are correct
- **Port in use**: Change port in `.env` files
- **Prisma errors**: Run `npx prisma generate` again in the backend root directory.
