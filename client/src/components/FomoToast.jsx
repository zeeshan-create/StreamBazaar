import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';

const NAMES = ['Rahul', 'Amit', 'Priya', 'Sneha', 'Vikram', 'Anjali', 'Karan', 'Deepak', 'Sonia', 'Rohan'];
const PRODUCTS = ['Netflix 4K', 'YouTube Premium', 'Spotify', 'ChatGPT Plus', 'Steam GTA V', 'NordVPN', 'Sony LIV', 'Canva Pro'];
const TIMES = ['just now', '2 mins ago', '5 mins ago', '1 min ago', '4 mins ago'];

export default function FomoToast() {
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const triggerNotification = () => {
      const name = NAMES[Math.floor(Math.random() * NAMES.length)];
      const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
      const time = TIMES[Math.floor(Math.random() * TIMES.length)];
      
      setNotification({ name, product, time });
      
      // Auto hide after 6 seconds
      setTimeout(() => setNotification(null), 6000);
    };

    // First one after 5 seconds
    const firstTimer = setTimeout(triggerNotification, 5000);
    
    // Repeat every 45 seconds
    const interval = setInterval(triggerNotification, 45000);

    return () => {
      clearTimeout(firstTimer);
      clearInterval(interval);
    };
  }, []);

  return (
    <AnimatePresence>
      {notification && (
        <motion.div 
          className="fomo-toast"
          initial={{ opacity: 0, x: -50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -50, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <div className="fomo-icon">
            <ShoppingBag size={20} className="accent-color" />
          </div>
          <div className="fomo-text">
            <div className="fomo-title"><strong>{notification.name}</strong> from India</div>
            <div className="fomo-subtitle">Purchased {notification.product} — <em>{notification.time}</em></div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
