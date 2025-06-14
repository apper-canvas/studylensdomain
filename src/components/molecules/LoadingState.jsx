import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const LoadingState = ({ 
  message = 'Loading...', 
  icon = 'Loader',
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex flex-col items-center justify-center p-8 ${className}`}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="mb-4"
      >
        <ApperIcon name={icon} className="w-8 h-8 text-primary" />
      </motion.div>
      <p className="text-gray-600 text-center">{message}</p>
    </motion.div>
  );
};

export default LoadingState;