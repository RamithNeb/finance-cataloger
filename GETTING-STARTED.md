# 🎓 Getting Started - Simple Guide

**Never built a web app before? No problem. Follow these steps exactly.**

---

## What You're Building

A website that shows you a list of AI projects used in banks and financial companies. You can search them, filter them, and read details about each one.

Think of it like a library catalog, but for AI in finance.

---

## Step 1: Install Required Software

You need 3 things on your computer:

### Python (The backend language)
1. Go to https://www.python.org/downloads/
2. Download Python 3.11 or newer
3. Run the installer
4. ✅ **Check "Add Python to PATH"** during installation
5. Verify: Open Terminal/Command Prompt and type:
   ```bash
   python3 --version
   ```
   You should see something like `Python 3.11.x`

### Node.js (The frontend language)
1. Go to https://nodejs.org/
2. Download the LTS (Long Term Support) version
3. Run the installer
4. Verify: Open Terminal/Command Prompt and type:
   ```bash
   node --version
   npm --version
   ```
   You should see version numbers

### Git (Version control)
1. Go to https://git-scm.com/downloads
2. Download for your OS (Windows/Mac/Linux)
3. Run the installer (default settings are fine)
4. Verify: Open Terminal/Command Prompt and type:
   ```bash
   git --version
   ```

---

## Step 2: Download the Project

Open Terminal (Mac/Linux) or Command Prompt (Windows) and type:

```bash
# Navigate to where you want the project (e.g., Desktop)
cd Desktop

# Download the project
git clone https://github.com/YOUR_USERNAME/finance-cataloger.git

# Enter the project folder
cd finance-cataloger
```

---

## Step 3: Set Up the Backend (Python Part)

Still in Terminal/Command Prompt:

```bash
# Create a virtual environment (isolated Python space)
python3 -m venv .venv

# Activate it
# On Mac/Linux:
source .venv/bin/activate
# On Windows:
.venv\Scripts\activate

# You should see (.venv) at the start of your command line now

# Install Python packages
pip install -r requirements.txt
```

**What just happened?**
- You created an isolated space for Python packages (`.venv`)
- You installed all the libraries the backend needs (FastAPI, Uvicorn, etc.)

---

## Step 4: Set Up the Frontend (JavaScript Part)

Still in Terminal/Command Prompt:

```bash
# Go into the frontend folder
cd frontend

# Install JavaScript packages
npm install

# Go back to main folder
cd ..
```

**What just happened?**
- You installed all the libraries the frontend needs (React, Vite, Tailwind, etc.)
- This creates a `node_modules` folder with ~200MB of stuff (normal!)

---

## Step 5: Start the Application

You need **TWO terminal windows** open:

### Terminal Window 1 (Backend):
```bash
cd finance-cataloger
source .venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

**Leave this window running. Don't close it.**

### Terminal Window 2 (Frontend):
```bash
cd finance-cataloger/frontend
npm run dev
```

You should see:
```
VITE v7.1.12  ready in 211 ms
➜  Local:   http://localhost:5173/
```

**Leave this window running too.**

---

## Step 6: Open the Website

1. Open your web browser (Chrome, Firefox, Safari, Edge)
2. Go to: **http://localhost:5173**
3. You should see the Finance AI Use Case Catalog!

---

## Using the Catalog

### Search
- Type in the search bar at the top
- Searches titles, authors, and summaries

### Filter
- Use the dropdowns to filter by:
  - **Function**: What the AI does (fraud detection, trading, etc.)
  - **Technique**: What algorithm it uses (neural networks, XGBoost, etc.)
  - **Industry**: Banking, insurance, fintech, etc.
  - **Stage**: Research, pilot, or production
  - **Year Range**: When the paper was published

### View Details
- Click any paper card to expand it
- See full summary, dataset, model, results, and business impact
- Click "View Paper" to read the original research

### Navigate
- Use the pagination buttons at the bottom to see more papers
- 20 papers show per page

---

## Troubleshooting

### "Command not found"
- Make sure you installed Python, Node, and Git correctly
- Try closing and reopening your terminal

### "Port already in use"
- Something is already running on port 8000 or 5173
- Close other applications or use different ports

### "Module not found" errors
- Make sure you ran `pip install -r requirements.txt`
- Make sure your virtual environment is activated (you should see `(.venv)`)

### Frontend shows blank page
- Check Terminal Window 2 for errors
- Make sure the backend is running (Terminal Window 1)
- Try refreshing the browser (Cmd+R or Ctrl+R)

### Database errors
- The database file `catalog.sqlite3` should be in the `app/` folder
- If missing, the app creates an empty one automatically

---

## Stopping the Application

1. Go to Terminal Window 1 (Backend)
2. Press `Ctrl+C`
3. Go to Terminal Window 2 (Frontend)
4. Press `Ctrl+C`

Done! The servers are stopped.

---

## Next Steps

- **Add more papers**: Learn SQL and insert new records into `catalog.sqlite3`
- **Customize the UI**: Edit files in `frontend/src/components/`
- **Deploy online**: Use services like Heroku, Vercel, or AWS
- **Read the technical docs**: See `TECHNICAL.md` for deep dives

---

## Still Stuck?

Open an issue on GitHub with:
- What step you're on
- What error message you see
- Screenshots if possible

We'll help you out!

