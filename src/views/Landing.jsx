import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

export default function Landing() {
  const [counter, setCounter] = useState(12450.0);

  useEffect(() => {
    let value = 12450.0;
    const interval = setInterval(() => {
      value += 0.0034;
      setCounter(value);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const formatCounter = (num) => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    });
  };

  return (
    <>
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <Link to="/" className="logo">
            <div className="logo-mark"></div>
            Stablestream
          </Link>
          <div className="nav-links">
            <a href="#" className="btn btn-secondary" style={{ fontSize: '0.9rem' }}>Docs</a>
            <a href="#" className="btn btn-secondary" style={{ fontSize: '0.9rem' }}>Governance</a>
            <Link to="/dashboard" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>
              Launch App
            </Link>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="ambient-light"></div>

        <div className="hero-ring-container">
          <div className="hero-ring-border"></div>
          <div>
            <div className="token-counter">{formatCounter(counter)}</div>
            <span className="token-label">USDC Streamed</span>
          </div>
        </div>

        <div className="hero-content">
          <h1>
            Money that flows.<br />Not just transfers.
          </h1>
          <p>
            Continuous, by-the-second on-chain streaming payments. 
            Automated payroll, freelancer compensation, and token distributions.
          </p>
          <div className="hero-actions">
            <Link to="/streams" className="btn btn-primary">Start Streaming</Link>
            <a href="#" className="btn btn-secondary">How It Works</a>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="landing-page">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value gradient-text">Real-time</div>
              <div className="stat-label">Continuous Payments</div>
            </div>
            <div className="stat-card">
              <div className="stat-value gradient-text">By the Second</div>
              <div className="stat-label">Token Streaming</div>
            </div>
            <div className="stat-card">
              <div className="stat-value gradient-text">On-chain</div>
              <div className="stat-label">Fully Transparent</div>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="landing-page">
          <div className="section-header">
            <h2>Programmable Money</h2>
            <p>The infrastructure for the next generation of digital organizations.</p>
          </div>

          <div className="features-grid">
            <div className="card">
              <div className="feature-icon">⚡</div>
              <h3>Steady Streaming</h3>
              <p>
                Pay contributors by the second. Stop streams instantly. Perfect for DAOs and global payroll.
              </p>
            </div>

            <div className="card">
              <div className="feature-icon">🔒</div>
              <h3>Trustless Escrow</h3>
              <p>
                Lock tokens in smart contracts that auto-release only when on-chain milestones are verified.
              </p>
            </div>

            <div className="card">
              <div className="feature-icon">👁️</div>
              <h3>Radical Transparency</h3>
              <p>
                No backroom deals. Every stream is visible on-chain. Audit trails are built-in by default.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <div className="landing-page">
          <div className="how-it-works-header">
            <h2>How It Works</h2>
          </div>

          <div className="steps-container">
            <div className="steps-line"></div>

            <div className="step-item">
              <div className="step-number">1</div>
              <h3>Connect</h3>
              <p>Connect your wallet and select the token you want to stream (USDC, DAI, or ETH).</p>
            </div>

            <div className="step-item">
              <div className="step-number">2</div>
              <h3>Configure</h3>
              <p>Set the total amount, recipient address, and streaming duration.</p>
            </div>

            <div className="step-item">
              <div className="step-number">3</div>
              <h3>Stream</h3>
              <p>Tokens flow continuously to the recipient who can withdraw anytime.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-footer">
        <div className="landing-page">
          <h2>The waiting is over.</h2>
          <p>Start streaming payments in seconds. No deposits, no wait times.</p>
          <Link to="/dashboard" className="btn btn-primary">Launch App</Link>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-page">
          <p>© 2024-2026 Stablestream Protocol. Open Source.</p>
        </div>
      </footer>
    </>
  );
}
