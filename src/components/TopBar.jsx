import { motion } from 'framer-motion';
import './TopBar.css';

export default function TopBar() {
  return (
    <header className="top-bar">
      <h1 className="page-title">Overview</h1>
      <div className="top-bar-actions">
        <motion.button 
          className="action-btn secondary"
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          whileTap={{ scale: 0.95 }}
        >
          Connect Wallet
        </motion.button>
        <motion.button 
          className="action-btn"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          + New Stream
        </motion.button>
      </div>
    </header>
  );
}
