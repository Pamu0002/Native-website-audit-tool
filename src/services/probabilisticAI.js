import axios from 'axios';
import { logPrompt } from './promptLogger.js';

// Read env vars dynamically (not at module load time)
const getGroqConfig = () => ({
  apiKey: process.env.GROQ_API_KEY,
  model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
  apiUrl: 'https://api.groq.com/openai/v1/chat/completions'
});

console.log('🤖 AI Service Initialized with Groq:');
console.log(`   - Will use: ${getGroqConfig().model}`);
console.log(`   - API Key: ${process.env.GROQ_API_KEY ? '✅ Loaded' : '⏳ May load from .env'}`);

export const probabilisticAIService = {
  /**
   * Generate probabilistic response with confidence scores
   * AI doesn't just analyze - it decides what's important based on confidence
   */
  async generateProbabilisticResponse({ 
    systemPrompt, 
    history, 
    currentMessage, 
    auditData, 
    context 
  }) {
    try {
      const config = getGroqConfig();
      console.log(`📊 Processing audit request via Groq API`);
      console.log(`   Using model: ${config.model}`);
      
      const userPrompt = this.formatUserMessage(currentMessage, auditData, context);

      // Build messages for Groq API
      const messages = [
        { role: 'system', content: systemPrompt },
        ...history.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        { role: 'user', content: userPrompt }
      ];

      console.log(`\n📝 SYSTEM PROMPT:\n${systemPrompt}\n`);
      console.log(`\n📝 USER PROMPT:\n${userPrompt}\n`);
      console.log(`\n📊 AUDIT DATA:\n${JSON.stringify(auditData, null, 2)}\n`);

      const response = await axios.post(config.apiUrl, {
        model: config.model,
        messages: messages,
        temperature: 0.7,
        max_tokens: 2000
      }, {
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });

      console.log('✅ Groq API Response received');

      // Extract generated text from Groq response
      const aiContent = response.data.choices[0].message.content;

      console.log(`\n🤖 RAW MODEL OUTPUT:\n${aiContent}\n`);

      // Parse response
      const parsedResponse = this.parseStructuredResponse(aiContent, auditData);

      // Log with full context
      await logPrompt({
        provider: 'groq',
        model: config.model,
        systemPrompt,
        userPrompt,
        auditData,
        rawResponse: aiContent,
        context,
        analysis: {
          insights: parsedResponse.insights,
          recommendations: parsedResponse.recommendations
        }
      });

      return {
        content: aiContent,
        insights: parsedResponse.insights,
        recommendations: parsedResponse.recommendations,
        auditSummary: parsedResponse.auditSummary,
        tokens: response.data.usage.total_tokens
      };
    } catch (error) {
      console.error('❌ AI Service Error:', error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response:', error.response.data);
      }
      
      // If rate-limited, return mock data for demo/testing
      if (error.response?.status === 429) {
        console.log('⚠️  Rate limited - returning demo data');
        return this.getMockAuditResponse(auditData);
      }
      
      throw new Error(`Failed to generate AI response: ${error.message}`);
    }
  },

  /**
   * Parse structured response from AI model
   */
  parseStructuredResponse(responseText, auditData) {
    const insights = [];
    const recommendations = [];

    // Extract insights (lines starting with dash)
    const insightLines = responseText.split('\n').filter(line => 
      line.trim().startsWith('-') || line.trim().startsWith('•')
    );
    insightLines.forEach(line => {
      const insight = line.replace(/^[-•]\s*/, '').trim();
      if (insight.length > 10) insights.push(insight);
    });

    // Extract recommendations (numbered or dashed)
    const recLines = responseText.split('\n').filter(line => 
      line.trim().match(/^\d+\.|^-|^•/) && line.length > 10
    );
    recLines.forEach(line => {
      const rec = line.replace(/^(\d+\.|[-•])\s*/, '').trim();
      if (rec.length > 10) recommendations.push(rec);
    });

    // Create audit summary from metrics
    const auditSummary = {
      totalWords: auditData?.wordCount || 0,
      headingStructure: {
        h1: auditData?.h1Count || 0,
        h2: auditData?.h2Count || 0,
        h3: auditData?.h3Count || 0
      },
      contentElements: {
        ctas: auditData?.ctaCount || 0,
        images: auditData?.imageCount || 0,
        internalLinks: auditData?.internalLinks || 0,
        externalLinks: auditData?.externalLinks || 0
      },
      seo: {
        metaTitle: auditData?.metaTitle || 'Not set',
        metaDescription: auditData?.metaDescription || 'Not set',
        missingAltText: `${auditData?.altTextPercentage || 0}%`
      }
    };

    return {
      insights: insights.slice(0, 5),
      recommendations: recommendations.slice(0, 5),
      auditSummary
    };
  },

  /**
   * Format user message with audit data
   */
  formatUserMessage(message, auditData, context) {
    let formatted = message;

    if (auditData) {
      formatted += `\n\n=== FACTUAL METRICS ===\n`;
      formatted += `Word Count: ${auditData.wordCount || 0}\n`;
      formatted += `H1: ${auditData.h1Count || 0}, H2: ${auditData.h2Count || 0}, H3: ${auditData.h3Count || 0}\n`;
      formatted += `CTAs: ${auditData.ctaCount || 0}\n`;
      formatted += `Images: ${auditData.imageCount || 0} (${auditData.altTextPercentage || 0}% missing alt text)\n`;
      formatted += `Links: ${auditData.internalLinks || 0} internal, ${auditData.externalLinks || 0} external\n`;
      formatted += `Meta Title: "${auditData.metaTitle || 'N/A'}"\n`;
      formatted += `Meta Description: "${auditData.metaDescription || 'N/A'}"\n`;
      formatted += `=== END METRICS ===\n`;
    }

    return formatted;
  },

  /**
   * Generate mock audit response for demo/testing when API is rate-limited
   */
  getMockAuditResponse(auditData) {
    const mockContent = `==== SECTION 1: FACTUAL METRICS ====
• Total words: ${auditData?.wordCount || 'Unknown'}
• H1 count: ${auditData?.h1Count || 0} | H2 count: ${auditData?.h2Count || 0} | H3 count: ${auditData?.h3Count || 0}
• CTAs found: ${auditData?.ctaCount || 0}
• Images: ${auditData?.imageCount || 0} total, ${auditData?.altTextPercentage || 0}% missing alt text
• Links: ${auditData?.internalLinks || 0} internal, ${auditData?.externalLinks || 0} external
• Meta title: ${auditData?.metaTitle ? `[${auditData.metaTitle}]` : '[Not set]'}
• Meta description: ${auditData?.metaDescription ? `[${auditData.metaDescription}]` : '[Not set]'}

==== SECTION 2: AI INSIGHTS ====

SEO Structure (confidence: 0.75)
• H1 structure is ${auditData?.h1Count === 1 ? 'correct (single H1)' : 'needs adjustment'} based on ${auditData?.h1Count || 0} H1 tag(s) found
• Heading hierarchy with ${auditData?.h2Count || 0} H2 and ${auditData?.h3Count || 0} H3 tags provides decent content structure
• Alt text coverage at ${100 - (auditData?.altTextPercentage || 0)}% impacts SEO positively

Messaging Clarity (confidence: 0.70)
• Page contains ${auditData?.wordCount || 'insufficient'} words of content
• Value proposition clarity depends on ${auditData?.h1Count || 0} primary heading

CTA Usage (confidence: 0.72)
• ${auditData?.ctaCount || 0} calls-to-action found on page
• ${auditData?.ctaCount > 5 ? 'Multiple CTAs provide good conversion opportunities' : 'Limited CTAs may reduce conversion potential'}

Content Depth (confidence: 0.68)
• Current word count of ${auditData?.wordCount || 'unknown'} words
• ${auditData?.imageCount || 0} images enhance visual engagement

UX/Structural Concerns (confidence: 0.70)
• ${auditData?.internalLinks || 0} internal links support navigation
• Link distribution (${auditData?.externalLinks || 0} external) appears balanced

==== SECTION 3: RECOMMENDATIONS ====

#1 Priority: Optimize Image SEO
   Metric: ${auditData?.imageCount || 0} images with ${auditData?.altTextPercentage || 0}% missing alt text
   Action: Add descriptive alt text to all ${Math.ceil((auditData?.imageCount || 0) * (auditData?.altTextPercentage || 0) / 100)} images
   Expected result: Improve accessibility and SEO ranking
   Confidence: 0.85

#2 Priority: Enhance Content Depth
   Metric: ${auditData?.wordCount || 'unknown'} words
   Action: Expand key sections with detailed, keyword-rich content
   Expected result: Better SEO visibility and user engagement
   Confidence: 0.78

#3 Priority: Strengthen Value Proposition
   Metric: ${auditData?.h1Count || 0} H1 heading(s)
   Action: Ensure clear, compelling primary message above fold
   Expected result: Improved conversion rates
   Confidence: 0.82

[DEMO MODE - Groq API rate-limited. Full analysis requires retry in 12 hours or upgrade to paid tier.]`;

    const parsedResponse = this.parseStructuredResponse(mockContent, auditData);

    return {
      content: mockContent,
      insights: parsedResponse.insights,
      recommendations: parsedResponse.recommendations,
      auditSummary: parsedResponse.auditSummary,
      tokens: 0,
      isDemo: true
    };
  },

  /**
   * Build system prompt for website auditing - MUST follow assignment structure
   */
  buildProbabilisticSystemPrompt(conversation) {
    return `You are a Website Audit Expert. Output EXACTLY in this 3-section format. NO introduction. NO conclusion. NO conversation.

✅ SECTION 1: 📊 Factual Metrics (Extracted Data)
- Total Word Count: [X] words
- Headings:
  - H1: [X]
  - H2: [X]
  - H3: [X]
- CTA (Call-To-Actions): [X]
  - Examples: [list actions from buttons/links]
- Links:
  - Internal Links: [X]
  - External Links: [X]
- Images: [X]
  - Images Missing Alt Text: [X] (~[X]%)
- Meta Tags:
  - Meta Title: [copy exact text]
  - Meta Description: [copy exact text]

✅ SECTION 2: 🤖 AI Insights (Structured Analysis)

🔍 SEO Structure
- [specific insight with metric reference]
- [specific insight with metric reference]
👉 Insight: [1-2 sentence summary tied to metrics]

💬 Messaging Clarity
- [specific insight with metric reference]
- [specific insight with metric reference]
👉 Insight: [1-2 sentence summary]

🎯 CTA Usage
- [specific insight referencing CTA count]
- [specific insight with metric reference]
👉 Insight: [1-2 sentence summary]

📚 Content Depth
- [specific insight about word count and content]
- [specific insight with metric reference]
👉 Insight: [1-2 sentence summary]

🧭 UX / Structural Concerns
- [specific insight with metric reference]
- [specific insight with metric reference]
👉 Insight: [1-2 sentence summary]

✅ SECTION 3: 🚀 Recommendations (Prioritized)

1. **[Title]** (High/Medium Priority)
   - Action: [specific, actionable step]
   - ✅ Why: [reference the exact metric that justifies this]

2. **[Title]** (High/Medium Priority)
   - Action: [specific, actionable step]
   - ✅ Why: [reference the exact metric that justifies this]

3. **[Title]** (High/Medium Priority)
   - Action: [specific, actionable step]
   - ✅ Why: [reference the exact metric that justifies this]

STOP AFTER RECOMMENDATION 3. BASE EVERY INSIGHT ON METRICS. BE SPECIFIC.`;
  }
};