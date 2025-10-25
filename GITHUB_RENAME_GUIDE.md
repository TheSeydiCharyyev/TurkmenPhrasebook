# 🔄 GitHub Repository Rename Guide

## 📝 Overview

Renaming repository from:
- **OLD:** `ChinesePhrasebook2`
- **NEW:** `TurkmenPhrasebook`

---

## ⚠️ Important Notes

1. **GitHub redirects automatically** - Old URL will redirect to new URL
2. **Local repo needs update** - You must update your local git remote
3. **CI/CD may need updates** - Check EAS, workflows, etc.
4. **README links** - Update any hardcoded URLs

---

## 🚀 Step-by-Step Guide

### Step 1: Rename on GitHub (Web)

1. **Go to Repository**
   - Open: https://github.com/seydicharyyev/ChinesePhrasebook2

2. **Open Settings**
   - Click "Settings" tab (top right of repo page)
   - You need **admin** access to see this

3. **Rename Repository**
   - Scroll down to **"Danger Zone"** section (bottom of page)
   - Find **"Rename repository"**
   - Click **"Rename"** button

4. **Enter New Name**
   - New name: `TurkmenPhrasebook`
   - Click **"I understand, rename repository"**

**✅ Done!** Repository is now:
```
https://github.com/seydicharyyev/TurkmenPhrasebook
```

---

### Step 2: Update Local Git Remote

After renaming on GitHub, update your local repository:

#### Option A: Update Remote URL (Recommended)

```bash
# Navigate to your project
cd C:\Users\seydi\ChinesePhrasebook2

# Check current remote
git remote -v
# Output:
# origin  https://github.com/seydicharyyev/ChinesePhrasebook2.git (fetch)
# origin  https://github.com/seydicharyyev/ChinesePhrasebook2.git (push)

# Update remote URL
git remote set-url origin https://github.com/seydicharyyev/TurkmenPhrasebook.git

# Verify change
git remote -v
# Output:
# origin  https://github.com/seydicharyyev/TurkmenPhrasebook.git (fetch)
# origin  https://github.com/seydicharyyev/TurkmenPhrasebook.git (push)
```

#### Option B: SSH (If using SSH)

```bash
git remote set-url origin git@github.com:seydicharyyev/TurkmenPhrasebook.git
```

---

### Step 3: Test Connection

```bash
# Fetch from remote (should work)
git fetch origin

# Push to verify
git push origin main
```

**If you get errors:**
```bash
# Remove old remote and re-add
git remote remove origin
git remote add origin https://github.com/seydicharyyev/TurkmenPhrasebook.git
git push -u origin main
```

---

### Step 4: Update app.json

We already updated this! Verify:

```json
{
  "expo": {
    "githubUrl": "https://github.com/seydicharyyev/TurkmenPhrasebook"
  }
}
```

**✅ Already done in previous step**

---

### Step 5: Update EAS Configuration (If needed)

Check `eas.json` for any hardcoded URLs:

```bash
# Search for old repo name
grep -r "ChinesePhrasebook2" eas.json
```

If found, update to `TurkmenPhrasebook`

---

### Step 6: Update README.md

Update any badges or links in README:

**Old:**
```markdown
[View on GitHub](https://github.com/seydicharyyev/ChinesePhrasebook2)
```

**New:**
```markdown
[View on GitHub](https://github.com/seydicharyyev/TurkmenPhrasebook)
```

---

### Step 7: (Optional) Rename Local Folder

If you want folder name to match:

#### On Windows:

```bash
# Navigate to parent directory
cd C:\Users\seydi

# Rename folder
ren ChinesePhrasebook2 TurkmenPhrasebook

# Navigate back
cd TurkmenPhrasebook
```

**⚠️ Warning:** Close VS Code / editors before renaming folder!

#### On Mac/Linux:

```bash
cd ~/Projects
mv ChinesePhrasebook2 TurkmenPhrasebook
cd TurkmenPhrasebook
```

---

## ✅ Verification Checklist

After renaming, verify:

- [ ] GitHub shows new name `TurkmenPhrasebook`
- [ ] Old URL redirects: `github.com/seydicharyyev/ChinesePhrasebook2` → New URL
- [ ] `git remote -v` shows new URL
- [ ] `git push` works without errors
- [ ] `app.json` has correct `githubUrl`
- [ ] README links updated
- [ ] EAS build still works: `eas build --platform android --profile preview`

---

## 🔍 Finding Hardcoded References

Search entire project for old name:

```bash
# Windows (PowerShell)
Get-ChildItem -Recurse -File | Select-String "ChinesePhrasebook2" | Select-Object Path, LineNumber, Line

# Mac/Linux (grep)
grep -r "ChinesePhrasebook2" . --exclude-dir=node_modules --exclude-dir=.git

# Specific files to check
grep "ChinesePhrasebook2" app.json
grep "ChinesePhrasebook2" eas.json
grep "ChinesePhrasebook2" package.json
grep "ChinesePhrasebook2" README.md
```

**Update any found references to `TurkmenPhrasebook`**

---

## 🎯 Quick Command Summary

```bash
# 1. Rename on GitHub (web interface)

# 2. Update local remote
git remote set-url origin https://github.com/seydicharyyev/TurkmenPhrasebook.git

# 3. Verify
git remote -v
git fetch origin
git push origin main

# 4. (Optional) Rename local folder
cd ..
ren ChinesePhrasebook2 TurkmenPhrasebook
cd TurkmenPhrasebook

# 5. Test build
eas build --platform android --profile preview
```

---

## 🚨 Troubleshooting

### Error: "remote: Repository not found"

**Solution:**
```bash
git remote remove origin
git remote add origin https://github.com/seydicharyyev/TurkmenPhrasebook.git
git push -u origin main
```

### Error: "Permission denied"

**Solution:** Check GitHub credentials
```bash
# Windows (Credential Manager)
Control Panel → Credential Manager → Windows Credentials → Remove GitHub entry

# Next push will prompt for login
git push origin main
```

### Error: "Could not read from remote repository"

**Solution:** Use HTTPS instead of SSH
```bash
git remote set-url origin https://github.com/seydicharyyev/TurkmenPhrasebook.git
```

---

## 📊 Impact of Renaming

### ✅ What Still Works:
- ✅ All commits and history preserved
- ✅ Issues and Pull Requests preserved
- ✅ GitHub Pages (if used) auto-updates
- ✅ Stars and watchers preserved
- ✅ Old URL redirects to new URL (forever)

### ⚠️ What May Break:
- ⚠️ Local git remotes (need manual update)
- ⚠️ CI/CD webhooks (may need re-config)
- ⚠️ External links (if not using redirect)
- ⚠️ Package.json scripts with hardcoded URLs

---

## 🎓 Best Practices

1. **Rename early:** Better before app is published
2. **Update immediately:** Don't delay updating local remote
3. **Notify team:** If collaborators exist, notify them
4. **Check CI/CD:** Verify builds still work after rename
5. **Update docs:** README, CONTRIBUTING.md, etc.

---

## 📝 Post-Rename Commits

After rename, make a commit documenting it:

```bash
git add .
git commit -m "chore: rebrand to Turkmen Phrasebook

- Renamed repository from ChinesePhrasebook2 to TurkmenPhrasebook
- Updated app.json with new name, bundle IDs, and colors
- Updated branding to support 30 languages
- Changed theme from red to green (#10B981)

Part of Phase 6: Branding"

git push origin main
```

---

## 🔗 Useful Links

- **GitHub Docs:** https://docs.github.com/en/repositories/creating-and-managing-repositories/renaming-a-repository
- **Old URL (redirects):** https://github.com/seydicharyyev/ChinesePhrasebook2
- **New URL:** https://github.com/seydicharyyev/TurkmenPhrasebook

---

**Ready to rename?** Follow steps above! 🚀
