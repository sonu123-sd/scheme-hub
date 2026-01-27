import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedItemProps {
  children: React.ReactNode;
  className?: string;
  index?: number;
  baseDelay?: number;
}

const AnimatedItem: React.FC<AnimatedItemProps> = ({
  children,
  className = '',
  index = 0,
  baseDelay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.4,
        delay: baseDelay + index * 0.1,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedItem;
