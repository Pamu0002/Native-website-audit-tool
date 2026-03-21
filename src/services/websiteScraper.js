import axios from 'axios';
import cheerio from 'cheerio';

export const websiteScraper = {
  async scrapeWebsite(url) {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      const metrics = this.extractMetrics($, url);

      return metrics;
    } catch (error) {
      throw new Error(`Failed to scrape website: ${error.message}`);
    }
  },

  extractMetrics($, url) {
    return {
      url,
      wordCount: this.countWords($),
      headings: {
        h1: $('h1').length,
        h2: $('h2').length,
        h3: $('h3').length
      },
      ctaCount: $('a[href*="contact"], a[href*="signup"], button').length,
      links: {
        total: $('a').length,
        internal: $('a[href^="/"]').length,
        external: $('a[href^="http"]').length
      },
      images: {
        total: $('img').length,
        missingAlt: $('img:not([alt])').length,
        missingAltPercent: this.calculateMissingAltPercent($)
      },
      meta: {
        title: $('title').text(),
        description: $('meta[name="description"]').attr('content') || ''
      },
      sampleText: this.extractSampleText($)
    };
  },

  countWords($) {
    const text = $('body').text();
    return text.split(/\s+/).filter(word => word.length > 0).length;
  },

  calculateMissingAltPercent($) {
    const totalImages = $('img').length;
    if (totalImages === 0) return 0;
    const missingAlt = $('img:not([alt])').length;
    return parseFloat(((missingAlt / totalImages) * 100).toFixed(1));
  },

  extractSampleText($) {
    let text = $('main').text() || $('body').text();
    return text.substring(0, 2000).trim();
  }
};
