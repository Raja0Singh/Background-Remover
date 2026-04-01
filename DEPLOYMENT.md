# 🚀 Deployment Guide

Complete guide for deploying the Background Remover application to production.

## 📋 Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Vercel        │    │   Vercel/Railway │    │   Neon          │
│   Frontend      │◄──►│   Backend API   │◄──►│   PostgreSQL    │
│   (Static)      │    │   (FastAPI)     │    │   (Database)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🌐 Frontend Deployment (Vercel)

### Step 1: Prepare Repository

```bash
# Clone the repository
git clone https://github.com/Raja0Singh/Background-Remover.git
cd Background-Remover

# Navigate to frontend
cd frontend
```

### Step 2: Install Vercel CLI

```bash
# Install globally
npm install -g vercel

# Login to Vercel
vercel login
```

### Step 3: Deploy Frontend

```bash
# Deploy to Vercel
vercel --prod

# Set environment variable
vercel env add VITE_API_BASE_URL production
# Enter: https://your-backend-url.vercel.app
```

### Step 4: Configure Domain (Optional)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to your project
3. Go to Settings → Domains
4. Add your custom domain
5. Update DNS records as instructed

## 🔧 Backend Deployment Options

### Option 1: Render (Recommended for Beginners)

**Pros**: Free tier, easy setup, auto-deploys from GitHub
**Cons**: Sleeps after inactivity on free plan

See [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) for detailed instructions.

**Quick Start**:

1. Push code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Connect repository and configure
4. Set environment variables
5. Deploy automatically

### Option 2: Vercel Functions

1. **Create `api/index.py`**:

```python
# Vercel serverless function wrapper
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from app import app
from mangum import Mangum

handler = Mangum(app)
```

2. **Update `vercel.json`**:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/api/index.py"
    }
  ],
  "env": {
    "DATABASE_URL": "@database_url",
    "SECRET_KEY": "@secret_key"
  }
}
```

### Option 3: Railway

1. **Connect GitHub Repository**:
   - Go to [Railway Dashboard](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

2. **Configure Environment Variables**:

   ```
   DATABASE_URL=postgresql://neondb_owner:your_password@ep-your-host.neon.tech/neondb
   SECRET_KEY=your-super-secret-jwt-key
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   DEBUG=False
   ```

3. **Deploy**:
   - Railway will automatically build and deploy
   - Get your backend URL from Railway dashboard

## 🗄️ Database Setup (Neon)

### Step 1: Create Neon Database

1. Go to [Neon Console](https://console.neon.tech)
2. Sign up/login
3. Create new project
4. Choose region and PostgreSQL version
5. Copy connection string

### Step 2: Configure Database

```bash
# Test connection
psql "postgresql://neondb_owner:password@ep-host.neon.tech/neondb?sslmode=require"

# Create tables (handled automatically by app)
```

## 🔗 Integration Steps

### 1. Update Environment Variables

**Frontend (Vercel)**:

- `VITE_API_BASE_URL`: Your backend URL

**Backend (Railway/Vercel)**:

- `DATABASE_URL`: Neon connection string
- `SECRET_KEY`: JWT secret
- `ACCESS_TOKEN_EXPIRE_MINUTES`: 30

### 2. Configure CORS

In your backend, ensure CORS allows your frontend domain:

```python
# app.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 3. Test Integration

```bash
# Test backend health
curl https://your-backend.vercel.app/health

# Test frontend access
# Open https://your-frontend.vercel.app
```

## 📱 Deployment Checklist

### Frontend (Vercel)

- [ ] Repository cloned and frontend folder selected
- [ ] Dependencies installed (`npm install`)
- [ ] Environment variables set (`VITE_API_BASE_URL`)
- [ ] Build successful (`npm run build`)
- [ ] Deployed to production (`vercel --prod`)
- [ ] Custom domain configured (optional)

### Backend (Railway/Vercel)

- [ ] Repository connected to deployment platform
- [ ] Environment variables configured
- [ ] Database connection working
- [ ] Health endpoint responding
- [ ] CORS configured for frontend domain
- [ ] SSL certificate active

### Database (Neon)

- [ ] Database created
- [ ] Connection string secured
- [ ] Tables initialized
- [ ] Backup configured
- [ ] Monitoring enabled

## 🔒 Security Considerations

### Environment Variables

- Never commit `.env` files
- Use platform-specific secret management
- Rotate secrets regularly

### CORS Configuration

- Only allow trusted origins
- Use HTTPS in production
- Validate request headers

### Database Security

- Use connection pooling
- Enable SSL connections
- Regular backups
- Monitor access logs

## 🚀 Performance Optimization

### Frontend

- Enable gzip compression
- Use CDN for static assets
- Implement caching strategies
- Optimize images and fonts

### Backend

- Enable response caching
- Use connection pooling
- Implement rate limiting
- Monitor performance metrics

## 🐛 Troubleshooting

### Common Issues

**CORS Errors**:

```bash
# Check CORS configuration
curl -H "Origin: https://your-frontend.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS https://your-backend.vercel.app/login
```

**Database Connection**:

```bash
# Test database connection
python -c "
import os
from database import get_db_connection
conn = get_db_connection()
print('Database connection successful!')
"
```

**Build Failures**:

```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📊 Monitoring

### Frontend (Vercel)

- Built-in analytics
- Performance metrics
- Error tracking
- Web Vitals

### Backend (Railway/Vercel)

- Request logs
- Response times
- Error rates
- Resource usage

### Database (Neon)

- Query performance
- Connection metrics
- Storage usage
- Backup status

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./frontend

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: railway-app/railway-action@v1
        with:
          railway-token: ${{ secrets.RAILWAY_TOKEN }}
```

## 📞 Support

For deployment issues:

1. Check platform-specific documentation
2. Review error logs
3. Test individual components
4. Verify environment variables
5. Check network connectivity

---

**🎉 Your Background Remover is now ready for production!**
