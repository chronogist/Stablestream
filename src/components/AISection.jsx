import './AISection.css';

export default function AISection() {
  return (
    <div className="ai-section">
      <div className="ai-badge">AI</div>
      <div className="ai-message">
        Based on current flow rates, your treasury cliff expires in <span className="highlight">14 days</span>. Recommend readjusting allocation.
      </div>
    </div>
  );
}
