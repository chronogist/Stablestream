import { motion } from 'framer-motion';
import './WidgetGrid.css';

const widgets = [
  { label: 'Outgoing Streams', value: '12' },
  { label: 'Incoming Streams', value: '04' },
  { label: 'Next Cliff', value: '2D 14H', accent: true },
];

export default function WidgetGrid() {
  return (
    <div className="widget-grid">
      {widgets.map((widget, idx) => (
        <motion.div 
          key={idx} 
          className="mini-card"
          whileHover={{ 
            y: -5, 
            borderColor: 'rgba(255, 255, 255, 0.1)',
            backgroundColor: 'rgba(255, 255, 255, 0.03)'
          }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <span className="mini-card-label">{widget.label}</span>
          <motion.span 
            className={`mini-card-val ${widget.accent ? 'accent' : ''}`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 + idx * 0.1 }}
          >
            {widget.value}
          </motion.span>
        </motion.div>
      ))}
    </div>
  );
}
