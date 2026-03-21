import axios from 'axios';
import { logPrompt } from './promptLogger.js';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export const aiService = {
  async generateResponse({ systemPrompt, history, currentMessage, auditData, context }) {
    try {
      // Format conversation history
      const messages = [
        { role: 'system', content: systemPrompt },
        ...history.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        { role: 'user', content: this.formatUserMessage(currentMessage, auditData, context) }
      ];

      // Call Groq API
      const response = await axios.post(GROQ_API_URL, {
        model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
        messages,
        temperature: 0.7,
        max_tokens: 2000
      }, {
        headers: { Authorization: `Bearer ${GROQ_API_KEY}` }
      });

      const aiContent = response.data.choices[0].message.content;

      // Log prompt for audit trail
      await logPrompt({
        provider: 'groq',
        model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
        systemPrompt,
        userPrompt: currentMessage,
        auditData,
        rawResponse: aiContent,
        context
      });

      // Extract suggested actions from response
      const suggestedActions = this.extractSuggestedActions(aiContent);
      const suggestedNextStep = this.extractNextStep(aiContent);

      return {
        content: aiContent,
        suggestedActions,
        suggestedNextStep,
        tokens: response.data.usage.total_tokens
      };
    } catch (error) {
      console.error('AI Service Error:', error.message);
      throw new Error(`Failed to generate AI response: ${error.message}`);
    }
  },

  formatUserMessage(message, auditData, context) {
    let formatted = message;

    if (auditData) {
      formatted += `\n\nWebsite Metrics:\n${JSON.stringify(auditData, null, 2)}`;
    }

    if (context.previousInsights?.length > 0) {
      formatted += `\n\nPrevious Insights:\n${context.previousInsights.join('\n')}`;
    }

    return formatted;
  },

  extractSuggestedActions(responseText) {
    const actions = [];
    const lines = responseText.split('\n');

    lines.forEach(line => {
      if (line.match(/^[-•*]\s+/)) {
        const action = line.replace(/^[-•*]\s+/, '').trim();
        if (action.length > 0) actions.push(action);
      }
    });

    return actions.slice(0, 3); // Return top 3 actions
  },

  extractNextStep(responseText) {
    const patterns = [
      /next.*?(?:audit|analyze).*?(?:website|url)?:\s*(.+?)(?:\n|$)/i,
      /suggest.*?(?:audit|analyze).*?(.+?)(?:\n|$)/i,
      /should.*?(?:audit|analyze).*?(.+?)(?:\n|$)/i
    ];

    for (const pattern of patterns) {
      const match = responseText.match(pattern);
      if (match) return match[1].trim();
    }

    return null;
  }
};
