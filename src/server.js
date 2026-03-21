import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

// Load environment variables FIRST before importing services
dotenv.config();

import { auditRouter } from './routes/audit.js';
import { conversationRouter } from './routes/conversation.js';
import { memoryRouter } from './routes/memory.js';

console.log('🔧 Environment Variables Loaded:');
console.log(`   AI_PROVIDER: ${process.env.AI_PROVIDER}`);
console.log(`   GROQ_API_KEY: ${process.env.GROQ_API_KEY ? '✅ Present' : '❌ Missing'}`);
console.log(`   NODE_ENV: ${process.env.NODE_ENV}`);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/chat', conversationRouter);        // Chat interface
app.use('/api/audit', auditRouter);              // Website auditing
app.use('/api/memory', memoryRouter);            // Conversation memory

// Root route
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'AI-Native Website Audit Tool API',
    endpoints: {
      chat: 'POST /api/chat/start - Start new conversation',
      message: 'POST /api/chat/message - Send message with optional URL',
      history: 'GET /api/chat/:conversationId/history - Get conversation',
      audit: 'POST /api/audit/analyze - Direct audit analysis',
      memory: 'GET /api/memory/logs - View prompt logs',
      health: 'GET /health - Health check'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'AI-Native Website Audit Tool is running' });
});

app.listen(PORT, () => {
  console.log(`🤖 AI-Native Audit Tool running on http://localhost:${PORT}`);
  console.log(`📚 Chat endpoint: POST /api/chat/message`);
  console.log(`🔍 Audit endpoint: POST /api/audit/analyze`);
  console.log(`💾 Memory endpoint: GET /api/memory/conversations`);
});

export default app;
