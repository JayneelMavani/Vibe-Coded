import React from 'react';

export default function ResultCard({ result }) {
  if (!result) return null;

  const { risk_level, confidence_score, triggered_rules } = result;
  
  let riskClass = 'result-safe';
  if (risk_level === 'Suspicious') riskClass = 'result-suspicious';
  if (risk_level === 'High Risk') riskClass = 'result-dangerous';

  return (
    <div className={`result-card ${riskClass} fade-in`}>
      <div className="result-header">
        <h2>{risk_level}</h2>
        <div className="confidence-badge">
          {confidence_score}% Risk Score
        </div>
      </div>
      
      <div className="progress-bar-container">
        <div 
          className="progress-bar" 
          style={{ width: `${Math.max(confidence_score, 5)}%`, backgroundColor: 'var(--text-color)' }}
        ></div>
      </div>

      <div className="rules-section">
        <h3>Reasoning</h3>
        {triggered_rules && triggered_rules.length > 0 ? (
          <ul>
            {triggered_rules.map((rule, idx) => (
              <li key={idx}>
                <span className="bullet">•</span> {rule}
              </li>
            ))}
          </ul>
        ) : (
          <p>Everything looks good!</p>
        )}
      </div>
    </div>
  );
}
