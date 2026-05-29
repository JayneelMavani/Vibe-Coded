import { useState, useEffect } from 'react';
import ResultCard from './components/ResultCard';
import History from './components/History';
import './index.css';

function App() {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/history');
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error('Failed to fetch history', err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleScan = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsScanning(true);
    setResult(null);

    try {
      const res = await fetch('http://localhost:3000/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setResult(data);
        fetchHistory(); // refresh history
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      alert('Failed to connect to the server.');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="logo">
          <span className="logo-icon">🛡️</span>
          <h1>PhishGuard</h1>
        </div>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </nav>

      <main className="main-content">
        <header className="hero-section">
          <h2>Analyze Suspicious URLs</h2>
          <p>Protect yourself from phishing, malware, and scams. Paste a link below to instantly scan its safety.</p>
        </header>

        <form className="scan-form" onSubmit={handleScan}>
          <div className="input-group">
            <input
              type="text"
              placeholder="https://example.com/login..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="url-input"
              required
            />
            <button 
              type="submit" 
              className={`scan-btn ${isScanning ? 'scanning' : ''}`}
              disabled={isScanning}
            >
              {isScanning ? (
                <span className="loader"></span>
              ) : (
                'Scan URL'
              )}
            </button>
          </div>
        </form>

        <div className="results-container">
          <ResultCard result={result} />
        </div>

        <History history={history} />
      </main>
    </div>
  );
}

export default App;
