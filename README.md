# Anycomp - Company Registration & Management Platform

A production-grade PERN stack (PostgreSQL, Express, React/Next.js, Node.js) application for managing company specialists and service offerings.

## 🏗️ Architecture Overview

### Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Material UI
- Redux Toolkit
- Axios

**Backend:**
- Node.js + Express.js
- TypeORM
- PostgreSQL
- Zod (Validation)
- JWT Authentication (Optional)

## 📁 Project Structure

```
anycomp/
├── backend/               # Express + TypeORM API
│   ├── src/
│   │   ├── config/       # Database & environment config
│   │   ├── entities/     # TypeORM entities
│   │   ├── controllers/  # Request handlers
│   │   ├── services/     # Business logic
│   │   ├── routes/       # API routes
│   │   ├── middlewares/  # Validation, error handling
│   │   ├── dtos/         # Data transfer objects
│   │   └── utils/        # Helper functions
│   └── package.json
│
└── frontend/             # Next.js application
    ├── src/
    │   ├── app/         # Next.js app router pages
    │   ├── components/  # React components
    │   ├── store/       # Redux store & slices
    │   ├── services/    # API client services
    │   ├── types/       # TypeScript types
    │   └── hooks/       # Custom React hooks
    └── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL 14+
- Git

### 1. Clone Repository

```bash
git clone <repository-url>
cd anycomp
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Edit .env with your database credentials
```

**.env Configuration:**

```env
NODE_ENV=development
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=anycomp_db
DB_SSL=false

# JWT (Optional)
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3000
```

**Create Database:**

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE anycomp_db;

# Exit
\q
```

**Run Backend:**

```bash
# Development mode
npm run dev

# Build for production
npm run build
npm start
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local

# Edit .env.local
```

**.env.local Configuration:**

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

**Run Frontend:**

```bash
# Development mode
npm run dev

# Build for production
npm run build
npm start
```

Frontend will run on `http://localhost:3000`

## 📋 Database Schema

### Tables

1. **specialists** - Main entity for company specialists
   - Columns: id, name, description, status, contact_email, contact_phone, website_url, logo_id, published_at, created_at, updated_at
   - Status: `draft` | `published`

2. **service_offerings** - Services provided by specialists
   - Columns: id, specialist_id (FK), service_name, service_type, description, platform_fee_id (FK), created_at, updated_at

3. **platform_fee** - Fee configuration
   - Columns: id, fee_name, fee_percentage, fee_fixed_amount, is_active, created_at, updated_at

4. **media** - File storage references
   - Columns: id, specialist_id (FK), file_name, file_url, file_type, file_size, media_type, uploaded_at

### Relationships

- `specialists` → `service_offerings` (One-to-Many, CASCADE delete)
- `specialists` → `media` (One-to-Many, SET NULL delete)
- `service_offerings` → `platform_fee` (Many-to-One, SET NULL delete)
- `specialists.logo_id` → `media.id` (One-to-One, SET NULL delete)

## 🌐 API Endpoints

### Specialists

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/specialists` | Get all specialists (with filters) | Optional |
| GET | `/api/specialists/public` | Get published specialists only | No |
| GET | `/api/specialists/:id` | Get specialist by ID | Optional |
| POST | `/api/specialists` | Create new specialist | Optional |
| PUT | `/api/specialists/:id` | Update specialist | Optional |
| PATCH | `/api/specialists/:id/publish` | Publish/unpublish specialist | Optional |
| DELETE | `/api/specialists/:id` | Delete specialist | Optional |

### Query Parameters (GET requests)

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `status` - Filter by status (`draft` | `published`)
- `search` - Search by name
- `sortBy` - Sort field (`created_at` | `name` | `updated_at`)
- `sortOrder` - Sort order (`ASC` | `DESC`)

### Example Requests

**Create Specialist:**

```bash
POST /api/specialists
Content-Type: application/json

{
  "name": "Tech Solutions Inc",
  "description": "Leading technology solutions provider",
  "contact_email": "contact@techsolutions.com",
  "contact_phone": "+1234567890",
  "website_url": "https://techsolutions.com",
  "service_offerings": [
    {
      "service_name": "Web Development",
      "service_type": "Technology",
      "description": "Full-stack web development services"
    }
  ]
}
```

**Get Specialists with Filters:**

```bash
GET /api/specialists?status=published&page=1&limit=10&search=tech
```

## 🎨 Features

### PAGE 1: All Specialists List
- ✅ Table view with pagination
- ✅ Status filters (All | Published | Draft)
- ✅ Real-time search functionality
- ✅ Sort by name, date
- ✅ Edit and delete actions
- ✅ Loading states
- ✅ Empty states

### PAGE 2: Create Specialist
- ✅ Form validation
- ✅ Dynamic service offerings
- ✅ Auto-save as draft
- ✅ Error handling
- ✅ Success/failure feedback

### PAGE 3: Edit Specialist
- ✅ Load existing data
- ✅ Update specialist info
- ✅ Manage service offerings
- ✅ Publish/Unpublish toggle
- ✅ Status indicator
- ✅ Validation

### Key Features
- 🔒 Type-safe with TypeScript
- 🎯 RESTful API architecture
- 🔍 Advanced search and filtering
- 📄 Pagination (10+ rows)
- ✨ Material UI components
- 🎨 Pixel-perfect UI from Figma
- 🚀 Production-ready code
- 📊 Redux state management
- ⚡ Optimized performance
- 🛡️ Error handling & validation

## 🎯 Business Logic

### Draft vs Published Flow

1. **Create Specialist**: Automatically created with `status: draft`
2. **Edit Specialist**: Can update all fields while in draft
3. **Publish**: Changes status to `published` and sets `published_at` timestamp
4. **Public View**: Only `published` specialists appear in public endpoints
5. **Unpublish**: Revert to draft status (preserves `published_at`)

### Data Validation

- Email format validation
- URL format validation
- Required field checks
- Service offering validation
- Unique email constraint

## 🚢 Deployment

### Backend Deployment (Railway, Render, Heroku)

1. **Environment Variables**: Set all production env vars
2. **Database**: Use managed PostgreSQL (e.g., Railway Postgres)
3. **Build Command**: `npm run build`
4. **Start Command**: `npm start`

**Railway Example:**

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize
railway init

# Link database
railway add --postgres

# Deploy
railway up
```

### Frontend Deployment (Vercel, Netlify)

**Vercel (Recommended):**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Set environment variable
vercel env add NEXT_PUBLIC_API_URL
```

**Environment Variables:**
- `NEXT_PUBLIC_API_URL`: Your backend API URL

## 🧪 Testing

```bash
# Backend
cd backend
npm run test

# Frontend
cd frontend
npm run test
```

## 📊 Performance Optimizations

- Database indexes on frequently queried columns
- Server-side pagination
- Debounced search queries
- Lazy loading of images
- Code splitting (Next.js automatic)
- API response caching headers
- Connection pooling (TypeORM)

## 🔒 Security Features

- Input sanitization
- SQL injection prevention (TypeORM)
- XSS protection
- CORS configuration
- Helmet.js security headers
- Environment variable protection
- JWT authentication (optional bonus)
- Role-based access control (optional bonus)

## 📝 Code Quality

- **TypeScript**: Strict type checking
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Error Boundaries**: React error handling
- **Centralized Error Handler**: Express middleware
- **Validation Layer**: Zod schemas
- **Service Layer**: Separated business logic

## 🎓 Interview Preparation

### Key Talking Points

1. **Architecture**: Clean separation of concerns (routes → controllers → services → entities)
2. **Type Safety**: End-to-end TypeScript with shared types
3. **Scalability**: Service layer allows easy feature additions
4. **Performance**: Indexed queries, pagination, debouncing
5. **UX**: Loading states, error handling, optimistic updates
6. **Database Design**: Normalized schema with proper relationships
7. **API Design**: RESTful conventions with clear endpoints
8. **State Management**: Redux Toolkit for predictable state
9. **Validation**: Both frontend (UX) and backend (security)
10. **Deployment**: Production-ready configuration

### Common Questions

**Q: Why TypeORM over Prisma?**
A: TypeORM provides decorator-based entities similar to Java/Spring, offers more flexibility for complex queries, and has excellent TypeScript support.

**Q: Why Redux Toolkit over Context API?**
A: Redux Toolkit provides better dev tools, time-travel debugging, middleware support, and scales better for larger applications.

**Q: How do you handle file uploads?**
A: Media table stores references. In production, use cloud storage (S3, Cloudinary) and store URLs in the database.

**Q: How would you add authentication?**
A: Implement JWT middleware, add user entity, create auth routes, protect endpoints, add role-based access control for admin features.

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Test connection
psql -h localhost -U postgres -d anycomp_db
```

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### TypeORM Synchronize Issues
```bash
# Drop and recreate database
dropdb anycomp_db && createdb anycomp_db

# Or use migrations
npm run migration:generate
npm run migration:run
```# anycomp
