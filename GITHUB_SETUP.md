# GitHub Repository Setup Guide

## Step 1: Create GitHub Account (if you don't have one)
1. Go to https://github.com/signup
2. Sign up for a free account
3. Verify your email

## Step 2: Create New Repository
1. Go to https://github.com/new
2. Repository name: `smart-attendance-system` (or any name you prefer)
3. Description: "Smart Attendance System with Facial Recognition"
4. Choose: **Public** or **Private** (your choice)
5. **DO NOT** check "Initialize with README" (we already have files)
6. Click **"Create repository"**

## Step 3: Copy Repository URL
After creating, GitHub will show you the repository URL. It will look like:
- `https://github.com/your-username/smart-attendance-system.git`
- OR `git@github.com:your-username/smart-attendance-system.git`

## Step 4: Push Your Code
Run these commands in your terminal (from project root):

```bash
# Add remote repository
git remote add origin https://github.com/your-username/smart-attendance-system.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

## Alternative: Using GitHub CLI (if installed)
```bash
gh repo create smart-attendance-system --public --source=. --remote=origin --push
```

## After Pushing
Your code will be available at:
`https://github.com/your-username/smart-attendance-system`

