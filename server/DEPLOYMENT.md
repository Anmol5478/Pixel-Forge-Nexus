# PixelForge Nexus Server Deployment Guide

This guide will help you deploy your server so it can run continuously 24/7.

## 🚀 Quick Deploy Options

### Option 1: Railway (Recommended - Free & Easy)
1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway will automatically detect the configuration and deploy
6. Your server will be available at `https://your-app-name.railway.app`

### Option 2: Render (Free Tier Available)
1. Go to [Render.com](https://render.com)
2. Sign up and connect your GitHub
3. Click "New" → "Web Service"
4. Connect your repository
5. Set build command: `npm install`
6. Set start command: `npm start`
7. Deploy!

### Option 3: Heroku (Paid)
1. Install Heroku CLI
2. Run these commands:
```bash
heroku login
heroku create your-app-name
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

## 🖥️ VPS/Server Deployment (PM2)

### Prerequisites
- Node.js installed
- PM2 installed globally: `npm install -g pm2`

### Deployment Steps
1. Upload your server files to your VPS
2. Navigate to the server directory
3. Run the deployment script:
```bash
./deploy.sh
```

### Manual PM2 Setup
```bash
# Install dependencies
npm install

# Start the server
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Setup auto-start on boot
pm2 startup
```

### PM2 Commands
```bash
pm2 status                    # Check server status
pm2 logs pixelforge-nexus-server  # View logs
pm2 restart pixelforge-nexus-server  # Restart server
pm2 stop pixelforge-nexus-server     # Stop server
pm2 delete pixelforge-nexus-server   # Remove from PM2
```

## 🔧 Environment Variables

Make sure to set these environment variables in your deployment platform:

- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A secure secret for JWT tokens
- `PORT`: Port number (usually set automatically)

## 📊 Monitoring

### Health Check
Your server includes a health check endpoint at `/api/health`

### Logs
- Railway/Render: View in dashboard
- PM2: `pm2 logs pixelforge-nexus-server`
- Heroku: `heroku logs --tail`

## 🔒 Security Considerations

1. **Environment Variables**: Never commit sensitive data to your repository
2. **JWT Secret**: Use a strong, random secret
3. **MongoDB**: Use a secure connection string
4. **CORS**: Configure CORS properly for production

## 🚨 Troubleshooting

### Common Issues:
1. **Port Issues**: Make sure your platform sets the PORT environment variable
2. **Database Connection**: Verify your MongoDB URI is correct
3. **Dependencies**: Ensure all dependencies are in package.json

### Debug Commands:
```bash
# Check if server is running
curl http://localhost:3001/api/health

# Check PM2 status
pm2 status

# View detailed logs
pm2 logs pixelforge-nexus-server --lines 100
```

## 📈 Scaling

### Railway/Render
- Upgrade to paid plans for more resources
- Enable auto-scaling features

### PM2
- Increase instances: `pm2 scale pixelforge-nexus-server 2`
- Use load balancer for multiple servers

## 🎯 Next Steps

1. Set up a custom domain
2. Configure SSL certificates
3. Set up monitoring and alerts
4. Implement backup strategies
5. Configure CI/CD pipelines

---

**Need Help?** Check the platform-specific documentation or create an issue in your repository. 