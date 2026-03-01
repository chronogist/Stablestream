import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './SuccessModal.css';

export default function SuccessModal({ 
  isOpen, 
  onClose, 
  streamData 
}) {
  if (!isOpen) return null;

  const { 
    tokenSymbol = 'USDC',
    totalAmount = '0',
    recipient = '',
    flowRate = '0',
    endDate = '',
    streamId = ''
  } = streamData || {};

  const shortenAddress = (addr) => {
    if (!addr) return '';
    return addr.slice(0, 6) + '...' + addr.slice(-4);
  };

  const getTokenName = (symbol) => {
    switch (symbol) {
      case 'USDC': return 'USD Coin';
      case 'ETH': return 'Ethereum';
      case 'DAI': return 'Dai';
      default: return symbol;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <div className="modal-gradient-bar"></div>
        
        <div className="modal-content">
          <div className="success-icon-container">
            <div className="success-icon-glow"></div>
            <div className="success-icon animate-flow-pulse">
              <svg className="success-check" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>

          <div className="modal-title">
            <h2>Stream Initialized!</h2>
            <p>
              Your payment stream has been successfully created and funds are now flowing in real-time.
            </p>
          </div>

          <div className="modal-details glass-panel">
            <div className="details-header">
              <div className="asset-info">
                <div className="asset-icon">
                  <svg viewBox="0 0 32 32" fill="currentColor">
                    <path d="M16 32C7.163 32 0 24.837 0 16S7.163 0 16 0s16 7.163 16 16-7.163 16-16 16zm7.994-15.781L16.498 4 9 16.22l7.498 4.353 7.496-4.354zM24 17.616l-7.502 4.351L9 17.617l7.498 10.378L24 17.616z"></path>
                  </svg>
                </div>
                <div className="asset-name">
                  <div className="detail-label">Asset</div>
                  <div className="detail-value">{getTokenName(tokenSymbol)}</div>
                </div>
              </div>
              <div className="total-locked">
                <div className="detail-label">Total Locked</div>
                <div className="detail-value mono">{totalAmount} {tokenSymbol}</div>
              </div>
            </div>

            <div className="details-grid">
              <div className="detail-row">
                <span className="detail-label-text">Recipient</span>
                <div className="detail-row-value">
                  <span className="mono">{shortenAddress(recipient)}</span>
                  <button 
                    className="copy-btn"
                    onClick={() => navigator.clipboard.writeText(recipient)}
                    title="Copy address"
                  >
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="detail-row">
                <span className="detail-label-text">Flow Rate</span>
                <span className="flow-rate-value mono">{flowRate} {tokenSymbol}/s</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label-text">End Date</span>
                <span className="detail-row-value">{endDate}</span>
              </div>
              
              {streamId && (
                <div className="detail-row">
                  <span className="detail-label-text">Stream ID</span>
                  <span className="detail-row-value mono">#{streamId}</span>
                </div>
              )}
            </div>
          </div>

          <div className="modal-actions">
            <Link 
              to="/streams" 
              className="btn-gradient modal-btn"
            >
              <span>View Stream</span>
              <svg className="btn-arrow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Link>
            
            <Link 
              to="/dashboard" 
              className="modal-btn secondary"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        <div className="modal-footer">
          <div className="brand-indicator">
            <div className="brand-dot"></div>
            <span>Stablestream</span>
          </div>
        </div>
      </div>
    </div>
  );
}
