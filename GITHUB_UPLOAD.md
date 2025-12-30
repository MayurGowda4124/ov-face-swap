# Uploading iPad App to GitHub

## Quick Steps

### 1. Initialize Git Repository (if not already done)

```bash
cd ipad
git init
```

### 2. Add All Files

```bash
git add .
```

### 3. Create Initial Commit

```bash
git commit -m "Initial commit: iPad Face Swap app ready for Vercel deployment"
```

### 4. Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon in the top right
3. Select "New repository"
4. Name it (e.g., `ipad-face-swap` or `kingfisher-ipad-app`)
5. Choose public or private
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click "Create repository"

### 5. Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add the remote (replace YOUR_USERNAME and REPO_NAME with your actual values)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

### Alternative: Using SSH

If you have SSH keys set up:

```bash
git remote add origin git@github.com:YOUR_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

## Important Notes

### Files That Will Be Committed

✅ **Will be committed:**
- All source code (`src/` folder)
- Configuration files (`package.json`, `vite.config.js`, `vercel.json`)
- Public assets (`public/assets/`, `public/fonts/`)
- Documentation files (`.md` files)
- HTML files

❌ **Will NOT be committed** (ignored by `.gitignore`):
- `node_modules/` - Dependencies (will be installed via `npm install`)
- `dist/` - Build output (generated during build)
- `.env` files - Environment variables (if any)
- Editor files (`.vscode/`, `.idea/`)

### Before Pushing

1. **Copy Font Files** (if not already done):
   ```bash
   # From project root
   mkdir ipad\public\fonts
   copy frontend\public\fonts\BebasNeue-Bold.ttf ipad\public\fonts\
   ```

2. **Test Build Locally**:
   ```bash
   cd ipad
   npm install
   npm run build
   ```

3. **Verify .gitignore**:
   - Make sure `node_modules/` and `dist/` are in `.gitignore`
   - These should NOT be committed

### After Pushing to GitHub

1. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure:
     - Framework: Vite
     - Root Directory: `ipad`
     - Build Command: `npm run build`
     - Output Directory: `dist`

2. **Set Environment Variables** (optional):
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add `VITE_BACKEND_URL` if you want a default backend URL

## Troubleshooting

### If you get "remote origin already exists"

```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
```

### If you need to update the remote URL

```bash
git remote set-url origin https://github.com/YOUR_USERNAME/REPO_NAME.git
```

### If you forgot to add files

```bash
git add .
git commit -m "Add missing files"
git push
```

### If you need to remove a file from git but keep it locally

```bash
git rm --cached filename
git commit -m "Remove file from git"
```

## Repository Structure

```
ipad/
├── public/
│   ├── assets/          # Images (logo, theme, characters, start button)
│   └── fonts/           # Font files (BebasNeue-Bold.ttf)
├── src/
│   ├── components/      # React components (Logo)
│   ├── database/        # Supabase client
│   ├── pages/           # All page components
│   ├── styles/          # CSS files
│   ├── utils/           # API utilities
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── .gitignore           # Git ignore rules
├── index.html           # HTML template
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
├── vercel.json          # Vercel deployment config
└── README.md            # Project documentation
```

## Next Steps After GitHub Upload

1. ✅ Code is on GitHub
2. ✅ Deploy to Vercel (connect GitHub repo)
3. ✅ Test on iPad
4. ✅ Share the Vercel URL

