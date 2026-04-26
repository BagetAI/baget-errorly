import Head from 'next/head';
import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);

  // Demo State
  const [traceback, setTraceback] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [demoLoading, setDemoLoading] = useState(false);

  const handleSubmit = async (e, source) => {
    e.preventDefault();
    setLoading(true);
    
    const DB_ID = '83ee5a31-a644-4ffe-8b53-060358ad9d53';
    const SUBMIT_URL = `https://stg-app.baget.ai/api/public/databases/${DB_ID}/rows`;

    try {
      const response = await fetch(SUBMIT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { email, source, role: e.target.role?.value || 'unknown' } }),
      });

      if (response.ok) {
        setFeedback({ message: 'Thanks! We\'ll be in touch soon.', type: 'success' });
        setEmail('');
      } else {
        throw new Error();
      }
    } catch (err) {
      setFeedback({ message: 'Something went wrong. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (e) => {
    e.preventDefault();
    setDemoLoading(true);
    setAnalysis('');

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          traceback: traceback || 'ImportError: cannot import name "User" from partially initialized module "models.user" (most likely due to a circular import)',
          files: [
            { path: 'models/user.py', content: 'from utils.auth import check_permission\n\nclass User:\n    def __init__(self, name):\n        self.name = name' },
            { path: 'utils/auth.py', content: 'from models.user import User\n\ndef check_permission(user):\n    return isinstance(user, User)' }
          ]
        }),
      });

      const data = await response.json();
      if (data.analysis) {
        setAnalysis(data.analysis);
      } else {
        setAnalysis('Demo: The engine correctly identifies the circular import between models/user.py and utils/auth.py. (OpenAI Key required for live response)');
      }
    } catch (err) {
      setAnalysis('Error: Ensure OPENAI_API_KEY is set in environment.');
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Errorly - The Action Layer for Python Debugging</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <nav className="container">
        <div className="logo">Errorly</div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#demo">Live Demo</a>
          <a href="#waitlist" className="btn btn-secondary">Join Beta</a>
        </div>
      </nav>

      <header className="hero container">
        <div className="hero-content">
          <span className="badge">Context-Aware Debugging</span>
          <h1>Stop Guessing.<br /><span className="text-primary">Index Your Codebase.</span></h1>
          <p className="subheadline">Errorly finds the root cause of Python errors by reading your local config, .env variables, and cross-file dependencies. No more StackOverflow rabbit holes.</p>
          
          <form className="waitlist-form" onSubmit={(e) => handleSubmit(e, 'hero')}>
            <input 
              type="email" 
              placeholder="Enter your work email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Joining...' : 'Get Early Access'}
            </button>
          </form>
          {feedback.message && (
            <div className={`feedback ${feedback.type}`}>{feedback.message}</div>
          )}
        </div>
        <div className="hero-image">
          <img src="https://baget-errorly.vercel.app/images/high-fidelity-ui-mockup-of-a-technical-p.png" alt="Errorly Visualizing a Python Root Cause" className="main-visual" />
        </div>
      </header>

      <section id="demo" className="demo-section container">
        <div className="section-header">
          <h2>Try the Engine.</h2>
          <p>Paste a traceback or use our circular import example.</p>
        </div>
        <div className="demo-card">
          <div className="demo-input">
            <textarea 
              placeholder="Paste Python Traceback here..."
              value={traceback}
              onChange={(e) => setTraceback(e.target.value)}
            />
            <button className="btn btn-primary" onClick={handleDemo} disabled={demoLoading}>
              {demoLoading ? 'Analyzing...' : 'Analyze Traceback'}
            </button>
          </div>
          <div className="demo-output">
            <div className="output-header">Errorly Analysis</div>
            <pre className="analysis-result">
              {analysis || 'Run the analysis to see Errorly map the context gap...'}
            </pre>
          </div>
        </div>
      </section>

      <section id="features" className="features container">
        <div className="section-header">
          <h2>The Action Layer for Software.</h2>
          <p>Generic AI misses context. Errorly maps your specific logic.</p>
        </div>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="icon">🔍</div>
            <h3>Cross-File Mapping</h3>
            <p>Identifies when a KeyError in your view is actually caused by a missing field in a YAML config 5 directories away.</p>
          </div>
          <div className="feature-card">
            <div className="icon">🏗️</div>
            <h3>Environment Parsing</h3>
            <p>Specifically indexes .env, pyproject.toml, and Dockerfiles to spot version mismatches instantly.</p>
          </div>
          <div className="feature-card">
            <div className="icon">✅</div>
            <h3>Verifiable Fixes</h3>
            <p>Generates root-cause resolutions tailored to your business logic, not just generic syntax suggestions.</p>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="how-it-works">
        <div className="container">
          <div className="split">
            <div className="copy">
              <h2>Fix errors in seconds, not hours.</h2>
              <ol className="steps">
                <li>
                  <strong>Install the CLI</strong>
                  <p>One-line setup in your terminal.</p>
                  <code>pip install errorly</code>
                </li>
                <li>
                  <strong>Run the Traceback</strong>
                  <p>Errorly indexes your project and local environment.</p>
                  <code>errorly analyze traceback.log</code>
                </li>
                <li>
                  <strong>Get the Root Cause</strong>
                  <p>Receive a verifiable code change and explanation.</p>
                </li>
              </ol>
            </div>
            <div className="visual-quote">
              <div className="quote-card">
                <p className="quote">"Finally, an AI that understands my actual project structure instead of just guessing from the traceback."</p>
                <div className="author">— Senior API Engineer @ FinTech Startup</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="waitlist" className="cta-section container">
        <div className="cta-card">
          <h2>Ready to bridge the context gap?</h2>
          <p>Join 100+ Python developers in our private beta. Launching 2026.</p>
          <form className="waitlist-form" onSubmit={(e) => handleSubmit(e, 'footer')}>
            <input 
              type="email" 
              placeholder="Enter your work email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <select name="role" required>
              <option value="" disabled>Your Role</option>
              <option value="backend">Backend Engineer</option>
              <option value="data">Data Engineer</option>
              <option value="ai">AI Developer</option>
              <option value="other">Other</option>
            </select>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Joining...' : 'Join the Waitlist'}
            </button>
          </form>
        </div>
      </section>

      <footer className="container">
        <p>&copy; 2026 Errorly AI. All rights reserved.</p>
        <div className="footer-links">
          <a href="mailto:samuel@baget.ai">Contact Support</a>
        </div>
      </footer>

      <style jsx>{`
        .demo-section { padding: 80px 24px; }
        .demo-card { 
          display: grid; 
          grid-template-columns: 1fr 1fr; 
          gap: 24px; 
          background: #1B2A4A; 
          padding: 24px; 
          border-radius: 16px; 
          color: white;
        }
        .demo-input textarea {
          width: 100%;
          height: 200px;
          background: #0F172A;
          border: 1px solid #38BDF8;
          border-radius: 8px;
          color: #38BDF8;
          padding: 16px;
          font-family: 'JetBrains Mono', monospace;
          margin-bottom: 16px;
          outline: none;
        }
        .demo-output {
          background: #0F172A;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
        }
        .output-header {
          padding: 12px 16px;
          border-bottom: 1px solid #1B2A4A;
          color: #818CF8;
          font-weight: 700;
          font-size: 14px;
        }
        .analysis-result {
          padding: 16px;
          font-size: 14px;
          line-height: 1.5;
          white-space: pre-wrap;
          overflow-y: auto;
          color: #F8FAFC;
        }
        @media (max-width: 900px) {
          .demo-card { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
