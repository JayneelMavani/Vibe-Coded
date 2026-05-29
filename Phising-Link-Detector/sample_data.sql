-- Sample initial data for Phishing Link Detector

INSERT INTO "ScanHistory" ("url", "riskLevel", "confidenceScore", "triggeredRules", "createdAt")
VALUES
  ('https://google.com', 'Safe', 0, '{"Checks passed, looks safe"}', NOW() - INTERVAL '1 day'),
  ('http://192.168.1.1/login.php', 'High Risk', 90, '{"Uses IP address instead of domain name","Does not use HTTPS","Suspicious keywords found: login"}', NOW() - INTERVAL '4 hours'),
  ('https://my-secure-account-verify.amazon.com', 'Suspicious', 55, '{"Suspicious keywords found: secure, account, verify"}', NOW() - INTERVAL '1 hour'),
  ('https://a.b.c.d.example.com', 'Safe', 25, '{"Multiple subdomains detected"}', NOW()),
  ('http://signin.paypal.com.random-site.xyz/update', 'High Risk', 100, '{"Does not use HTTPS", "Multiple subdomains detected", "Suspicious keywords found: signin, update", "Domain is very new (less than 30 days old)"}', NOW());
