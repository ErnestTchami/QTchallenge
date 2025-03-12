# URL Shortener - Full Stack Application

A modern URL shortening service built with Next.js 14 and Node.js, featuring user authentication, analytics, and real-time URL management.

## 🚀 Live Demo

- Frontend: [https://qt-tchallenge.vercel.app](https://qt-tchallenge.vercel.app)
- API: [https://pharmacy-front-back.onrender.com](https://pharmacy-front-back.onrender.com)

## ✨ Features

- **User Authentication**
  - Secure password hashing
  - Session management
  
- **URL Management**
  - Create shortened URLs
  - Copy to clipboard functionality
  - Real-time statistics
  
- **Modern UI/UX**
  - Responsive design
  - Loading states
  - Toast notifications
  
- **Advanced Features**
  - URL click tracking
  - Analytics dashboard
  - Bulk operations

## 🛠 Tech Stack

### Frontend
- Next.js 14
- TypeScript
- TailwindCSS
- TanStack Query
- React Hook Form
- Zod Validation
- Framer Motion
- Axios

### Backend
- Node.js
- Express
- PostgreSQL
- bcrypt
- cors

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm/yarn
- PostgreSQL

### Frontend Setup
```bash
# Clone the repository
git clone https://github.com/ErnestTchami/QTchallenge.git

# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```



## 📱 API Endpoints

### Authentication