# AI-Native Website Audit Tool

A **fully AI-driven conversational application** that analyzes websites through intelligent, context-aware dialogue. Unlike traditional form-based audit tools, this application guides you through website analysis naturally.

## 🤖 AI-Native Features

- **Conversational Interface**: Chat with AI to audit websites naturally
- **Multi-turn Analysis**: Ask follow-up questions, refine insights iteratively
- **Conversation Memory**: AI remembers previous audits and builds context
- **AI-Guided Workflow**: AI suggests next steps and improvements
- **Dynamic Reports**: Personalized audit insights generated on-the-fly
- **Autonomous Suggestions**: AI recommends websites to audit

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

## 🚀 Quick Start

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
PORT=3000
NODE_ENV=development
```

### 3. Run Application

```bash
# Backend (Terminal 1)
npm start

# Frontend (Terminal 2)
cd frontend && npm run dev
```

- **Backend**: http://localhost:3000
- **Frontend**: http://localhost:5174

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

## 📊 Prompt Logging

Every AI interaction is logged to `logs/prompt-trace.jsonl`:

```json
{
  "timestamp": "2026-03-22T10:30:00.000Z",
  "provider": "groq",
  "model": "llama-3.3-70b-versatile",
  "systemPrompt": "...",
  "userPrompt": "...",
  "context": { "auditedUrls": [...], "conversationHistory": [...] },
  "rawResponse": "..."
}
```

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
