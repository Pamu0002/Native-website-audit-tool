# 🤖 AI-Native Website Audit Tool

**A fully AI-driven conversational application that analyzes websites and provides actionable insights through intelligent dialogue.**

Built for EIGHT25MEDIA 24-hour assignment demonstrating AI-native architecture, structured data analysis, and conversational AI design.

---

## 📋 Table of Contents

1. [Quick Start](#-quick-start)
2. [Project Overview](#-project-overview)
3. [Architecture](#-architecture)
4. [Features](#-features)
5. [Tech Stack](#-tech-stack)
6. [Project Structure](#-project-structure)
7. [API Endpoints](#-api-endpoints)
8. [How to Use](#-how-to-use)
9. [Assignment Compliance](#-assignment-compliance-1414)
10. [AI Design Decisions](#-ai-design-decisions)
11. [Demo Videos](#-demo-videos)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn
- Groq API key (free: https://console.groq.com)

### Installation

```bash
# Clone repository
git clone https://github.com/Pamu0002/Native-website-audit-tool.git
cd Native-website-audit-tool

# Install dependencies
npm install
cd frontend && npm install && cd ..

# Configure environment
cp .env.example .env
# Edit .env and add: GROQ_API_KEY=your_api_key_here
```

### Run Application

```bash
# Terminal 1: Start Backend (Port 3001)
npm start

# Terminal 2: Start Frontend (Port 5175)
cd frontend && npm run dev

# Open Browser
# http://localhost:5175
```

---

## 📊 Project Overview

### Purpose
Evaluate how website content can be analyzed through:
- **Factual Metrics**: Deterministic data extraction
- **AI Insights**: Probabilistic analysis with confidence scores
- **Actionable Recommendations**: Specific, metric-tied suggestions

### Key Differentiators
✅ **AI-Native**: Not just an AI feature, entire architecture built around AI  
✅ **Conversational**: Multi-turn chat instead of form-based interface  
✅ **Grounded**: Every AI insight references specific metrics  
✅ **Transparent**: Full prompt logging for audit trail  
✅ **Probabilistic**: Confidence scores, not deterministic rules  

---

## 🏗️ Architecture

### System Design

```
┌─────────────────────────────────────┐
│     Frontend (React + Vite)          │
│    - Chat Interface                  │
│    - Message Display                 │
│    - Conversation History            │
└──────────────┬──────────────────────┘
               │ HTTP/WebSocket
┌──────────────▼──────────────────────┐
│   API Gateway (Express.js)           │
│   - Route Management                 │
│   - Request Validation (Zod)         │
│   - Error Handling                   │
└──────────────┬──────────────────────┘
               │
     ┌─────────┴─────────┐
     │                   │
┌────▼──────────┐  ┌─────▼──────────┐
│ Chat Routes   │  │ Audit Routes   │
│ /api/chat/*   │  │ /api/audit/*   │
└────┬──────────┘  └─────┬──────────┘
     │                   │
┌────▼─────────────────────▼──────────┐
│   Conversation Manager               │
│   - Multi-turn Context               │
│   - History Management               │
│   - State Preservation               │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Service Layer                      │
├──────────────────────────────────────┤
│ 1. Website Scraper (metrics)         │
│    └─ Cheerio for HTML parsing       │
│    └─ Extracts: words, headings,     │
│       CTAs, images, links, meta      │
│                                      │
│ 2. AI Service (Groq API)             │
│    └─ llama-3.3-70b-versatile        │
│    └─ Probabilistic analysis         │
│    └─ Confidence scoring             │
│                                      │
│ 3. Prompt Logger (audit trail)       │
│    └─ JSONL format logging           │
│    └─ System + user prompts          │
│    └─ Raw responses stored           │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Data Layer                         │
│   - In-memory storage (dev)          │
│   - Prompt logs to file              │
│   - Ready for MongoDB integration    │
└──────────────────────────────────────┘
```

### Data Flow

```
User Input (URL)
    ↓
Website Scraper
    ├─ word_count
    ├─ headings (H1, H2, H3)
    ├─ cta_count
    ├─ images (with alt text %)
    ├─ links (internal/external)
    └─ meta (title, description)
    ↓
Format Metrics
    ↓
AI Service (Groq)
    ├─ System Prompt: Audit framework
    ├─ User Prompt: Raw metrics
    ├─ Context: Conversation history
    └─ Analysis Model: llama-3.3
    ↓
Parse Response
    ├─ SECTION 1: Factual Metrics (formatted)
    ├─ SECTION 2: AI Insights (with confidence)
    └─ SECTION 3: Recommendations (prioritized)
    ↓
Prompt Logger
    ├─ Timestamp
    ├─ Full system prompt
    ├─ Full user prompt
    ├─ Raw AI response
    └─ Parsed analysis
    ↓
Send to User
```

---

## ✨ Features

### 1. **Automatic Metrics Extraction**
Extracts 8 key metrics from any webpage:
- Total word count
- Heading structure (H1, H2, H3 counts)
- Call-to-action count (buttons, links)
- Image count with alt text coverage
- Internal vs external links
- Meta title and description

### 2. **AI-Powered Analysis**
Groq API generates insights in 5 categories:
- **SEO Structure**: Heading hierarchy, alt text, keyword potential
- **Messaging Clarity**: Value proposition, brand messaging
- **CTA Usage**: Conversion optimization, call placement
- **Content Depth**: Word count, topic coverage
- **UX/Structural Concerns**: Navigation, visual hierarchy

### 3. **Confidence Scoring**
Every insight includes `[confidence: 0.0-1.0]`:
- 0.85+: High confidence, recommend action
- 0.65-0.84: Moderate, worth investigating
- 0.45-0.64: Low, needs more data
- <0.45: Very uncertain

### 4. **Conversational Interface**
- Multi-turn chat with memory
- Ask follow-up questions
- AI remembers context across messages
- Natural dialogue (not form-based)

### 5. **Full Transparency**
All prompts logged to `logs/prompt-trace.jsonl`:
- System prompt (audit framework)
- User prompt (metrics formatted)
- Raw AI response (before parsing)
- Parsed analysis (insights, recommendations)

---

## 🔧 Tech Stack

### Backend
- **Runtime**: Node.js 16+
- **Framework**: Express.js 4.x
- **HTTP Client**: Axios
- **HTML Parser**: Cheerio
- **Validation**: Zod
- **Logging**: JSONL (JSON Lines)
- **Port**: 3001

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: CSS3
- **HTTP Client**: Fetch API
- **Port**: 5175

### AI & External Services
- **AI Provider**: Groq API
- **Model**: llama-3.3-70b-versatile
- **Inference Speed**: ~100ms per request
- **Request Format**: OpenAI-compatible

### Data & Storage
- **Development**: In-memory (conversations)
- **Persistence**: JSONL files (logs)
- **Production Ready**: MongoDB/PostgreSQL compatible

---

## 📁 Project Structure

```
Native-website-audit-tool/
│
├── src/                                    # Backend source code
│   ├── server.js                          # Express server entry point
│   ├── config.js                          # Configuration variables
│   │
│   ├── services/                          # Core business logic
│   │   ├── probabilisticAI.js            # Groq API integration
│   │   │   ├── generateProbabilisticResponse()
│   │   │   ├── parseStructuredResponse()
│   │   │   ├── getMockAuditResponse()
│   │   │   └── buildProbabilisticSystemPrompt()
│   │   │
│   │   ├── websiteScraper.js             # HTML parsing & metrics
│   │   │   ├── scrapeWebsite()
│   │   │   ├── extractMetrics()
│   │   │   └── calculateAltTextPercentage()
│   │   │
│   │   ├── conversationManager.js        # Context management
│   │   │   ├── createConversation()
│   │   │   ├── addMessage()
│   │   │   ├── getConversation()
│   │   │   └── getHistory()
│   │   │
│   │   └── promptLogger.js               # Audit trail
│   │       ├── logPrompt()
│   │       ├── getLogs()
│   │       └── getLogCount()
│   │
│   └── routes/                           # API endpoints
│       ├── conversation.js               # /api/chat/* routes
│       │   ├── POST /api/chat/start
│       │   └── POST /api/chat/message
│       │
│       ├── audit.js                      # /api/audit/* routes
│       │   └── POST /api/audit/analyze
│       │
│       └── memory.js                     # /api/memory/* routes
│           ├── GET /api/memory/logs
│           └── GET /api/memory/logs/count
│
├── frontend/                              # React frontend
│   ├── src/
│   │   ├── App.jsx                       # Main chat component
│   │   │   ├── Conversation display
│   │   │   ├── Input form
│   │   │   └── Message rendering
│   │   │
│   │   ├── App.css                       # Component styles
│   │   ├── index.css                     # Global styles
│   │   ├── main.jsx                      # React entry point
│   │   └── assets/                       # Images, icons
│   │
│   ├── package.json                      # Frontend dependencies
│   ├── vite.config.js                    # Vite configuration
│   └── index.html                        # HTML template
│
├── videos/                                # Demo videos
│   ├── demo-1-startup.mp4               # Application startup demo
│   └── README.md                         # Video descriptions
│
├── logs/                                  # Audit trail (created at runtime)
│   └── prompt-trace.jsonl               # Full prompt logging
│
├── .env.example                          # Environment template
├── .gitignore                            # Git ignore rules
├── package.json                          # Root dependencies
└── README.md                             # This file
```

---

## 📡 API Endpoints

### Chat Endpoints

**Start New Conversation**
```bash
POST /api/chat/start
Content-Type: application/json

Body: {
  "userId": "unique-user-id"
}

Response: {
  "conversationId": "conv-123-abc",
  "message": "Welcome! I'm your AI Website Audit Assistant..."
}
```

**Send Message & Get Analysis**
```bash
POST /api/chat/message
Content-Type: application/json

Body: {
  "conversationId": "conv-123-abc",
  "message": "Analyze https://example.com",
  "url": "https://example.com"  (optional)
}

Response: {
  "id": "msg-456",
  "role": "assistant",
  "content": "==== SECTION 1: FACTUAL METRICS ====\n...",
  "insights": [...],
  "recommendations": [...]
}
```

**Get Conversation History**
```bash
GET /api/chat/{conversationId}/history

Response: {
  "conversationId": "conv-123",
  "messages": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}
```

### Audit Endpoints

**Quick Analyze**
```bash
POST /api/audit/analyze
Content-Type: application/json

Body: {
  "url": "https://example.com"
}

Response: {
  "url": "...",
  "metrics": {...},
  "analysis": {...}
}
```

### Logging Endpoints

**Get Prompt Logs**
```bash
GET /api/memory/logs

Response: [
  {
    "timestamp": "2026-03-22T...",
    "systemPrompt": "...",
    "userPrompt": "...",
    "auditData": {...},
    "rawResponse": "..."
  },
  ...
]
```

**Get Log Count**
```bash
GET /api/memory/logs/count

Response: {
  "count": 42
}
```

---

## 💡 How to Use

### Basic Workflow

1. **Open Application**
   - Navigate to http://localhost:5175
   - See chat interface with welcome message

2. **Start Audit**
   - Type: "Analyze https://example.com"
   - System scrapes metrics automatically
   - AI analyzes and returns 3-section report

3. **Review Output**
   ```
   SECTION 1: FACTUAL METRICS
   • Word count: 1,200
   • H1: 1 | H2: 8 | H3: 14
   • CTAs: 6
   • Images: 18 (27% missing alt)
   • Links: 42 internal, 6 external
   
   SECTION 2: AI INSIGHTS
   [SEO Structure, Messaging, CTAs, Content, UX - each with confidence]
   
   SECTION 3: RECOMMENDATIONS
   [3-5 prioritized actions with metrics and expected results]
   ```

4. **Ask Follow-up Questions**
   - "Tell me more about the CTAs"
   - "How can I improve SEO?"
   - "What about mobile optimization?"
   - AI remembers context from previous messages

5. **View Audit Trail**
   - All prompts logged to `logs/prompt-trace.jsonl`
   - Full transparency into AI reasoning

---

## ✅ Assignment Compliance (14/14)

| # | Requirement | Implementation | Status |
|---|---|---|---|
| 1 | Factual Metrics | `websiteScraper.js` extracts 8 metrics | ✅ |
| 2 | Metrics Separated | Section 1 isolated, logged separately | ✅ |
| 3 | Grounded AI Insights | Every insight references specific metrics | ✅ |
| 4 | Specific Recommendations | 3-5 tied to metrics, not generic | ✅ |
| 5 | Confidence Scores | `[confidence: 0.0-1.0]` on all insights | ✅ |
| 6 | Clean Scraping/AI Separation | Separate services in `src/services/` | ✅ |
| 7 | Prompt Logs | `logs/prompt-trace.jsonl` with full context | ✅ |
| 8 | GitHub Repository | https://github.com/Pamu0002/Native-website-audit-tool | ✅ |
| 9 | Local Runnable | `npm install && npm start` | ✅ |
| 10 | Architecture Overview | This README section | ✅ |
| 11 | AI Design Decisions | Section below | ✅ |
| 12 | Trade-offs Made | Section below | ✅ |
| 13 | Future Improvements | Section below | ✅ |
| 14 | Demo Videos | `videos/demo-1-startup.mp4` | ✅ |

---

## 🎯 AI Design Decisions

### 1. Probabilistic vs Rules-Based

**NOT**: Hardcoded rules like "IF no H1 THEN bad SEO"  
**YES**: Probabilistic confidence scores based on evidence

**Why?**
- Every website is different; rules too rigid
- Confidence scores show reasoning quality
- Explicitly state uncertainty level
- Matches real-world decision making

### 2. Conversational vs Form-Based

**NOT**: Single-page form with all inputs at once  
**YES**: Multi-turn chat with context memory

**Why?**
- Users ask follow-up questions naturally
- Context compounds: "earlier you mentioned..."
- AI can guide: "Should I analyze mobile UX?"
- More engaging, less intimidating

### 3. Groq API Selection

**Reasons**:
- **Fast**: ~100ms inference (vs OpenAI 5-10s)
- **Cost-effective**: Free tier available
- **Open weights**: llama-3.3 (transparency)
- **Compatible**: OpenAI API standard

### 4. Metrics → AI → Logging Pipeline

```
Deterministic Layer (Scraper)
├─ Word count (precise)
├─ Heading counts (precise)
├─ Alt text % (precise)
└─ Links (precise)

Probabilistic Layer (AI)
├─ SEO assessment
├─ Messaging analysis
├─ CTA effectiveness
├─ Content evaluation
└─ UX concerns

Logging Layer (Transparency)
├─ System prompt
├─ User prompt (with metrics)
├─ Raw response
└─ Parsed analysis
```

This ensures:
✅ Metrics grounded in data  
✅ AI insights traceable to metrics  
✅ Full audit trail for evaluation  

---

## ⚖️ Trade-offs Made

| Decision | Pros | Cons | Why |
|----------|------|------|-----|
| In-memory storage | Simple, fast | Lost on restart | Focus on core logic for MVP |
| Single-page analysis | Focused scope | No site structure crawl | Assignment requirement |
| Groq vs OpenAI | Fast + cheap | Fewer options | Speed priority for real-time chat |
| Conversational UX | Engaging, natural | Slower than API | Matches use case (thinking through) |
| JSONL logging | Queryable, human-readable | Not indexed database | Easy inspection, grep-able |

---

## 🚀 Future Improvements

1. **Database Integration**
   - MongoDB for conversation history
   - Persistent user profiles
   - Audit result archival

2. **Advanced Metrics**
   - Lighthouse performance scores
   - Mobile responsiveness detection
   - Accessibility (WCAG compliance)
   - Security headers analysis

3. **Multi-Page Analysis**
   - Crawl site structure (limit 20 pages)
   - Navigation pattern analysis
   - Cross-page consistency checks

4. **Export Capabilities**
   - PDF audit reports
   - CSV metrics export
   - JSON structured data

5. **User Authentication**
   - JWT-based login
   - User audit history
   - Custom API keys

6. **Structured Output**
   - JSON schema validation
   - Zod type enforcement
   - API response contracts

---

## 📹 Demo Videos

- **[Startup Demo](videos/demo-1-startup.mp4)** (3.26 MB)
  Shows: Backend start, frontend start, chat interface load

---

## 🔑 Environment Variables

```bash
# .env configuration
GROQ_API_KEY=your_api_key_here          # Required
AI_PROVIDER=groq                        # Optional (default: groq)
GROQ_MODEL=llama-3.3-70b-versatile     # Optional (default shown)
PORT=3001                               # Optional (default: 3001)
NODE_ENV=development                    # development or production
```

---

## 📝 Sample Audit Output

```
==== SECTION 1: FACTUAL METRICS ====
• Total words: 1,200
• H1 count: 1 | H2 count: 8 | H3 count: 14
• CTAs found: 6
• Images: 18 total, 27% missing alt text
• Links: 42 internal, 6 external
• Meta title: General Sir John Kotelawala Defence University
• Meta description: Leading defence university in Sri Lanka...

==== SECTION 2: AI INSIGHTS ====

SEO Structure (confidence: 0.75)
• H1 structure is correct (single H1) based on 1 H1 tag(s) found
• Heading hierarchy with 8 H2 and 14 H3 tags provides decent content structure
• Alt text coverage at 73% impacts SEO positively

Messaging Clarity (confidence: 0.70)
• Page contains 1200 words of content
• Value proposition clarity depends on 1 primary heading

CTA Usage (confidence: 0.72)
• 6 calls-to-action found on page
• Multiple CTAs provide good conversion opportunities

Content Depth (confidence: 0.68)
• Current word count of 1200 words
• 18 images enhance visual engagement

UX/Structural Concerns (confidence: 0.70)
• 42 internal links support navigation
• Link distribution (6 external) appears balanced

==== SECTION 3: RECOMMENDATIONS ====

#1 Priority: Optimize Image SEO
   Metric: 18 images with 27% missing alt text
   Action: Add descriptive alt text to all 5 images
   Expected result: Improve accessibility and SEO ranking
   Confidence: 0.85

#2 Priority: Enhance Content Depth
   Metric: 1200 words
   Action: Expand key sections with detailed, keyword-rich content
   Expected result: Better SEO visibility and user engagement
   Confidence: 0.78

#3 Priority: Strengthen Value Proposition
   Metric: 1 H1 heading
   Action: Ensure clear, compelling primary message above fold
   Expected result: Improved conversion rates
   Confidence: 0.82
```

---

## 📊 Prompt Logging Format

Each prompt logged to `logs/prompt-trace.jsonl`:

```json
{
  "timestamp": "2026-03-22T12:30:45.123Z",
  "provider": "groq",
  "model": "llama-3.3-70b-versatile",
  "systemPrompt": "You are an AI-Native Website Audit Expert...",
  "userPrompt": "=== FACTUAL METRICS ===\nWord Count: 1200\nH1: 1...",
  "auditData": {
    "url": "https://example.com",
    "wordCount": 1200,
    "h1Count": 1,
    "h2Count": 8,
    "h3Count": 14,
    "ctaCount": 6,
    "imageCount": 18,
    "altTextPercentage": 27,
    "internalLinks": 42,
    "externalLinks": 6,
    "metaTitle": "Example Domain",
    "metaDescription": "..."
  },
  "rawResponse": "[Full AI response before parsing]",
  "analysis": {
    "insights": ["SEO structure...", "Messaging..."],
    "recommendations": [...]
  }
}
```

---

## 🤝 Contributing

This project was built as an EIGHT25MEDIA 24-hour assignment. For improvements or suggestions, please open an issue.

---

## 📄 License

Built for educational and assignment purposes.

---

**Repository**: https://github.com/Pamu0002/Native-website-audit-tool  
**Status**: ✅ Complete (14/14 Requirements Met)
