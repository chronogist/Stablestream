import { motion } from 'framer-motion';
import './CardHero.css';

export default function CardHero() {
  const bars = [30, 45, 35, 70, 100, 55, 40];
  
  return (
    <div className="card-hero">
      <div className="hero-content">
        <div className="hero-tags">
          <motion.div 
            className="hero-tag live"
            animate={{ 
              backgroundColor: ['rgba(246, 80, 100, 0.3)', 'rgba(246, 80, 100, 0.6)', 'rgba(246, 80, 100, 0.3)'] 
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.svg 
              width="10" height="10" viewBox="0 0 24 24" fill="white"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
            </motion.svg>
            LIVE VESTING
          </motion.div>
          <div className="hero-tag">CLIFF: 30D</div>
        </div>
        
        <div className="vesting-mini-chart">
          {bars.map((height, idx) => (
            <motion.div 
              key={idx} 
              className={`bar ${idx === 4 ? 'active' : ''}`}
              initial={{ height: 0 }}
              animate={{ 
                height: `${height}%`,
                opacity: idx >= 5 ? 0.3 : 1
              }}
              transition={{ 
                delay: idx * 0.1, 
                duration: 1, 
                type: 'spring', 
                stiffness: 100 
              }}
              whileHover={{ scale: 1.1, filter: 'brightness(1.2)' }}
            ></motion.div>
          ))}
        </div>
      </div>

      <motion.div 
        className="hero-footer"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="hero-value">$842,050.00</div>
        <div className="hero-sub">Total Value Locked</div>
      </motion.div>
    </div>
  );
}
