# Frontend Environment Setup

## Create .env.local File

**IMPORTANT:** You must create this file for the frontend to connect to the backend!

### Step 1: Create the file
In the `frontend/` directory, create a file named `.env.local`

### Step 2: Add this content:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Step 3: Restart your Next.js dev server
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

---

## For Production (EC2)

When deploying to EC2, create `.env.production` with your production API URL:

```
NEXT_PUBLIC_API_URL=http://your-ec2-ip:8000/api
```

Or if using a domain:
```
NEXT_PUBLIC_API_URL=https://api.your-domain.com
```

---

## Verify It's Working

After creating `.env.local`, you can verify it's loaded:

```javascript
// In your browser console (F12):
console.log(process.env.NEXT_PUBLIC_API_URL)
// Should show: http://localhost:8000/api
```

---

## Quick Setup Script (PowerShell)

Copy and paste this into PowerShell from the `frontend/` directory:

```powershell
# Create .env.local file
@"
NEXT_PUBLIC_API_URL=http://localhost:8000/api
"@ | Out-File -FilePath .env.local -Encoding utf8

Write-Host "✅ .env.local created successfully!"
```

---

## Troubleshooting

**"Cannot find module '@/lib/api'"**
- Make sure you created `frontend/lib/api.js`
- Restart Next.js dev server

**"Network request failed"**
- Make sure Django backend is running: `cd backend && python manage.py runserver`
- Check `.env.local` has correct URL
- Check CORS is configured in Django settings

**"CORS error"**
- Backend must be running with CORS enabled
- Frontend URL must be in `CORS_ALLOWED_ORIGINS` in Django settings

---

## Complete Startup Process

### Terminal 1 - Backend:
```bash
cd backend
python manage.py runserver
```

### Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

### Browser:
```
http://localhost:3000
```

✅ Both should be running for the app to work!

