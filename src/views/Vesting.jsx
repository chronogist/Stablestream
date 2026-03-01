import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import NavRail from '../components/NavRail';
import './Vesting.css';

const schedules = [
  {
    initials: 'CC',
    tokenName: 'Core Contributor A',
    date: 'Created Jan 12, 2024',
    type: 'cliff',
    duration: '12 Month Duration',
    unlocked: '250,000',
    progress: 25,
    remaining: '750,000 SLO',
    color: '#ec4899',
    active: true,
  },
  {
    initials: 'AP',
    tokenName: 'Advisory Pool',
    date: 'Created Dec 05, 2023',
    type: 'linear',
    duration: '24 Month Duration',
    unlocked: '4.15',
    progress: 15,
    remaining: '12.45 ETH',
    color: '#8b5cf6',
    active: true,
  },
  {
    initials: 'T',
    tokenName: 'Treasury Reserve',
    date: 'Created Nov 01, 2023',
    type: 'locked',
    duration: '48 Month Duration',
    unlocked: '0.00',
    progress: 0,
    remaining: '5,000,000 SLO',
    color: '#6b7280',
    active: false,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

const chartPathVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: 2,
      ease: "easeInOut",
    },
  },
};

export default function Vesting() {
  const [timeLeft, setTimeLeft] = useState({
    days: 12,
    hours: 4,
    minutes: 28,
    seconds: 45
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            } else {
              hours = 23;
              if (days > 0) days--;
            }
          }
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNum = (num) => num.toString().padStart(2, '0');

  return (
    <div className="vesting-page">
      <NavRail />
      <motion.main 
        className="vesting-main"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="vesting-content">
          <motion.div className="content-header" variants={itemVariants}>
            <div>
              <h1 className="page-title">Vesting Schedules</h1>
              <p className="page-subtitle">Manage and track your token unlocking timelines</p>
            </div>
            <div className="header-actions">
              <motion.button 
                className="action-btn secondary"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                whileTap={{ scale: 0.95 }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Export Data
              </motion.button>
              <motion.button 
                className="action-btn primary"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
                Create Schedule
              </motion.button>
            </div>
          </motion.div>

          <div className="vesting-grid">
            <motion.div className="chart-container" variants={itemVariants}>
              <div className="chart-header">
                <div>
                  <h2 className="chart-title">
                    Projected Unlock Timeline
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="info-icon">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M12 16v-4"></path>
                      <path d="M12 8h.01"></path>
                    </svg>
                  </h2>
                  <p className="chart-subtitle">Visualizing cumulative token availability over time</p>
                </div>
                <div className="chart-legend">
                  <div className="legend-item">
                    <div className="legend-dot" style={{ background: '#8b5cf6' }}></div>
                    <span className="legend-label">Linear</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-dot" style={{ background: '#ec4899' }}></div>
                    <span className="legend-label">Cliff</span>
                  </div>
                </div>
              </div>

              <div className="chart-area">
                <div className="chart-y-axis">
                  <span>1.0M</span>
                  <span>750K</span>
                  <span>500K</span>
                  <span>250K</span>
                  <span>0</span>
                </div>

                <div className="chart-svg-container">
                  <svg className="chart-svg" viewBox="0 0 800 300" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="gradientPurple" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.2"></stop>
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0"></stop>
                      </linearGradient>
                      <linearGradient id="gradientPink" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ec4899" stopOpacity="0.2"></stop>
                        <stop offset="100%" stopColor="#ec4899" stopOpacity="0"></stop>
                      </linearGradient>
                      <filter id="glowPink" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="4" result="blur"></feGaussianBlur>
                        <feComposite in="SourceGraphic" in2="blur" operator="over"></feComposite>
                      </filter>
                    </defs>

                    <motion.path 
                      d="M 0 300 L 800 120" 
                      stroke="#8b5cf6" 
                      strokeWidth="2" 
                      fill="none" 
                      className="chart-line-purple"
                      variants={chartPathVariants}
                    ></motion.path>

                    <motion.path 
                      d="M 0 300 L 280 300 L 280 180 L 800 60" 
                      stroke="none" 
                      fill="url(#gradientPink)"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1, duration: 1.5 }}
                    ></motion.path>
                    <motion.path 
                      d="M 0 300 L 280 300 L 280 180 L 800 60" 
                      stroke="#ec4899" 
                      strokeWidth="2" 
                      fill="none" 
                      filter="url(#glowPink)" 
                      className="chart-line-pink"
                      variants={chartPathVariants}
                    ></motion.path>

                    <motion.line 
                      x1="280" y1="300" x2="280" y2="80" 
                      stroke="#ec4899" 
                      strokeWidth="1" 
                      strokeDasharray="4 4" 
                      opacity="0.5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 1, duration: 1 }}
                    ></motion.line>

                    <motion.g 
                      transform="translate(280, 80)"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.5, type: "spring" }}
                    >
                      <rect x="-30" y="-35" width="60" height="30" rx="4" fill="#ec4899"></rect>
                      <text x="0" y="-19" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">CLIFF</text>
                      <text x="0" y="-8" textAnchor="middle" fill="white" fontSize="8" opacity="0.9">MAR 15</text>
                      <path d="M -4 0 L 0 6 L 4 0 Z" fill="#ec4899" transform="translate(0, -5)"></path>
                    </motion.g>
                  </svg>
                </div>

                <div className="chart-x-axis">
                  <span>JAN 24</span>
                  <span>FEB 24</span>
                  <span>MAR 24</span>
                  <span>APR 24</span>
                  <span>MAY 24</span>
                  <span>JUN 24</span>
                  <span>JUL 24</span>
                </div>
              </div>
            </motion.div>

            <motion.div className="stats-sidebar" variants={itemVariants}>
              <div className="countdown-card">
                <div className="countdown-noise"></div>
                <div className="countdown-glow"></div>
                <div className="countdown-content">
                  <h3 className="countdown-label">Next Unlock In</h3>
                  <div className="countdown-timer">
                    <div className="timer-unit">
                      <span className="timer-val">{formatNum(timeLeft.days)}</span>
                      <span className="timer-lbl">Days</span>
                    </div>
                    <motion.span 
                      className="timer-sep"
                      animate={{ opacity: [0.3, 0.7, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >:</motion.span>
                    <div className="timer-unit">
                      <span className="timer-val">{formatNum(timeLeft.hours)}</span>
                      <span className="timer-lbl">Hrs</span>
                    </div>
                    <motion.span 
                      className="timer-sep"
                      animate={{ opacity: [0.3, 0.7, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                    >:</motion.span>
                    <div className="timer-unit">
                      <span className="timer-val">{formatNum(timeLeft.minutes)}</span>
                      <span className="timer-lbl">Min</span>
                    </div>
                    <motion.span 
                      className="timer-sep"
                      animate={{ opacity: [0.3, 0.7, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
                    >:</motion.span>
                    <div className="timer-unit">
                      <span className="timer-val highlight">{formatNum(timeLeft.seconds)}</span>
                      <span className="timer-lbl">Sec</span>
                    </div>
                  </div>
                  <div className="countdown-progress">
                    <div className="progress-bar">
                      <motion.div 
                        className="progress-fill" 
                        initial={{ width: 0 }}
                        animate={{ width: '85%' }}
                        transition={{ duration: 2, ease: "easeOut" }}
                      ></motion.div>
                    </div>
                    <p className="progress-text">85% of period complete</p>
                  </div>
                </div>
              </div>

              <div className="detail-card">
                <div className="detail-glow"></div>
                <div className="detail-content">
                  <p className="detail-label">Total Allocated</p>
                  <p className="detail-value">1,250,000 <span className="detail-token">SILO</span></p>

                  <div className="progress-ring-container">
                    <svg className="progress-ring" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" stroke="#333" strokeWidth="8" fill="none"></circle>
                      <motion.circle 
                        cx="50" cy="50" r="40" 
                        stroke="#22c55e" strokeWidth="8" fill="none" 
                        strokeDasharray="251.2" 
                        initial={{ strokeDashoffset: 251.2 }}
                        animate={{ strokeDashoffset: 168 }}
                        transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                        strokeLinecap="round" 
                        className="progress-ring-fill"
                      ></motion.circle>
                    </svg>
                    <div className="progress-ring-text">
                      <span className="progress-percent">33%</span>
                    </div>
                  </div>

                  <div className="stats-breakdown">
                    <div className="breakdown-item">
                      <p className="breakdown-label">Currently Unlocked</p>
                      <p className="breakdown-value success">412,500 <span className="breakdown-token">SILO</span></p>
                    </div>
                    <div className="breakdown-item">
                      <p className="breakdown-label">Locked Principal</p>
                      <p className="breakdown-value">837,500 <span className="breakdown-token-dark">SILO</span></p>
                    </div>
                  </div>

                  <motion.button 
                    className="contract-btn"
                    whileHover={{ scale: 1.02, color: 'white' }}
                  >
                    View Contract Details
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M7 17L17 7"></path>
                      <path d="M7 7h10v10"></path>
                    </svg>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="schedules-list">
            <div className="list-header">
              <h3 className="list-title">Active Schedules</h3>
              <span className="list-meta">3 Total Found</span>
            </div>

            <div className="schedules">
              {schedules.map((schedule, idx) => (
                <motion.div 
                  key={idx} 
                  className={`schedule-item ${schedule.active ? 'active' : 'inactive'}`}
                  variants={itemVariants}
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                >
                  <div className="schedule-accent" style={{ background: schedule.color }}></div>
                  <div className="schedule-content">
                    <div className="schedule-info">
                      <motion.div 
                        className="schedule-avatar" 
                        style={{ background: `linear-gradient(135deg, ${schedule.color}, ${schedule.color}dd)` }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        {schedule.initials}
                      </motion.div>
                      <div>
                        <h4 className="schedule-name">{schedule.tokenName}</h4>
                        <p className="schedule-date">{schedule.date}</p>
                      </div>
                    </div>

                    <div className="schedule-type">
                      <span className={`type-badge ${schedule.type}`}>
                        <motion.span 
                          className="type-dot" 
                          style={{ background: schedule.color }}
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        ></motion.span>
                        {schedule.type === 'cliff' ? 'Cliff Vesting' : schedule.type === 'linear' ? 'Linear Stream' : 'Locked'}
                      </span>
                      <p className="schedule-duration">{schedule.duration}</p>
                    </div>

                    <div className="schedule-progress">
                      <div className="progress-bar-column">
                        <div className="progress-header">
                          <div className="progress-info-item">
                            <span className="progress-label">Unlocked</span>
                            <span className="progress-value">{schedule.unlocked}</span>
                          </div>
                        </div>
                        <div className="progress-bar-thin">
                          <motion.div 
                            className="progress-fill-thin" 
                            initial={{ width: 0 }}
                            animate={{ width: `${schedule.progress}%` }}
                            transition={{ duration: 1.5, ease: "easeOut", delay: 1 + idx * 0.1 }}
                            style={{ background: schedule.color }}
                          ></motion.div>
                        </div>
                      </div>
                      <div className="remaining-column">
                        <p className="remaining-label">Remaining</p>
                        <p className="remaining-value">{schedule.remaining}</p>
                      </div>
                    </div>

                    <div className="schedule-action">
                      <motion.button 
                        className="details-btn"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Details
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.main>
    </div>
  );
}
