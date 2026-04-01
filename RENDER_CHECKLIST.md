# 🚀 Render Deployment Checklist

Quick checklist for deploying your Background Remover API to Render.

## ✅ Pre-Deployment Checklist

### Repository Preparation
- [ ] All code pushed to GitHub
- [ ] `render.yaml` file exists in root
- [ ] `requirements.txt` includes all dependencies
- [ ] `.env.example` shows required environment variables
- [ ] Health check endpoint `/health` exists

### Database Setup
- [ ] Neon PostgreSQL database created
- [ ] Database connection string copied
- [ ] Database tables can be created automatically

### Environment Variables Ready
- [ ] `DATABASE_URL` - Neon connection string
- [ ] `SECRET_KEY` - Secure JWT secret
- [ ] `ACCESS_TOKEN_EXPIRE_MINUTES` - Token expiration (30)
- [ ] `DEBUG` - Set to False for production

## 🌐 Render Setup Steps

### 1. Create Render Account
- [ ] Sign up at [render.com](https://render.com)
- [ ] Verify email address
- [ ] Connect GitHub account

### 2. Create Web Service
- [ ] Go to Dashboard → "New +" → "Web Service"
- [ ] Connect GitHub repository: `Raja0Singh/Background-Remover`
- [ ] Select repository and branch: `main`
- [ ] Configure service settings

### 3. Service Configuration
- [ ] **Name**: `background-remover-api`
- [ ] **Runtime**: `Python 3`
- [ ] **Build Command**: `pip install -r requirements.txt`
- [ ] **Start Command**: `uvicorn app:app --host 0.0.0.0 --port $PORT`
- [ ] **Health Check Path**: `/health`

### 4. Environment Variables
- [ ] Add `DATABASE_URL` with Neon connection string
- [ ] Add `SECRET_KEY` (generate secure value)
- [ ] Add `ACCESS_TOKEN_EXPIRE_MINUTES=30`
- [ ] Add `DEBUG=False`

### 5. Deploy
- [ ] Click "Create Web Service"
- [ ] Wait for build to complete (2-5 minutes)
- [ ] Check deployment logs for errors

## 🧪 Post-Deployment Testing

### Health Check
- [ ] Visit `https://your-service.onrender.com/health`
- [ ] Should return: `{"status":"healthy","service":"background-removal-api"}`

### API Endpoints
- [ ] Test `GET /login` - Should return HTML page
- [ ] Test `POST /register` - Should create new user
- [ ] Test `POST /login` - Should return JWT token
- [ ] Test `GET /users/me` - Should return user data (with auth)

### Frontend Integration
- [ ] Update Vercel frontend with Render URL
- [ ] Set `VITE_API_BASE_URL=https://your-service.onrender.com`
- [ ] Test full application flow
- [ ] Verify CORS is working correctly

## 🔧 Troubleshooting

### Build Failures
- [ ] Check build logs in Render dashboard
- [ ] Verify all dependencies in `requirements.txt`
- [ ] Ensure Python version compatibility
- [ ] Check for syntax errors in code

### Runtime Errors
- [ ] Check service logs in Render dashboard
- [ ] Verify environment variables are set
- [ ] Test database connection
- [ ] Check CORS configuration

### Health Check Failures
- [ ] Ensure `/health` endpoint exists
- [ ] Verify endpoint returns 200 status
- [ ] Check for import errors in startup

### Database Connection Issues
- [ ] Test Neon connection string locally
- [ ] Verify SSL mode is enabled
- [ ] Check database user permissions
- [ ] Ensure database is active

## 📱 Production Readiness

### Security
- [ ] Strong `SECRET_KEY` generated
- [ ] HTTPS enforced (automatic on Render)
- [ ] CORS configured for frontend domain
- [ ] Environment variables not exposed

### Performance
- [ ] Free tier limitations understood
- [ ] Health checks working
- [ ] Response times acceptable
- [ ] Error handling in place

### Monitoring
- [ ] Service logs accessible
- [ ] Health check monitoring enabled
- [ ] Database monitoring set up
- [ ] Error alerts configured

## 🔄 Maintenance

### Regular Tasks
- [ ] Monitor service logs
- [ ] Check database usage
- [ ] Update dependencies regularly
- [ ] Backup important data

### Scaling
- [ ] Monitor performance metrics
- [ ] Plan for traffic increases
- [ ] Consider paid plan if needed
- [ ] Set up alerts for issues

## 📞 Support Resources

### Render Documentation
- [ ] [Render Docs](https://render.com/docs)
- [ ] [Python Guide](https://render.com/docs/deploy-python-app)
- [ ] [Environment Variables](https://render.com/docs/env-vars)

### Troubleshooting Help
- [ ] [Render Status](https://status.render.com)
- [ ] [Community Discord](https://discord.gg/render)
- [ ] [GitHub Issues](https://github.com/render)

---

## 🎉 Quick Deployment Command Summary

```bash
# 1. Push latest code
git add .
git commit -m "Ready for Render deployment"
git push origin main

# 2. Go to render.com and:
# - Connect repository
# - Configure service
# - Set environment variables
# - Deploy!

# 3. Test deployment
curl https://your-service.onrender.com/health

# 4. Update frontend
# In Vercel dashboard: VITE_API_BASE_URL=https://your-service.onrender.com
```

**🚀 Your API will be live at: `https://your-service-name.onrender.com`**
