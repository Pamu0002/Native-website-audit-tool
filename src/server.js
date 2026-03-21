import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { auditRouter } from './routes/audit.js';
import { conversationRouter } from './routes/conversation.js';
import { memoryRouter } from './routes/memory.js';

dotenv.config();

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
