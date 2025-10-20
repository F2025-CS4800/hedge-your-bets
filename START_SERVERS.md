# 🚀 Quick Server Startup

## Run Both Servers at Once

### **Windows PowerShell:**

**Terminal 1 - Backend:**
```powershell
cd backend
python manage.py runserver
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

---

## Or Use Split Terminal in VS Code

1. Open VS Code terminal
2. Click "Split Terminal" button
3. **Left terminal:** Run backend
4. **Right terminal:** Run frontend

---

## Quick URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000/api
- **Admin Panel:** http://localhost:8000/admin (admin / admin123)

---

## First Time? Run This First!

### **1. Create .env.local:**
```powershell
cd frontend
.\create-env.ps1
```

### **2. Then start servers** (as above)

---

## Verify Everything Works

### **Check Backend:**
Visit: http://localhost:8000/api/hello/

Should see:
```json
{
  "message": "Hello from Django API!",
  "team": "Hedge Your Bets",
  ...
}
```

### **Check Frontend:**
Visit: http://localhost:3000

Should see your betting form!

### **Check Players API:**
Visit: http://localhost:8000/api/players/?team=KC

Should see JSON with Kansas City Chiefs players!

---

## Stop Servers

- Press `Ctrl+C` in each terminal

---

## Pro Tip: Keep Servers Running

While developing:
- Keep both servers running
- Make code changes
- Frontend auto-reloads (Next.js hot reload)
- Backend needs manual restart if you change Python files

---

✅ **You're ready to go!**

