# MyLugha Project Separation Guide

## Current Issues with Your Structure

Your project currently has a **mixed structure** that makes deployment complex:

1. **Frontend files** (React) are mixed with backend files
2. **Multiple Django apps** scattered in different locations
3. **Duplicate configurations** and package files
4. **Inconsistent directory structure**

## Recommended Separation Strategy

### 📁 **Final Directory Structure**

```
MyLugha/
├── frontend/                     # React Frontend (Deploy to Vercel)
│   ├── package.json
│   ├── tailwind.config.js
│   ├── public/
│   │   ├── index.html
│   │   └── languageKenya.jpg
│   ├── src/
│   │   ├── App.js
│   │   ├── index.js
│   │   ├── index.css
│   │   ├── LoginPage.jsx
│   │   ├── MyLugha.jsx
│   │   ├── RegisterPage.jsx
│   │   └── services/
│   │       └── api.js
│   ├── .env.example
│   ├── .env.local
│   └── vercel.json
│
├── backend/                      # Django Backend (Deploy to Heroku/Railway/etc)
│   ├── requirements.txt
│   ├── runtime.txt
│   ├── Procfile
│   ├── .env.example
│   ├── .env
│   ├── manage.py
│   ├── mylugha/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── asgi.py
│   ├── accounts/
│   ├── languages/
│   ├── contributions/
│   └── validations/
│
└── docs/                         # Documentation
    ├── README.md
    ├── DEPLOYMENT_GUIDE.md
    └── API_DOCUMENTATION.md
```

## 🚀 **Step-by-Step Separation Process**

### Step 1: Create New Directory Structure
```bash
cd /c/Users/Admin
mkdir MyLugha-Separated
cd MyLugha-Separated
mkdir frontend backend docs
```

### Step 2: Move Frontend Files
```bash
# Move React files to frontend directory
cp -r /c/Users/Admin/MyLugha/src ./frontend/
cp -r /c/Users/Admin/MyLugha/public ./frontend/
cp /c/Users/Admin/MyLugha/package.json ./frontend/
cp /c/Users/Admin/MyLugha/tailwind.config.js ./frontend/
```

### Step 3: Move Backend Files
```bash
# Move Django files to backend directory
cp -r /c/Users/Admin/MyLugha/server/mylugha/* ./backend/
cp /c/Users/Admin/MyLugha/server/requirements.txt ./backend/
```

### Step 4: Clean Up Configurations

## 📋 **Deployment Configurations**

### Frontend (Vercel)
- **Platform**: Vercel
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Environment Variables**: 
  - `REACT_APP_API_URL=https://your-backend.herokuapp.com/api`

### Backend (Heroku/Railway/Render)
- **Platform**: Heroku, Railway, or Render
- **Database**: PostgreSQL (Heroku Postgres/Neon/Supabase)
- **Environment Variables**: 
  - `SECRET_KEY`
  - `DATABASE_URL` 
  - `ALLOWED_HOSTS`
  - `CORS_ALLOWED_ORIGINS`

## 🔧 **Configuration Updates Needed**

### 1. Frontend API Configuration
Update `frontend/src/services/api.js`:
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
```

### 2. Backend CORS Configuration
Update `backend/mylugha/settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "https://your-frontend.vercel.app",
    "http://localhost:3000",  # For local development
]
```

### 3. Backend Heroku Configuration
Create `backend/Procfile`:
```
web: gunicorn mylugha.wsgi:application
release: python manage.py migrate
```

Create `backend/runtime.txt`:
```
python-3.8.10
```

## 🔗 **Integration Strategy**

### Development Environment
1. **Backend**: Run on `http://localhost:8000`
2. **Frontend**: Run on `http://localhost:3000`
3. **Database**: SQLite for local development

### Production Environment
1. **Backend**: Deploy to Heroku/Railway (`https://your-api.herokuapp.com`)
2. **Frontend**: Deploy to Vercel (`https://your-app.vercel.app`)
3. **Database**: PostgreSQL (Heroku Postgres/Neon)

## 📦 **Deployment Benefits**

### ✅ **Advantages of Separation**
1. **Independent Deployments**: Update frontend/backend separately
2. **Specialized Hosting**: 
   - Vercel optimized for React/Next.js
   - Heroku/Railway optimized for Django
3. **Better Scalability**: Scale frontend and backend independently
4. **Team Collaboration**: Different teams can work on different parts
5. **Cost Optimization**: Pay only for what you use on each platform

### 🎯 **Recommended Hosting Combinations**

#### Option 1: Vercel + Heroku
- **Frontend**: Vercel (Free tier available)
- **Backend**: Heroku (Free tier discontinued, paid plans start at $7/month)
- **Database**: Heroku Postgres

#### Option 2: Vercel + Railway
- **Frontend**: Vercel (Free tier)
- **Backend**: Railway (Free tier with usage limits)
- **Database**: Railway PostgreSQL

#### Option 3: Vercel + Render
- **Frontend**: Vercel (Free tier)
- **Backend**: Render (Free tier available)
- **Database**: Render PostgreSQL

## 🚨 **Important Notes**

1. **Keep your current working directory** as backup until separation is complete
2. **Test thoroughly** after separation
3. **Update all API URLs** in frontend to point to deployed backend
4. **Configure CORS properly** to allow frontend domain
5. **Use environment variables** for all configuration

## 📞 **Need Help?**
After reviewing this guide, I can help you:
1. Execute the separation process
2. Create the necessary configuration files
3. Set up deployment pipelines
4. Test the separated applications
