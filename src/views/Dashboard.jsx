import { motion } from 'framer-motion';
import NavRail from '../components/NavRail';
import TopBar from '../components/TopBar';
import CardHero from '../components/CardHero';
import AISection from '../components/AISection';
import StreamsContainer from '../components/StreamsContainer';
import WidgetGrid from '../components/WidgetGrid';
import './Dashboard.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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

export default function Dashboard() {
  return (
    <div className="app-shell">
      <div className="noise-texture"></div>
      <NavRail />
      <motion.main 
        className="workspace"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <TopBar />
        </motion.div>
        
        <div className="dashboard-grid">
          <motion.div variants={itemVariants} className="card-hero-wrapper">
            <CardHero />
          </motion.div>
          
          <motion.div variants={itemVariants} className="ai-section-wrapper">
            <AISection />
          </motion.div>
          
          <motion.div variants={itemVariants} className="streams-container-wrapper">
            <StreamsContainer />
          </motion.div>
          
          <motion.div variants={itemVariants} className="widget-grid-wrapper">
            <WidgetGrid />
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
}
