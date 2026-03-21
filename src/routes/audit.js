import express from 'express';
import { aiService } from '../services/aiService.js';
import { websiteScraper } from '../services/websiteScraper.js';

export const auditRouter = express.Router();

// Quick audit endpoint
auditRouter.post('/analyze', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL required' });
    }

    // Scrape website
    const metrics = await websiteScraper.scrapeWebsite(url);

    // Generate audit via AI
    const auditPrompt = `You are a website audit expert. Analyze this website and provide a structured audit report.

Website Metrics:
${JSON.stringify(metrics, null, 2)}

Provide your analysis in this JSON format:
{
  "analysis": {
    "seo": "string - specific SEO insights",
    "messaging": "string - content messaging analysis",
    "cta": "string - call-to-action analysis",
    "depth": "string - site structure analysis",
    "ux": "string - user experience analysis"
  },
  "recommendations": ["string", "string", "string"],
  "warning": "optional critical issue"
}`;

    // Call AI to generate audit
    const response = await aiService.generateResponse({
      systemPrompt: 'You are a website audit expert. Return ONLY valid JSON.',
      history: [],
      currentMessage: auditPrompt,
      auditData: metrics
    });

    // Parse AI response
    let auditReport;
    try {
      auditReport = JSON.parse(response.content);
    } catch {
      auditReport = { content: response.content };
    }

    res.json({
      url,
      metrics,
      audit: auditReport,
      tokensUsed: response.tokens
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default auditRouter;
