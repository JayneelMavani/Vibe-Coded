import whois from 'whois-json';
import { URL } from 'url';

const SUSPICIOUS_KEYWORDS = ['login', 'verify', 'secure', 'update', 'account', 'banking', 'signin', 'support', 'auth'];

export async function analyzeUrl(inputUrl) {
  let parsedUrl;
  try {
    parsedUrl = new URL(inputUrl.startsWith('http') ? inputUrl : `http://${inputUrl}`);
  } catch (err) {
    throw new Error('Invalid URL format');
  }

  const hostname = parsedUrl.hostname;
  const triggered_rules = [];
  let score = 0; // The higher the score, the higher the risk

  // 1. IP Address Check
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (ipRegex.test(hostname)) {
    triggered_rules.push('Uses IP address instead of domain name');
    score += 40;
  }

  // 2. HTTPS Check
  if (parsedUrl.protocol !== 'https:') {
    triggered_rules.push('Does not use HTTPS');
    score += 20;
  }

  // 3. Length of URL
  if (inputUrl.length > 75) {
    triggered_rules.push('Unusually long URL');
    score += 15;
  }

  // 4. Number of dots (Subdomains)
  const dotsCount = (hostname.match(/\./g) || []).length;
  if (dotsCount > 3) {
    triggered_rules.push('Multiple subdomains detected');
    score += 25;
  }

  // 5. Suspicious Keywords
  const foundKeywords = SUSPICIOUS_KEYWORDS.filter(kw => hostname.includes(kw) || parsedUrl.pathname.includes(kw));
  if (foundKeywords.length > 0) {
    triggered_rules.push(`Suspicious keywords found: ${foundKeywords.join(', ')}`);
    score += 30 * foundKeywords.length;
  }

  // 6. Domain Age (WHOIS)
  try {
    const results = await whois(hostname);
    if (results && results.creationDate) {
      const creation = new Date(results.creationDate);
      const ageInDays = (new Date() - creation) / (1000 * 60 * 60 * 24);
      if (ageInDays < 30) {
        triggered_rules.push('Domain is very new (less than 30 days old)');
        score += 30;
      }
    }
  } catch (err) {
    // Silently continue if whois fails (e.g. rate limit or unsupported TLD)
    console.error(`WHOIS lookup failed for ${hostname}:`, err.message);
  }

  // Cap score at 100
  const confidence_score = Math.min(score, 100);

  let risk_level = 'Safe';
  if (confidence_score >= 60) risk_level = 'High Risk';
  else if (confidence_score >= 30) risk_level = 'Suspicious';

  if (confidence_score === 0 && triggered_rules.length === 0) {
    triggered_rules.push('Checks passed, looks safe');
  }

  return {
    risk_level,
    confidence_score,
    triggered_rules
  };
}
