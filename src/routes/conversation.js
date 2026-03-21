import express from 'express';
import { conversationManager } from '../services/conversationManager.js';
import { websiteScraper } from '../services/websiteScraper.js';

export const conversationRouter = express.Router();

// Start new conversation
conversationRouter.post('/start', async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'userId required' });
  }

  const conversation = await conversationManager.createConversation(userId);
  res.json({
    conversationId: conversation.id,
    message: '👋 Welcome! I\'m your AI Website Audit Assistant. I can help you analyze websites and provide insights. What would you like to audit today?'
  });
});

// Send message in conversation
conversationRouter.post('/message', async (req, res) => {
  try {
    const { conversationId, message, url } = req.body;

    if (!conversationId || !message) {
      return res.status(400).json({ error: 'conversationId and message required' });
    }

    let auditData = null;

    // If URL provided, scrape it
    if (url) {
      try {
        auditData = await websiteScraper.scrapeWebsite(url);
        conversationManager.updateContext(conversationId, {
          currentUrl: url,
          auditedUrls: [...(conversationManager.getConversation(conversationId).context.auditedUrls || []), url]
        });
      } catch (scrapeError) {
        return res.status(400).json({ error: `Failed to scrape website: ${scrapeError.message}` });
      }
    }

    // Process message through AI (with probabilistic reasoning)
    const response = await conversationManager.processMessage(
      conversationId,
      message,
      auditData
    );

    // Return full probabilistic response
    res.json({
      conversationId: response.conversationId,
      message: response.message,
      
      // PROBABILISTIC DATA - what makes this AI-native
      confidences: response.confidences || {},
      modelDecision: response.modelDecision,
      uncertainties: response.uncertainties || [],
      
      // Suggested actions based on probabilistic reasoning
      suggestedActions: response.suggestedActions || [],
      nextStep: response.nextStep,
      
      // Model's reasoning transparency
      modelReasoning: response.reasoning || {}
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get conversation history
conversationRouter.get('/:conversationId/history', (req, res) => {
  const { conversationId } = req.params;
  const conversation = conversationManager.getConversation(conversationId);

  if (!conversation) {
    return res.status(404).json({ error: 'Conversation not found' });
  }

  res.json({
    conversationId,
    messages: conversation.messages,
    context: conversation.context
  });
});

export default conversationRouter;
