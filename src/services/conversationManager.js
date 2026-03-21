import { v4 as uuidv4 } from 'uuid';
import { aiService } from './aiService.js';

// In-memory conversation storage (replace with DB in production)
const conversations = new Map();

export const conversationManager = {
  // Create new conversation session
  async createConversation(userId) {
    const conversationId = uuidv4();
    const conversation = {
      id: conversationId,
      userId,
      messages: [],
      context: {
        auditedUrls: [],
        currentUrl: null,
        previousInsights: [],
        userPreferences: {}
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    conversations.set(conversationId, conversation);
    return conversation;
  },

  // Get conversation by ID
  getConversation(conversationId) {
    return conversations.get(conversationId);
  },

  // Add message to conversation
  addMessage(conversationId, role, content) {
    const conversation = conversations.get(conversationId);
    if (!conversation) throw new Error('Conversation not found');

    conversation.messages.push({
      role,
      content,
      timestamp: new Date()
    });
    conversation.updatedAt = new Date();
    return conversation;
  },

  // Get conversation history (for context window)
  getHistory(conversationId, limit = 10) {
    const conversation = conversations.get(conversationId);
    if (!conversation) return [];
    
    return conversation.messages.slice(-limit);
  },

  // Update context (audited URLs, preferences, etc.)
  updateContext(conversationId, contextUpdate) {
    const conversation = conversations.get(conversationId);
    if (!conversation) throw new Error('Conversation not found');

    conversation.context = { ...conversation.context, ...contextUpdate };
    conversation.updatedAt = new Date();
    return conversation.context;
  },

  // Process AI response with multi-turn handling
  async processMessage(conversationId, userMessage, auditData = null) {
    const conversation = conversations.get(conversationId);
    if (!conversation) throw new Error('Conversation not found');

    // Add user message
    this.addMessage(conversationId, 'user', userMessage);

    // Build conversation context
    const history = this.getHistory(conversationId);
    const systemPrompt = this.buildSystemPrompt(conversation);

    // Get AI response
    const aiResponse = await aiService.generateResponse({
      systemPrompt,
      history,
      currentMessage: userMessage,
      auditData,
      context: conversation.context
    });

    // Add AI message
    this.addMessage(conversationId, 'assistant', aiResponse.content);

    // Extract and update context from AI response
    if (aiResponse.suggestedNextStep) {
      conversation.context.suggestedNextStep = aiResponse.suggestedNextStep;
    }

    return {
      conversationId,
      message: aiResponse.content,
      suggestedActions: aiResponse.suggestedActions,
      nextStep: aiResponse.suggestedNextStep
    };
  },

  // Build system prompt with conversation context
  buildSystemPrompt(conversation) {
    const audits = conversation.context.auditedUrls.length;
    const previousInsights = conversation.context.previousInsights.length;

    return `You are an AI-Native Website Audit Expert. You guide users through website analysis using conversational AI.

You have analyzed ${audits} website(s) and generated ${previousInsights} insight(s) in this conversation.

Your capabilities:
1. Guide users to audit websites (ask clarifying questions)
2. Analyze websites for SEO, UX, messaging, CTAs, and conversion optimization
3. Remember previous audits and provide comparative insights
4. Suggest next steps and improvements iteratively
5. Generate personalized, dynamic audit reports
6. Recommend new websites to audit based on patterns

Be conversational, ask clarifying questions, and guide the user through the audit process naturally.
Always provide actionable insights and suggest next steps.`;
  },

  // Get all conversations for a user
  getUserConversations(userId) {
    const userConvs = Array.from(conversations.values())
      .filter(conv => conv.userId === userId)
      .sort((a, b) => b.updatedAt - a.updatedAt);
    return userConvs;
  },

  // Delete conversation
  deleteConversation(conversationId) {
    return conversations.delete(conversationId);
  }
};
