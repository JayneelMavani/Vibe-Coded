import React from 'react';

export default function History({ history }) {
  if (!history || history.length === 0) return null;

  return (
    <div className="history-section fade-in">
      <h2>Recent Scans</h2>
      <div className="history-list">
        {history.map((item) => {
          let riskClass = 'history-safe';
          if (item.riskLevel === 'Suspicious') riskClass = 'history-suspicious';
          if (item.riskLevel === 'High Risk') riskClass = 'history-dangerous';

          return (
            <div key={item.id} className={`history-item ${riskClass}`}>
              <div className="history-url" title={item.url}>{item.url}</div>
              <div className="history-meta">
                <span className="history-level">{item.riskLevel}</span>
                <span className="history-score">{item.confidenceScore}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
