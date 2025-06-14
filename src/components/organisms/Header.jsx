import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Header = () => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-shrink-0 h-16 bg-white border-b border-gray-200 px-6 z-40"
    >
      <div className="flex items-center justify-between h-full max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center"
          >
            <ApperIcon name="BookOpen" className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">StudyLens</h1>
            <p className="text-xs text-gray-500">Transform notes into study materials</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="hidden md:flex items-center space-x-2 bg-surface px-3 py-2 rounded-lg"
          >
            <ApperIcon name="Zap" className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-gray-700">AI Powered</span>
          </motion.div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-gray-600 hover:text-primary transition-colors rounded-lg hover:bg-surface"
          >
            <ApperIcon name="Settings" className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;