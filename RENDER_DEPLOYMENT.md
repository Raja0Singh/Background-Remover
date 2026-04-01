# 🚀 Render Backend Deployment Guide

Complete guide for deploying the Background Remover API backend to Render.

## 📋 Prerequisites

- Render account (free tier available)
- GitHub repository with the project code
- Neon PostgreSQL database (or Render PostgreSQL)

## 🌐 Step-by-Step Deployment

### Step 1: Prepare Your Repository

Make sure your repository is pushed to GitHub with all the latest changes:

```bash
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

### Step 2: Set Up Neon Database

1. **Go to [Neon Console](https://console.neon.tech)**
2. **Create new project** or use existing one
3. **Copy connection string** from the dashboard
4. **Save it for later use** in Render environment variables

### Step 3: Deploy to Render

#### Option A: Using Render Dashboard (Recommended)

1. **Go to [Render Dashboard](https://dashboard.render.com)**
2. **Click "New +" → "Web Service"**
3. **Connect GitHub repository**
4. **Select your repository**: `Raja0Singh/Background-Remover`
5. **Configure the service**:

**Basic Settings**:
- **Name**: `background-remover-api`
- **Region**: Choose nearest to your users
- **Branch**: `main`
- **Root Directory**: `.` (project root)
- **Runtime**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app:app --host 0.0.0.0 --port $PORT`

**Advanced Settings**:
- **Health Check Path**: `/health`
- **Auto-Deploy**: Enabled (for automatic updates)

#### Option B: Using render.yaml (Infrastructure as Code)

1. **Push render.yaml to your repository** (already created)
2. **Connect your GitHub repo to Render**
3. **Render will automatically detect and create the service**

### Step 4: Configure Environment Variables

In your Render service settings, add these environment variables:

**Required Variables**:
```bash
DATABASE_URL=postgresql://neondb_owner:your_password@ep-your-host.neon.tech/neondb?sslmode=require
SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
```

**Optional Variables**:
```bash
ACCESS_TOKEN_EXPIRE_MINUTES=30
DEBUG=False
HOST=0.0.0.0
PORT=8000
```

### Step 5: Deploy and Test

1. **Click "Deploy"** in Render dashboard
2. **Wait for deployment** (usually 2-5 minutes)
3. **Test the health endpoint**:
   ```bash
   curl https://your-service-name.onrender.com/health
   ```
4. **Test API endpoints**:
   ```bash
   curl https://your-service-name.onrender.com/login
   ```

## 🔧 Configuration Details

### render.yaml Explained

```yaml
services:
  - type: web          # Web service type
    name: background-remover-api
    runtime: python    # Python runtime
    plan: free         # Free tier (upgrade as needed)
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn app:app --host 0.0.0.0 --port $PORT
    healthCheckPath: /health  # Health check endpoint
    envVars:           # Environment variables
      - key: DATABASE_URL
        sync: false    # Don't sync with other services
      - key: SECRET_KEY
        generateValue: true  # Auto-generate secure value
```

### CORS Configuration

Update your CORS settings in `app.py` to allow your frontend:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-frontend.vercel.app",
        "http://localhost:3000"  # For local development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 📱 Frontend Integration

After deploying your backend to Render:

1. **Get your Render URL**: `https://your-service-name.onrender.com`
2. **Update frontend environment variable**:
   ```bash
   # In Vercel dashboard
   VITE_API_BASE_URL=https://your-service-name.onrender.com
   ```

3. **Update CORS in backend** to allow your frontend domain

## 🔒 Security Best Practices

### Environment Variables

- **Never commit secrets to Git**
- **Use Render's encrypted environment variables**
- **Generate secure random secrets**
- **Rotate secrets regularly**

### Database Security

- **Use SSL connections** (Neon automatically does this)
- **Limit database user permissions**
- **Monitor database access logs**
- **Regular backups** (Neon handles this automatically)

### API Security

- **Enable rate limiting** (upgrade to paid plan if needed)
- **Use HTTPS only** (Render provides this automatically)
- **Validate all inputs**
- **Implement proper error handling**

## 🚀 Performance Optimization

### Render Service Settings

1. **Upgrade to paid plan** for better performance
2. **Enable auto-scaling** based on traffic
3. **Use CDN** for static assets (if needed)
4. **Configure health checks** properly

### Database Optimization

1. **Use connection pooling**
2. **Optimize database queries**
3. **Add database indexes**
4. **Monitor query performance**

## 🐛 Troubleshooting

### Common Issues

**Build Failures**:
```bash
# Check build logs in Render dashboard
# Common causes:
# - Missing dependencies in requirements.txt
# - Python version mismatch
# - Syntax errors in code
```

**Database Connection Issues**:
```bash
# Test database connection
python -c "
import os
from database import get_db_connection
conn = get_db_connection()
print('Database connected successfully!')
"
```

**CORS Issues**:
```bash
# Test CORS with curl
curl -H "Origin: https://your-frontend.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS https://your-service.onrender.com/login
```

**Health Check Failures**:
```bash
# Make sure /health endpoint exists and returns 200
curl https://your-service.onrender.com/health
```

### Debug Mode

For debugging, you can temporarily enable debug mode:
```bash
# In Render environment variables
DEBUG=True
```

**Remember to disable in production!**

## 📊 Monitoring

### Render Dashboard

- **Service logs**: Real-time application logs
- **Metrics**: CPU, memory, and response time
- **Health checks**: Service availability
- **Deployments**: Build and deployment history

### Database Monitoring

- **Neon console**: Query performance and usage
- **Connection metrics**: Active connections
- **Storage usage**: Database size and growth

## 🔄 CI/CD Integration

### Automatic Deployments

Render automatically deploys when you push to GitHub:

```bash
git add .
git commit -m "Update API endpoints"
git push origin main
# Render will automatically build and deploy
```

### Pre-deploy Hooks

Add to `render.yaml` for custom build steps:

```yaml
services:
  - type: web
    # ... other config
    buildFilter: "src/*"  # Only build when src files change
    buildCommand: |
      pip install -r requirements.txt
      python -m pytest tests/  # Run tests
```

## 💰 Pricing

### Free Tier Limitations
- **750 hours/month** of compute time
- **Shared CPU**
- **512MB RAM**
- **No custom domains**
- **Sleeps after 15 minutes of inactivity**

### Paid Plans
- **Standard**: $7/month (more RAM, no sleep)
- **Plus**: $20/month (dedicated CPU, more resources)
- **Pro**: $100/month (high performance, scaling)

## 📞 Support

### Render Support
- **Documentation**: [render.com/docs](https://render.com/docs)
- **Status Page**: [status.render.com](https://status.render.com)
- **Email Support**: Available for paid plans

### Community
- **Discord Community**: Active developer community
- **GitHub Issues**: Report bugs and feature requests
- **Stack Overflow**: Tag questions with `render`

---

**🎉 Your Background Remover API is now ready for production on Render!**

### Quick Checklist Before Going Live
- [ ] Repository pushed to GitHub
- [ ] Neon database created and tested
- [ ] Render service configured
- [ ] Environment variables set
- [ ] Health check working
- [ ] CORS configured for frontend
- [ ] Frontend updated with backend URL
- [ ] Testing completed
- [ ] Monitoring configured

**Your API URL**: `https://your-service-name.onrender.com`
