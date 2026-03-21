import { v4 as uuidv4 } from 'uuid';
import { probabilisticAIService } from './probabilisticAI.js';

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
        confidenceHistory: [], // Track model's confidence over time
        userPreferences: {},
        modelBias: {} // Track what the model tends to prioritize
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

  // Add message to conversation (with optional metadata for confidence, etc.)
  addMessage(conversationId, role, content, metadata = {}) {
    const conversation = conversations.get(conversationId);
    if (!conversation) throw new Error('Conversation not found');

    conversation.messages.push({
      role,
      content,
      timestamp: new Date(),
      ...metadata // Store confidence, uncertainties, etc.
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

  /**
   * PROBABILISTIC MESSAGE PROCESSING
   * AI doesn't just analyze - it makes decisions based on confidence scores
   */
  async processMessage(conversationId, userMessage, auditData = null) {
    const conversation = conversations.get(conversationId);
    if (!conversation) throw new Error('Conversation not found');

    // Add user message
    this.addMessage(conversationId, 'user', userMessage);

    // Build conversation context
    const history = this.getHistory(conversationId);
    const systemPrompt = this.buildProbabilisticSystemPrompt(conversation);

    // Get PROBABILISTIC AI response (with confidence scores)
    const aiResponse = await probabilisticAIService.generateProbabilisticResponse({
      systemPrompt,
      history,
      currentMessage: userMessage,
      auditData,
      context: conversation.context
    });

    // Store AI message with confidence metadata
    this.addMessage(conversationId, 'assistant', aiResponse.content, {
      confidences: aiResponse.confidences,
      modelDecision: aiResponse.modelDecision,
      uncertainties: aiResponse.uncertainties,
      suggestedActions: aiResponse.suggestedActions
    });

    // Update conversation context based on model's probabilistic reasoning
    if (aiResponse.modelDecision) {
      conversation.context.confidenceHistory.push({
        timestamp: new Date(),
        decision: aiResponse.modelDecision,
        confidences: aiResponse.confidences
      });
    }

    // Track what the model prioritizes (model bias)
    if (aiResponse.confidences && Object.keys(aiResponse.confidences).length > 0) {
      const highConfidenceTopics = Object.entries(aiResponse.confidences)
        .filter(([_, conf]) => conf.score >= 0.75)
        .map(([_, conf]) => conf.text?.substring(0, 50));
      
      conversation.context.modelBias = {
        ...conversation.context.modelBias,
        highPriorityTopics: highConfidenceTopics
      };
    }

    // Next step is MODEL-DRIVEN (what AI thinks matters, not rules)
    if (aiResponse.nextStep) {
      conversation.context.suggestedNextStep = aiResponse.nextStep;
    }

    return {
      conversationId,
      message: aiResponse.content,
      
      // PROBABILISTIC DATA (what makes this AI-native)
      confidences: aiResponse.confidences,
      modelDecision: aiResponse.modelDecision,
      uncertainties: aiResponse.uncertainties,
      
      // Actions and suggestions from model reasoning
      suggestedActions: aiResponse.suggestedActions,
      nextStep: aiResponse.nextStep,
      
      // Transparency: show the model's reasoning
      reasoning: {
        highestConfidence: this.getHighestConfidenceInsight(aiResponse.confidences),
        lowestConfidence: this.getLowestConfidenceInsight(aiResponse.confidences),
        whatIsUncertain: aiResponse.uncertainties
      }
    };
  },

  /**
   * Build PROBABILISTIC system prompt
   * Tells the AI to reason with confidence scores and uncertainties
   */
  buildProbabilisticSystemPrompt(conversation) {
    const audits = conversation.context.auditedUrls.length;
    const previousInsights = conversation.context.previousInsights.length;
    const confidenceHistory = conversation.context.confidenceHistory.length;

    return `You are an AI-Native Website Audit Expert with PROBABILISTIC REASONING.

CONTEXT:
- Analyzed ${audits} website(s)
- Generated ${previousInsights} insight(s)
- Built ${confidenceHistory} confidence model(s)

YOUR PROBABILISTIC CAPABILITIES:
1. Make decisions based on confidence levels (not deterministic rules)
2. Express uncertainty about what you don't know
3. Rate your confidence in each insight (0-1 scale)
4. Recommend actions based on probability and impact
5. Remember trends and patterns from previous audits
6. Explain what factors drive your confidence

CONFIDENCE FRAMEWORK:
- 🟢 High (≥0.85): Strong evidence, recommend immediate action
- 🟡 Medium (0.65-0.84): Moderate supporting evidence, worth investigating
- 🟠 Low (0.45-0.64): Weak signals, needs more research
- 🔴 Very Low (<0.45): Uncertain, acknowledge limitations

RESPONSE FORMAT:
- Include confidence scores in your insights: [confidence: 0.85]
- Explicitly state what you're uncertain about
- Explain the probabilistic reasoning behind recommendations
- Suggest what additional data would increase your confidence

Be conversational and guide the user through the audit process naturally.
Always show your reasoning and confidence levels.`;
  },

  /**
   * Extract highest confidence insight
   */
  getHighestConfidenceInsight(confidences) {
    if (!confidences || Object.keys(confidences).length === 0) return null;

    let highest = null;
    let maxScore = 0;

    Object.entries(confidences).forEach(([_, conf]) => {
      if (conf.score > maxScore) {
        maxScore = conf.score;
        highest = conf;
      }
    });

    return highest;
  },

  /**
   * Extract lowest confidence insight
   */
  getLowestConfidenceInsight(confidences) {
    if (!confidences || Object.keys(confidences).length === 0) return null;

    let lowest = null;
    let minScore = 1;

    Object.entries(confidences).forEach(([_, conf]) => {
      if (conf.score < minScore) {
        minScore = conf.score;
        lowest = conf;
      }
    });

    return lowest;
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
