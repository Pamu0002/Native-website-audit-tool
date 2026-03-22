# 🎬 How to Add Demo Videos

## Option A: Quick Screen Recording (Recommended)

### Windows 10/11 - Built-in Screen Recorder
```
1. Open the app you want to record (e.g., browser with app running)
2. Press: Win + G (opens Game Bar)
3. Click: "Start Recording" (or Ctrl + Alt + Win + R)
4. Perform your demo (startup, audit, etc.)
5. Press: Ctrl + Alt + Win + R (to stop)
6. File saved to: Videos > Captures
```

### OBS Studio (Better Quality)
```
Free download: https://obsproject.com/

Steps:
1. Install OBS Studio
2. Add "Application Window" or "Display" as source
3. Set resolution: 1280x720 (good for GitHub)
4. Click "Start Recording"
5. Do your demo
6. File → Export Video
7. Save as demo-X.mp4
```

---

## Option B: Compress Video Files (Before Uploading)

If video is large (> 100MB), compress it:

### Using FFmpeg (PowerShell):
```powershell
# Install FFmpeg first:
choco install ffmpeg

# Then compress:
ffmpeg -i demo-1-startup.mov -vcodec h264 -q:v 5 demo-1-startup.mp4
```

### Result:
- Large .mov file: 500 MB → .mp4: 50 MB ✅

---

## Option C: Upload to GitHub

### Method 1: Direct File Upload (Best for Small Videos)

```bash
# 1. Copy your .mp4 files to videos/ folder
cp C:\path\to\demo-1.mp4 videos/
cp C:\path\to\demo-2.mp4 videos/
cp C:\path\to\demo-3.mp4 videos/

# 2. Add to git
git add videos/

# 3. Commit & Push
git commit -m "feat: Add demonstration videos"
git push origin main
```

### Method 2: GitHub Release (Better for Large Videos > 100MB)

```bash
# 1. Create a release on GitHub
https://github.com/Pamu0002/Native-website-audit-tool/releases/new

# 2. Fill in:
   - Tag version: v1.0.0-demo
   - Release title: v1.0.0 Demonstration Videos
   - Description: Links and descriptions of demo videos

# 3. Upload video files
   - Click "Attach binaries by dropping them here or selecting them"
   - Select your .mp4 files
   - Publish release

# Result: Videos accessible at:
https://github.com/Pamu0002/Native-website-audit-tool/releases/download/v1.0.0-demo/demo-1.mp4
```

---

## Demo Scripts (What to Record)

### Demo 1: Startup (2 min)
```bash
# Terminal 1 - Backend
npm install
npm start
# Show: "Server running on http://localhost:3001"

# Terminal 2 - Frontend  
cd frontend
npm install
npm run dev
# Show: "Local: http://localhost:5175"

# Browser
Open http://localhost:5175
# Show: Chat interface loads successfully
```

### Demo 2: Website Audit (3 min)
```
1. Browser to http://localhost:5175
2. Type in URL: https://example.com
3. See scraper working
4. See AI analyzing
5. Show 3-section output:
   - SECTION 1: FACTUAL METRICS
   - SECTION 2: AI INSIGHTS
   - SECTION 3: RECOMMENDATIONS
6. Show confidence scores
```

### Demo 3: Multi-turn Chat (2 min)
```
1. Show previous conversation history
2. Ask follow-up question
3. Show AI remembers context
4. Ask another question
5. Show conversation building
6. Show prompt logs being created
```

---

## Option D: External Hosting (Alternative)

If you don't want videos in Git:

### YouTube
1. Record video
2. Upload to YouTube (unlisted or public)
3. Link in README:
   ```markdown
   [![Demo 1 - Startup](https://img.youtube.com/vi/VIDEO_ID/0.jpg)](https://www.youtube.com/watch?v=VIDEO_ID)
   ```

### Loom (30 sec - 25 min free videos)
1. Login: https://www.loom.com/
2. Click "Start Recording"
3. Select window/tab
4. Record your demo
5. Get shareable link
6. Add to README

### Vimeo (Free with limits)
Similar process as YouTube

---

## Checklist

- [ ] Record Demo 1: Startup
- [ ] Record Demo 2: Audit Example
- [ ] Record Demo 3: Multi-turn Chat
- [ ] Compress videos (if > 100MB)
- [ ] Add to `videos/` folder
- [ ] Update `videos/README.md` with descriptions
- [ ] Add demo links to main `README.md`
- [ ] Commit: `git add videos/`
- [ ] Push: `git push origin main`
- [ ] Verify videos play on GitHub

---

## Quick Commands

```bash
cd c:\Users\Pamudi\Desktop\au\Native-website-audit-tool

# Check video folder
ls videos/

# Add videos
git add videos/

# Commit
git commit -m "feat: Add demonstration videos"

# Push
git push origin main

# Verify on GitHub
# https://github.com/Pamu0002/Native-website-audit-tool/tree/main/videos
```

Good luck! 🎬
