/**
 * MOCK AI SERVICE - No API calls, just returns realistic sample data
 * Perfect for testing without spending money on API calls
 */

export const mockAIService = {
  /**
   * Generate realistic mock response with confidence scores
   */
  generateMockResponse(userMessage, auditData = null) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Different responses based on keywords
    let mockResponse = {
      seo: `SEO Analysis Report:

[confidence: 0.87] Your meta tags are comprehensive on 78% of pages with well-structured descriptions.

[confidence: 0.84] Internal linking strategy is solid - I found 145 contextual links with appropriate anchor text distribution.

[confidence: 0.71] Schema markup is implemented but underutilized. You're using 4 types out of 12 recommended for your industry.

[confidence: 0.62] Duplicate content detected on 3 product pages that could dilute ranking potential.

[confidence: 0.81] Mobile-first indexing compatible - your structure fully supports modern search requirements.

Key recommendations:
1. Expand schema markup for FAQs and breadcrumbs (high impact, medium effort)
2. Consolidate duplicate content pages using canonical tags
3. Improve internal linking diversity to support key topic clusters`,

      performance: `Performance Analysis:

[confidence: 0.88] Excellent load time: Average 1.8 seconds (excellent range)
[confidence: 0.85] First Contentful Paint: 1.2 seconds (very good)
[confidence: 0.90] Largest Contentful Paint: 2.1 seconds (good)
[confidence: 0.92] No render-blocking resources detected

[confidence: 0.67] Opportunities for improvement:
- Images could be optimized through modern formats (WebP)
- JavaScript bundles are larger than optimal
- CSS could benefit from code splitting

High-impact optimizations:
1. Enable GZIP compression (estimated 40% size reduction)
2. Implement lazy loading for below-fold images
3. Cache static assets for 30+ days in browser cache`,

      analysis: `Comprehensive Website Analysis:

[confidence: 0.85] Overall site health is good with solid technical foundation
[confidence: 0.78] Content quality appears consistent across main sections
[confidence: 0.68] User experience shows room for CTA button improvements
[confidence: 0.82] Navigation structure is intuitive and logically organized

Areas of strength:
- Clean, semantic HTML structure
- Responsive design works across devices
- Fast server response times (~200ms TTFB)

Areas for improvement:
- Add more internal linking between related content
- Implement breadcrumb navigation
- Optimize image file sizes`,

      default: `Website Audit Insights:

[confidence: 0.82] Your website demonstrates solid technical implementation with modern best practices.

[confidence: 0.75] Content organization is logical, though some sections could benefit from better internal linking.

[confidence: 0.71] Performance metrics are in acceptable ranges, with potential for optimization in image handling.

[confidence: 0.68] Accessibility features are present but could be enhanced with ARIA enhancements.

[confidence: 0.80] Mobile responsiveness is functional, showing consideration for multiple device types.

Next steps I recommend:
1. Conduct detailed SEO audit of top 20 pages
2. Implement core web vitals monitoring
3. Establish content update schedule
4. Review analytics for user behavior patterns`
    };

    // Select response based on keywords
    if (lowerMessage.includes('seo') || lowerMessage.includes('search')) {
      return mockResponse.seo;
    } else if (lowerMessage.includes('performance') || lowerMessage.includes('speed') || lowerMessage.includes('fast')) {
      return mockResponse.performance;
    } else if (lowerMessage.includes('analyž') || lowerMessage.includes('audit') || lowerMessage.includes('health')) {
      return mockResponse.analysis;
    }
    
    return mockResponse.default;
  },

  /**
   * Parse confidence scores from response string
   */
  parseConfidences(responseText) {
    const confidencePattern = /\[confidence(?:score)?:\s*(0\.\d+|\d+%)\]/gi;
    const matches = [];
    let match;

    while ((match = confidencePattern.exec(responseText)) !== null) {
      let score = parseFloat(match[1]);
      if (match[1].includes('%')) {
        score = score / 100;
      }
      matches.push({
        score: Math.min(Math.max(score, 0), 1),
        text: responseText.substring(Math.max(0, match.index - 50), match.index + 50)
      });
    }

    return matches;
  },

  /**
   * Get emoji level for confidence
   */
  getConfidenceEmoji(score) {
    if (score >= 0.85) return '🟢';
    if (score >= 0.65) return '🟡';
    if (score >= 0.45) return '🟠';
    return '🔴';
  },

  /**
   * Convert response to structured format
   */
  structureResponse(responseText) {
    const confidences = this.parseConfidences(responseText);
    const confidenceObj = {};
    
    confidences.forEach((conf, i) => {
      confidenceObj[`insight_${i}`] = {
        score: conf.score,
        level: this.getConfidenceEmoji(conf.score),
        text: conf.text.trim()
      };
    });

    return {
      content: responseText,
      confidences: confidenceObj,
      modelDecision: confidences.length > 0 ? 
        confidences[0].score >= 0.8 ? 'STRONG_RECOMMENDATION' : 'MODERATE_RECOMMENDATION' : 'NEUTRAL',
      uncertainties: [
        '{ text: "Exact ranking impact without testing", confidence: 0.45 }',
        '{ text: "Competitors\' SEO strategies may affect results", confidence: 0.50 }'
      ],
      suggestedActions: [
        'Implement recommended optimizations systematically',
        'Monitor analytics for impact measurement',
        'Conduct A/B testing for high-impact changes'
      ],
      nextStep: 'Would you like me to dive deeper into any specific area?',
      tokens: 1250
    };
  }
};
