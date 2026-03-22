# 📹 Demonstration Videos

## Demo 1: Project Startup
**File**: `demo-1-startup.mp4`

Shows:
- Installation of dependencies (`npm install`)
- Environment configuration (`.env` setup)
- Starting backend server on port 3001
- Starting frontend dev server on port 5175
- Opening browser to http://localhost:5175

**Duration**: ~2 minutes

---

## Demo 2: Website Audit Example
**File**: `demo-2-chat-audit.mp4`

Shows:
- User entering a website URL (e.g., https://example.com)
- Scraper extracting metrics in real-time
- AI analyzing the website
- Full 3-section audit output:
  - SECTION 1: Factual Metrics
  - SECTION 2: AI Insights
  - SECTION 3: Recommendations

**Duration**: ~3 minutes

---

## Demo 3: Multi-turn Conversation
**File**: `demo-3-ai-insights.mp4`

Shows:
- User asking follow-up questions
- AI remembering previous audit context
- Confidence scores in responses
- Conversation memory system
- Prompt logs being generated

**Duration**: ~2 minutes

---

## How to Record Videos on Windows

### Quick Method - Use Built-in Game Bar:
1. Open application you want to record
2. Press `Win + G` to open Game Bar
3. Click "Start Recording"
4. Use Ctrl + Alt + Win + R to stop

### Better Quality - Use OBS Studio (Free):
1. Download: https://obsproject.com/
2. Set capture source (Application or Screen)
3. Set resolution 1280x720 (720p) or 1920x1080 (1080p)
4. Click Start Recording
5. File → Export Video when done

### Compress Videos Before Uploading:
```powershell
# Using FFmpeg (install: choco install ffmpeg)
ffmpeg -i demo-1-startup.mov -vcodec h264 -q:v 5 demo-1-startup.mp4
```

---

## How to Watch Videos on GitHub

Once uploaded, videos appear in README with:

```markdown
## Demo Videos

### Startup Demo
![Demo 1 - Startup](videos/demo-1-startup.mp4)

### Website Audit Demo
https://github.com/Pamu0002/Native-website-audit-tool/blob/main/videos/demo-2-chat-audit.mp4
```

Click video file → "Download raw file" or view on GitHub directly.
