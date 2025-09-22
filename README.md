# Hedge Your Bets - Team Project

This is a simple team project setup with both Next.js frontend and Django backend.

## Project Structure

```
hedge-your-bets/
├── frontend/          # Next.js application
├── backend/           # Django application
└── README.md
```

## Prerequisites

Before running the project, make sure you have:

- **Node.js** (version 16 or higher) - Download from [nodejs.org](https://nodejs.org/)
- **Python** (version 3.8 or higher) - Download from [python.org](https://python.org/)
- **npm** (comes with Node.js)
- **pip** (comes with Python)

### Windows PowerShell Setup

If you're using Windows PowerShell and encounter execution policy issues:

1. Open PowerShell as Administrator
2. Run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
3. Or use Command Prompt instead of PowerShell

## Setup Instructions

### Frontend (Next.js)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the homepage.

5. Test the API endpoint at [http://localhost:3000/api/hello](http://localhost:3000/api/hello)

### Backend (Django)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   ```
   - On Windows: `venv\Scripts\activate`
   - On Mac/Linux: `source venv/bin/activate`

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run migrations:
   ```bash
   python manage.py migrate
   ```

5. Run the development server:
   ```bash
   python manage.py runserver
   ```

6. The Django server will be available at [http://127.0.0.1:8000](http://127.0.0.1:8000)

7. Test the API endpoint at [http://127.0.0.1:8000/api/hello/](http://127.0.0.1:8000/api/hello/)

### Troubleshooting

- If Python is not found, make sure Python is installed and added to your system PATH
- If npm commands fail, try using Command Prompt instead of PowerShell
- If you get permission errors, try running your terminal as Administrator

## API Endpoints

### Next.js API
- **GET** `/api/hello` - Returns a simple JSON response with team information

### Django API
- **GET** `/api/hello/` - Returns a simple JSON response with team information

## Team Members

Add your team members here:
- Tony Gonzalez
-Timothy Tsang

## Requirements

- Node.js (for Next.js)
- Python 3.x (for Django)
- npm or yarn (for package management)
- pip (for Python packages)
