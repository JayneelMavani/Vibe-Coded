import test from 'node:test';
import assert from 'node:assert';
import { analyzeUrl } from '../utils/analyzer.js';

test('analyzeUrl: perfectly safe URL', async () => {
  const result = await analyzeUrl('https://example.com');
  assert.strictEqual(result.risk_level, 'Safe');
  assert.strictEqual(result.confidence_score, 0);
});

test('analyzeUrl: IP address usage', async () => {
  const result = await analyzeUrl('http://192.168.1.1/login');
  // 40 for IP + 20 for no HTTPS + 30 for login keyword = 90
  assert.strictEqual(result.risk_level, 'High Risk');
  assert.ok(result.triggered_rules.some(r => r.includes('IP address')));
});

test('analyzeUrl: suspicious keywords', async () => {
  const result = await analyzeUrl('https://secure-login-update.com');
  // keywords: secure, login, update -> 3 * 30 = 90
  assert.strictEqual(result.risk_level, 'High Risk');
});

test('analyzeUrl: multiple subdomains', async () => {
  const result = await analyzeUrl('https://a.b.c.d.example.com');
  // dots=4 -> 25
  assert.strictEqual(result.risk_level, 'Safe'); // Because score < 30 is Safe, actually 25 is Safe but wait, 25 is safe. If WHOIS adds 30 it becomes 55 (Suspicious)
  // Let's just check the triggered rules
  assert.ok(result.triggered_rules.some(r => r.includes('subdomain')));
});
