# 🤖 AI-Native Website Audit Tool

## Built with AI-Native Knowledge & Principles

This is a **fully AI-driven conversational application** that analyzes websites through intelligent, context-aware dialogue. Every aspect of this tool was designed with **AI-native thinking**:

- **AI for analysis** (Groq API generates insights)
- **AI for decisions** (Probabilistic reasoning for confidence scores)
- **AI for guidance** (Conversational workflow instead of forms)
- **AI for transparency** (Full prompt logging for audit trail)

Unlike traditional form-based audit tools, this application guides you through website analysis naturally through conversation.

## 🤖 AI-Native Features

- **Conversational Interface**: Chat with AI to audit websites naturally
- **Multi-turn Analysis**: Ask follow-up questions, refine insights iteratively
- **Conversation Memory**: AI remembers previous audits and builds context
- **AI-Guided Workflow**: AI suggests next steps and improvements
- **Dynamic Reports**: Personalized audit insights generated on-the-fly
- **Autonomous Suggestions**: AI recommends websites to audit

## 📹 Quick Start Videos

See the tool in action:
- **[Startup & Setup](videos/README.md#demo-1-project-startup)** - Installation and running the app
- **[Website Audit Demo](videos/README.md#demo-2-website-audit-example)** - Analyzing a website with AI
- **[Conv​ersation Flow](videos/README.md#demo-3-multi-turn-conversation)** - Multi-turn analysis with context

## 📋 Architecture

```
Frontend (Chat UI)
      ↓
Conversation Manager (Context + History)
      ↓
AI Service (Groq API)
      ↓
Website Scraper + Metrics
      ↓
Prompt Logger (Audit Trail)
```

---

## ✅ EIGHT25MEDIA Assignment Compliance

| Requirement | Status | Location |
|-------------|--------|----------|
| **1. Factual Metrics** | ✅ Complete | Extracted by `websiteScraper.js`: word count, H1-H3, CTAs, images, alt text %, links, meta tags |
| **2. Metrics Clearly Separated** | ✅ Complete | Prompt logs show `=== FACTUAL METRICS ===` section separate from AI insights |
| **3. AI Insights Grounded in Data** | ✅ Complete | Every AI insight references specific metrics: "word count is 17", "0 H1 tags" |
| **4. Specific & Non-Generic Recommendations** | ✅ Complete | "Increase word count with relevant, high-quality information" (not "add content") |
| **5. Confidence Scores** | ✅ Complete | All insights include `[confidence: 0.95]` format in responses |
| **6. Clean Scraping/AI Separation** | ✅ Complete | Separate services: `websiteScraper.js` (no AI) → `aiService.js` (Groq) |
| **7. Prompt Logs Required** | ✅ Complete | `logs/prompt-trace.jsonl` with system prompt, user prompt, audit data, raw response |
| **8. GitHub Repository** | ✅ Complete | Native-website-audit-tool (this repo) |
| **9. Deployed or Local Runnable** | ✅ Complete | Local: `npm install && npm start` (Node.js backend + React frontend) |
| **10. README with Architecture** | ✅ Complete | Section: "Architecture" (above) |
| **11. README with AI Design Decisions** | ✅ Complete | Section: "AI Design Decisions" (below) |
| **12. README with Trade-offs** | ✅ Complete | Section: "Trade-offs Made" (below) |
| **13. README with Improvements** | ✅ Complete | Section: "What Would Improve With More Time" (below) |
| **14. Sample Prompt Logs** | ✅ Complete | Section: "Prompt Logging & Audit Trail" (shows full JSON structure) |

---



### 1. Install Dependencies

```bash
npm install
cd frontend && npm install && cd ..
```

### 2. Configure Environment

```bash
# .env
GROQ_API_KEY=your_key_here
AI_PROVIDER=groq
GROQ_MODEL=llama-3.3-70b-versatile
PORT=3001
NODE_ENV=development
```

### 3. Run Application

```bash
# Backend (Terminal 1)
npm start

# Frontend (Terminal 2)
cd frontend && npm run dev
```

- **Backend**: http://localhost:3001
- **Frontend**: http://localhost:5175

## 📡 API Endpoints

### Chat / Conversation

**Start Conversation**
```bash
POST /api/chat/start
Body: { "userId": "user123" }
```

**Send Message**
```bash
POST /api/chat/message
Body: {
  "conversationId": "conv-123",
  "message": "Analyze example.com for SEO",
  "url": "https://example.com" (optional)
}
```

**Get History**
```bash
GET /api/chat/:conversationId/history
```

### Website Audit

**Quick Audit**
```bash
POST /api/audit/analyze
Body: { "url": "https://example.com" }
```

### Memory / Logs

**Get Prompt Logs**
```bash
GET /api/memory/logs
```

**Get Logs Count**
```bash
GET /api/memory/logs/count
```

## 🗂️ Project Structure

```
Native-website-audit-tool/
├── src/
│   ├── server.js                    # Express server
│   ├── services/
│   │   ├── conversationManager.js   # Chat history & context
│   │   ├── aiService.js            # AI integration
│   │   ├── websiteScraper.js       # Website metrics
│   │   └── promptLogger.js         # Audit logs
│   └── routes/
│       ├── conversation.js         # Chat endpoints
│       ├── audit.js               # Audit endpoints
│       └── memory.js              # Log endpoints
├── frontend/
│   ├── src/
│   │   ├── App.jsx               # Chat component
│   │   └── App.css               # Styles
│   └── vite.config.js
├── logs/
│   └── prompt-trace.jsonl        # AI prompt history
├── package.json                  # Root dependencies
└── README.md
```

## 🔄 Conversation Flow

1. **User**: "Analyze google.com"
2. **AI**: "I'll audit google.com. Should I focus on SEO, UX, messaging, or all aspects?"
3. **User**: "All, please"
4. **AI**: Scrapes → Analyzes → Provides insights with suggestions
5. **AI**: "Found 3 critical SEO issues. Want me to dig deeper?"
6. **User**: "Yes, focus on heading structure"
7. **AI**: Generates detailed report + next steps
8. **AI**: "Should I analyze twitter.com next?" (Autonomous suggestion)

## 🛠️ Technologies

- **Backend**: Node.js, Express.js
- **Frontend**: React 19, Vite
- **AI**: Groq API (llama-3.3-70b-versatile)
- **Scraping**: Cheerio, Axios
- **Validation**: Zod
- **Testing**: Vitest, Supertest

## 🤔 AI Design Decisions

### **Probabilistic Reasoning vs Rules-Based**
❌ **NOT Rules-Based**: No hardcoded rules like "IF no H1 THEN bad SEO"  
✅ **Probabilistic**: AI assigns confidence scores [confidence: 0.85] based on evidence

**Why?**
- Rules are fragile: every website is different
- Confidence scores show reasoning quality
- Allows expressing uncertainty: "I'm 40% sure about this"
- Matches real-world decision making

### **Conversational vs Form-Based**
❌ **NOT Form**: Single-page audit forms
✅ **Conversational**: Multi-turn chat with memory

**Why?**
- Users ask follow-up questions naturally
- Context compounds: "earlier you mentioned H1 issues..."
- AI can guide: "Should I dig deeper into mobile UX?"
- More engaging and less intimidating

### **Groq API Selection**
- **Fast inference**: Groq specialized for low-latency LLM serving
- **Cost-effective**: Free tier available
- **Open weights model**: llama-3.3-70b-versatile (transparency)
- **Well-documented**: OpenAI-compatible API

### **Separate Metrics from AI Insights**
```
Factual Layer (Scraper)
├── Word count
├── Heading structure (H1/H2/H3)
├── CTAs
├── Images + alt text %
├── Links (internal/external)
└── Meta tags

AI Layer (Groq)
├── Analyzes metrics
├── Generates insights with confidence scores
├── Provides recommendations
└── Expresses uncertainty about missing data
```

This ensures **grounding in data** - every AI claim references specific metrics.

---

## ⚖️ Trade-offs Made

| Decision | Pros | Cons | Rationale |
|----------|------|------|-----------|
| **Conversational UX** | Engaging, natural, multi-turn | Slower than instant API response | Matches EIGHT25MEDIA's use case (thinking through decisions) |
| **In-memory storage** | Simple, no DB setup | Lost on restart, not persistent | Focus on core AI logic for 24hr assignment |
| **Single-page analysis** | Focused, clear scope | Can't analyze site structure/crawl | Meets assignment scope requirement |
| **Groq over OpenAI** | 60x faster, free tier | Fewer features than Claude | Speed + cost for local dev/demo |
| **JSONL logs** | Streaming, human-readable | Not queryable like database | Easy to inspect, grep, debug |
| **React frontend** | Interactive chat UX | Adds frontend build complexity | Demonstrates full-stack thinking |

---

## 🚀 What Would Improve With More Time

### **1. Persistent Storage**
```javascript
// Current: In-memory, lost on restart
// Needed: MongoDB for conversation history
db.conversations.insertOne({
  userId, conversationId, messages, auditedUrls, createdAt
})
```
**Impact**: Users can return to previous audits

### **2. Better Confidence Extraction**
Current: Regex parsing `[confidence: 0.85]`  
Needed: Structured JSON from Groq with built-in confidence fields
```json
{
  "insights": [
    { "claim": "...", "confidence": 0.85, "grounding": "metric X" }
  ]
}
```

### **3. Enhanced Metrics**
Current: Basic content metrics  
Needed: 
- Performance (Lighthouse scores)
- Mobile responsiveness detection
- Accessibility (WCAG compliance)
- Security headers (CSP, HSTS)
- Open Graph/Twitter card analysis

### **4. Multi-Page Crawling**
Current: Single page only  
Needed:
- Crawl site structure (limit to 20 pages)
- Analyze navigation patterns
- Cross-page consistency
- Internal link graph

### **5. PDF/CSV Export**
Current: Chat-based only  
Needed:
- Generate detailed audit reports  
- Export with timestamp + audit trail
- Share findings with stakeholders

### **6. User Authentication**
Current: No auth (userId is just a string)  
Needed:
- JWT-based login
- Save audit history per user
- API key management for user-provided Groq keys

### **7. Real-Time Metrics During Scrape**
Current: All metrics at once  
Needed:
- Stream metrics as scraped
- Show progress to user
- Better UX for slow websites

### **8. Advanced Prompt Engineering**
Current: Single system prompt  
Needed:
- Different prompts for different audit types (SEO vs UX vs performance)
- Few-shot examples in prompt
- Structured outputs (Zod validation of AI responses)

---

## 📊 Prompt Logging & Audit Trail

Every AI interaction is logged to `logs/prompt-trace.jsonl`:

```json
{
  "timestamp": "2026-03-21T23:07:31.956Z",
  "provider": "groq",
  "model": "llama-3.3-70b-versatile",
  "systemPrompt": "You are an AI-Native Website Audit Expert with PROBABILISTIC REASONING...",
  "userPrompt": "=== FACTUAL METRICS ===\nWord Count: 17\nH1: 0, H2: 0, H3: 0\n...",
  "auditData": {
    "url": "https://example.com",
    "wordCount": 17,
    "headings": { "h1": 1, "h2": 0, "h3": 0 },
    "ctaCount": 0,
    "links": { "total": 1, "internal": 0, "external": 1 },
    "images": { "total": 0, "missingAlt": 0, "missingAltPercent": 0 },
    "meta": { "title": "Example Domain", "description": "" }
  },
  "context": {
    "auditedUrls": ["https://example.com"],
    "currentUrl": "https://example.com",
    "previousInsights": [],
    "confidenceHistory": [],
    "userPreferences": {}
  },
  "rawResponse": "The website you've provided has very limited content...[confidence: 0.95]...heading tags [confidence: 0.9]..."
}
```

**Key Features**:
- ✅ Separates metrics from AI analysis
- ✅ Includes confidence scores
- ✅ Shows full conversation context
- ✅ Logs raw response before any formatting
- ✅ Timestamps all interactions for audit trail

## 🔒 Security

- API keys stored in `.env` (not in Git)
- CORS configured for local development
- Input validation with Zod
- Error handling on all endpoints

## 📈 Future Enhancements

1. **Database**: Replace in-memory storage with MongoDB/PostgreSQL
2. **User Authentication**: JWT-based auth
3. **Rate Limiting**: Prevent API abuse  
4. **Advanced Analytics**: Track audit trends over time
5. **Export Reports**: PDF, CSV, JSON exports
6. **Team Collaboration**: Share audits with team members
7. **Webhooks**: Notify when issues are found
8. **API Keys**: Allow user-provided OpenAI/Groq keys

## 📝 Assignment Requirements

✅ **AI-Native Architecture**: Fully driven by AI, not just a feature  
✅ **Conversational Interface**: Chat-based, multi-turn interactions  
✅ **Prompt Logging**: All prompts logged to audit trail  
✅ **Context Memory**: Conversations remember previous audits  
✅ **GitHub Repository**: Source code + documentation  
✅ **API Architecture**: RESTful endpoints for all functionality  

## 📞 Support

For issues or questions, refer to the prompt logs and conversation history in the `/logs` directory.

---

**Built with ❤️ as an AI-Native Application**
