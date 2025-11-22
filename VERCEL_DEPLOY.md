# Deploying to Vercel

## Quick Answer
**Deploy the `frontend` folder** on Vercel.

## Step-by-Step Instructions

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your Git repository
4. **Set the Root Directory to `frontend`**:
   - Click "Configure Project"
   - Under "Root Directory", select `frontend`
   - Or manually type: `frontend`
5. Vercel will auto-detect Vite settings
6. **Add Environment Variable**:
   - Go to Project Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend-url.com`
     - (Replace with your actual backend URL)
7. Click "Deploy"

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to frontend folder
cd frontend

# Deploy
vercel

# Follow the prompts
# When asked for root directory, confirm it's the current directory (frontend)
```

### Option 3: Deploy from Root (Alternative)

If you want to deploy from the root directory:

1. Create `vercel.json` in the root:
```json
{
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "installCommand": "cd frontend && npm install"
}
```

2. Set Root Directory to `.` (root) in Vercel dashboard

## Backend Deployment

The Python FastAPI backend (`app/` folder) needs to be deployed separately:

### Recommended Platforms:
- **Railway**: https://railway.app (easiest for Python)
- **Render**: https://render.com
- **Fly.io**: https://fly.io
- **Heroku**: https://heroku.com

### After Backend is Deployed:
1. Get your backend URL (e.g., `https://your-app.railway.app`)
2. Update `VITE_API_URL` in Vercel environment variables
3. Redeploy the frontend

## Environment Variables

In Vercel, set:
- `VITE_API_URL`: Your backend API URL (e.g., `https://api.example.com`)

**Note**: Vite environment variables must start with `VITE_` to be accessible in the browser.

## Troubleshooting

- **Build fails**: Make sure Root Directory is set to `frontend`
- **API not working**: Check `VITE_API_URL` is set correctly
- **CORS errors**: Make sure your backend allows requests from your Vercel domain

