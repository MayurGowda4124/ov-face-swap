# Quick GitHub Upload Guide

## Step-by-Step Instructions

### 1. Copy Font File (Required)

First, make sure the font file is in place:

```bash
# From the project root directory
mkdir ipad\public\fonts
copy frontend\public\fonts\BebasNeue-Bold.ttf ipad\public\fonts\
```

### 2. Navigate to iPad Folder

```bash
cd ipad
```

### 3. Initialize Git (if not already done)

```bash
git init
```

### 4. Add All Files

```bash
git add .
```

### 5. Create Initial Commit

```bash
git commit -m "Initial commit: iPad Face Swap app"
```

### 6. Create Repository on GitHub

1. Go to https://github.com/new
2. Repository name: `ipad-face-swap` (or your preferred name)
3. Choose Public or Private
4. **DO NOT** check "Add a README file" (we already have one)
5. Click "Create repository"

### 7. Connect and Push

After creating the repo, GitHub will show you commands. Run these:

```bash
# Replace YOUR_USERNAME and REPO_NAME with your actual values
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

## That's It! 🎉

Your code is now on GitHub. Next step: Deploy to Vercel using the GitHub repository.

## Verify What Will Be Uploaded

Files that **WILL** be uploaded:
- ✅ All source code (`src/` folder)
- ✅ Configuration files
- ✅ Public assets (images, fonts)
- ✅ Documentation

Files that **WON'T** be uploaded (ignored):
- ❌ `node_modules/` (dependencies)
- ❌ `dist/` (build output)
- ❌ `.env` files

