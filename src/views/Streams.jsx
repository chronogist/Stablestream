import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import NavRail from '../components/NavRail';
import './Streams.css';

export default function Streams() {
  const [counter, setCounter] = useState(0);
  const [flashOn, setFlashOn] = useState(true);
  const { address, isConnected } = useAccount();

  const now = Math.floor(Date.now() / 1000);
  
  const mockStreams = [
    {
      id: '1',
      recipient: '0x742d35Cc6634C0532925a3b844Bc9e7595f0e16E',
      token: '0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582',
      deposit: 1500000000n,
      ratePerSecond: 34722n,
      startTime: BigInt(now - 86400 * 30),
      stopTime: BigInt(now + 86400 * 30),
      cancelled: false,
      isMock: true,
    },
    {
      id: '2',
      recipient: '0x8Ba1f109551bD432803012645Hac136E765123E',
      token: '0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582',
      deposit: 800000000n,
      ratePerSecond: 9259n,
      startTime: BigInt(now - 86400 * 15),
      stopTime: BigInt(now + 86400 * 45),
      cancelled: false,
      isMock: true,
    },
    {
      id: '3',
      recipient: '0x1Cb12388aC7b4804d6E18c1e2b3B4f5C6d7E8f9A',
      token: '0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582',
      deposit: 2500000000n,
      ratePerSecond: 28935n,
      startTime: BigInt(now - 86400 * 45),
      stopTime: BigInt(now + 86400 * 15),
      cancelled: false,
      isMock: true,
    },
    {
      id: '4',
      recipient: '0x9Cd21023f8f14b7eB8a9F1b2d3E4f5a6b7c8d9e0',
      token: '0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582',
      deposit: 600000000n,
      ratePerSecond: 6944n,
      startTime: BigInt(now - 86400 * 5),
      stopTime: BigInt(now + 86400 * 55),
      cancelled: false,
      isMock: true,
    },
    {
      id: '5',
      recipient: '0xA1b2C3d4E5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0',
      token: '0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582',
      deposit: 3000000000n,
      ratePerSecond: 34722n,
      startTime: BigInt(now - 86400 * 60),
      stopTime: BigInt(now + 86400 * 30),
      cancelled: false,
      isMock: true,
    },
    {
      id: '6',
      recipient: '0xB2c3D4e5F6a7b8c9D0e1f2A3b4C5d6E7f8A9b0C1',
      token: '0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582',
      deposit: 450000000n,
      ratePerSecond: 5208n,
      startTime: BigInt(now - 86400 * 10),
      stopTime: BigInt(now + 86400 * 50),
      cancelled: false,
      isMock: true,
    },
  ];

  const [displayStreams, setDisplayStreams] = useState(mockStreams);

  useEffect(() => {
    if (!displayStreams || displayStreams.length === 0) {
      setCounter(0);
      return;
    }

    const activeStreams = displayStreams.filter(s => !s.cancelled);
    let totalRate = 0;
    
    activeStreams.forEach(stream => {
      const rate = formatRate(stream.ratePerSecond, stream.token);
      totalRate += rate;
    });

    if (totalRate === 0) {
      setCounter(0);
      return;
    }

    let currentRate = totalRate;

    const tickInterval = setInterval(() => {
      currentRate += totalRate / 10;
      const intPart = Math.floor(currentRate);
      const decPart = currentRate % 1;
      const intFormatted = intPart.toLocaleString('en-US');
      const decFormatted = decPart.toFixed(2).slice(1);
      setCounter(intFormatted + decFormatted);
    }, 100);

    const flashInterval = setInterval(() => {
      setFlashOn(true);
      setTimeout(() => setFlashOn(false), 200);
    }, 1000);

    return () => {
      clearInterval(tickInterval);
      clearInterval(flashInterval);
    };
  }, [displayStreams]);

  const getTokenDecimals = (tokenAddr) => {
    if (!tokenAddr || tokenAddr === '0x0000000000000000000000000000000000000000') return 18;
    if (tokenAddr.toLowerCase() === '0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582') return 6;
    return 18;
  };

  const formatRate = (ratePerSecond, tokenAddr) => {
    const decimals = getTokenDecimals(tokenAddr);
    const rate = parseFloat(ethers.formatUnits(ratePerSecond, decimals));
    return rate;
  };

  const calculateTotalRate = () => {
    if (!displayStreams || displayStreams.length === 0) return 0;
    
    const activeStreams = displayStreams.filter(s => !s.cancelled);
    let totalRate = 0;
    
    activeStreams.forEach(stream => {
      const rate = formatRate(stream.ratePerSecond, stream.token);
      totalRate += rate;
    });
    
    return totalRate;
  };

  const totalRate = calculateTotalRate();

  const formatAddress = (addr) => {
    if (!addr) return '';
    return addr.slice(0, 6) + '...' + addr.slice(-4);
  };

  const formatToken = (tokenAddr) => {
    if (!tokenAddr || tokenAddr === '0x0000000000000000000000000000000000000000') return 'ETH';
    if (tokenAddr.toLowerCase() === '0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582') return 'USDC';
    return tokenAddr.slice(0, 4).toUpperCase();
  };

  const getTokenSymbol = (tokenAddr) => {
    if (!tokenAddr || tokenAddr === '0x0000000000000000000000000000000000000000') return 'ETH';
    if (tokenAddr.toLowerCase() === '0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582') return 'USDC';
    return 'TOKEN';
  };

  const formatAmount = (amount, tokenAddr) => {
    const decimals = getTokenDecimals(tokenAddr);
    return ethers.formatUnits(amount, decimals);
  };

  return (
    <div className="streams-page">
      <div className="noise-texture"></div>
      <NavRail />
      <main className="workspace">
        <header className="header-actions">
          <h1 className="page-title">Live Streams</h1>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link to="/streams/create" className="action-btn">+ New Stream</Link>
          </div>
        </header>

        <section className="viz-container">
          <div className="pulsing-ring"></div>
          <div className="pulsing-ring"></div>
          <div className="pulsing-ring"></div>

          <div className="orbit-container">
            <div className="particle particle-1"></div>
            <div className="particle particle-2"></div>
            <div className="particle particle-3"></div>
          </div>

          <div className="viz-center">
            <div className="flow-label">Aggregated Rate</div>
            <div className="flow-rate">{counter}</div>
            <div className="flow-label flow-label-light">USD / SEC</div>
            <div 
              className="tick-flash" 
              style={{ 
                opacity: flashOn ? '1' : '0.3',
                boxShadow: flashOn ? '0 0 12px #00FF94' : '0 0 4px #00FF94'
              }}
            ></div>
          </div>
        </section>

        <section className="streams-card">
          <div className="list-header">
            <h3 className="list-title">Active Outgoing</h3>
            <div className="list-meta">
              <span style={{ color: '#00FF94' }}>●</span> Demo Mode • 6 Active Streams
            </div>
          </div>

          {displayStreams.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
              {isConnected ? 'No streams found' : 'Connect your wallet to view streams'}
            </div>
          ) : (
            displayStreams.map((stream, idx) => (
              <div
                key={idx}
                className="stream-item"
                style={{ borderBottom: idx === displayStreams.length - 1 ? 'none' : '' }}
              >
                <div className="token-group">
                  <div
                    className="token-sq"
                    style={{ border: `1px solid ${stream.token.toLowerCase() === '0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582' ? '#2775ca' : '#CF8BF3'}` }}
                  >
                    {formatToken(stream.token)}
                  </div>
                  <div>
                    <div className="val-mono" style={{ fontSize: '14px', fontWeight: 600 }}>
                      Stream #{stream.id}
                    </div>
                    <div style={{ fontSize: '11px', color: '#666' }}>
                      to {formatAddress(stream.recipient)}
                    </div>
                  </div>
                </div>
                <div className="hide-mobile">
                  <div className="lbl-sm">Flow Rate</div>
                  <div className="val-mono">
                    {formatAmount(stream.ratePerSecond, stream.token)} {getTokenSymbol(stream.token)}/s
                  </div>
                </div>
                <div>
                  <div className="lbl-sm">Deposited</div>
                  <div className="val-mono">
                    {formatAmount(stream.deposit, stream.token)} {getTokenSymbol(stream.token)}
                  </div>
                </div>
                <div className="status-cell">
                  <div className="status-dot" style={{ 
                    background: stream.cancelled ? '#666' : '#00FF94',
                    boxShadow: stream.cancelled ? 'none' : '0 0 8px #00FF94'
                  }}></div>
                  <span className="status-text">
                    {stream.cancelled ? 'Cancelled' : 'Active'}
                  </span>
                </div>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}
