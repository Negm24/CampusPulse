# CampusPulse
A small web app where any user can post announcements for their college mates. Users can see upcoming events/announcements posted by others on dashboard. They may get notified via email or platform alerts.

-----------------------------------------------------------

Expected prototype directory paths:
        campuspulse/
        │
        ├── backend/                 # Flask app
        │   ├── app/                 # Your main Flask app package
        │   │   ├── __init__.py      # App factory
        │   │   ├── routes/          # Blueprint routes
        │   │   ├── models/          # SQLAlchemy models
        │   │   ├── schemas/         # Marshmallow schemas (if any)
        │   │   ├── services/        # Business logic, helpers
        │   │   └── utils/           # Utility modules (email, validators...)
        │   ├── .env                 # Backend secrets/config
        │   ├── config.py            # App configuration
        │   ├── run.py               # Main entry point (or wsgi.py)
        │   ├── requirements.txt     # Python dependencies
        │   └── migrations/          # Alembic migration folder
        │
        ├── frontend/                # React app
        │   ├── public/              # Static HTML, favicon, etc.
        │   ├── src/                 # React source files
        │   │   ├── components/      
        │   │   ├── pages/
        │   │   ├── services/        # Axios or fetch services
        │   │   ├── hooks/           # Custom hooks
        │   │   └── App.jsx          
        │   ├── .env                 # Frontend env (REACT_APP_...)
        │   ├── package.json         
        │   └── vite.config.js       # (or webpack.config.js, if not using Vite)
        │
        ├── README.md                
        ├── .gitignore
        └── LICENSE (optional)

-----------------------------------------------------------

Ideal habit:
  Commit every 1–3 files or after finishing a small piece of functionality.

And pushing?
  You don’t need to push every single commit immediately — but push daily at least
Especially push before:
  You shut down
  You switch devices
  You do something risky or big

🚨AVOID:
  Coding for 4 hours straight and committing everything as
  Update everything or Final changes

-----------------------------------------------------------

Recommended git flow:
  Create the GitHub repo first → clone it to your PC → build inside it → commit/push as i go...
  
Step-by-Step:
  1. Create the GitHub repo online
  2. Clone the empty repo to your machine
  3. Create your folder structure inside it
  4. Initialize frontend inside /frontend (npx create-react-app)
  5. Go back and commit
  6. Setup backend: cd backend; python -m venv venv; venv\Scripts\activate; touch app.py
  7. Then: commit frequently

-----------------------------------------------------------

How do i go back to a last commit for example, like going back in time to my last checkpoint i commited?
  how to time travel in Git, and that’s exactly what Git is made for:
      🧭 Let’s say:
      You committed something yesterday, but today you messed up or want to go back to the last working version.
      ✅ To "go back" to a previous commit (aka rollback, rewind, undo), here are your 3 main options depending on the situation:
      
      ⚠️ Situation 1:
      “I haven’t committed yet, I just changed some files… I want to undo the uncommitted changes.”
      🛠 Command:
        git checkout -- <file>
        
        or

        git restore <file>
      
      💥 This resets the file back to the last commit. Changes are lost unless you saved them somewhere else.

      
      🧼 Situation 2:
      “I want to go back to the last commit, discard all local changes since then.”
      🛠 Command:
        git reset --hard HEAD
      ✅ Your working directory is now exactly like the last commit.
      🚨 Careful: any unsaved work is permanently lost!
      
      🧳 Situation 3:
      “I want to go back to a previous commit entirely, like 2 or 3 steps ago.”
      You first find the commit ID:
                  git log
      You’ll see something like:
                commit a1b2c3d4 (HEAD -> main)
                Author: Negm
                Date: ...
                
                    fix: broken login flow
                
                commit 9e8f7g6h
                    feat: add announcement filter
  
      Then to go back:
          git checkout 9e8f7g6h
      🚨 But now you’re in “detached HEAD” — not on a branch.
      If you want to restore it as your current state:
          git checkout -b old-version-try
      Or reset your branch to that commit:
          git reset --hard 9e8f7g6h
      (Use --soft or --mixed if you want to keep changes staged or unstaged)
      
      💡 Bonus Tip: Create checkpoints manually
      Before risky changes:
          git commit -am "checkpoint before refactor"
      Then if it breaks:
          git reset --hard HEAD~1
      (That moves you back one commit)
