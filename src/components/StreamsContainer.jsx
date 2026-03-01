import { motion } from 'framer-motion';
import './StreamsContainer.css';

const streams = [
  {
    token: 'ETH',
    tokenName: 'Wrapped Ether',
    recipient: '0x82...91',
    status: 'streaming',
    flowRate: '0.00034 ETH/s',
    vested: 45,
    bgColor: '#27272A',
    textColor: '#fff',
  },
  {
    token: 'USDC',
    tokenName: 'USD Coin',
    recipient: '0x11...bb',
    status: 'streaming',
    flowRate: '1.0204 USDC/s',
    vested: 12,
    bgColor: '#fff',
    textColor: '#000',
  },
  {
    token: 'DAI',
    tokenName: 'Dai Stablecoin',
    recipient: '0x77...2a',
    status: 'paused',
    flowRate: '0.00 DAI/s',
    vested: 78,
    bgColor: '#627EEA',
    textColor: '#fff',
  },
];

export default function StreamsContainer() {
  return (
    <div className="streams-container">
      <div className="table-header">
        <h3 className="table-title">Active Streams</h3>
        <div className="table-actions">
          <motion.span 
            className="filter-tag"
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          >
            FILTER
          </motion.span>
          <motion.span 
            className="filter-tag"
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          >
            SORT
          </motion.span>
        </div>
      </div>
      
      <div className="streams-list">
        {streams.map((stream, idx) => (
          <motion.div 
            key={idx} 
            className="stream-row" 
            style={{ borderBottom: idx === streams.length - 1 ? 'none' : '' }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + idx * 0.1 }}
            whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
          >
            <div className="stream-token">
              <motion.div 
                className="token-icon" 
                style={{ 
                  background: stream.bgColor, 
                  color: stream.textColor 
                }}
                whileHover={{ rotate: 15, scale: 1.1 }}
              >
                {stream.token}
              </motion.div>
              <div>
                <div className="token-name">{stream.tokenName}</div>
                <div className="token-recipient">To {stream.recipient}</div>
              </div>
            </div>
            
            <div>
              <motion.span 
                className={`status-badge ${stream.status}`}
                animate={stream.status === 'streaming' ? {
                  opacity: [1, 0.7, 1],
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {stream.status === 'streaming' ? 'Streaming' : 'Paused'}
              </motion.span>
            </div>
            
            <div>
              <div className="flow-rate">{stream.flowRate}</div>
              <div className="flow-label">FLOW RATE</div>
            </div>
            
            <div className="vesting-col">
              <div className="vesting-header">
                <span className="vesting-label">VESTED</span>
                <span className="vesting-value">{stream.vested}%</span>
              </div>
              <div className="progress-track">
                <motion.div 
                  className={`progress-fill ${stream.status === 'streaming' ? 'accent' : ''}`} 
                  initial={{ width: 0 }}
                  animate={{ width: `${stream.vested}%` }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 + idx * 0.1 }}
                ></motion.div>
              </div>
            </div>
            
            <div className="action-col">
              <motion.button 
                className="action-btn secondary manage-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Manage
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
