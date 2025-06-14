import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import { format } from 'date-fns';

const SummaryDisplay = ({ note, onStartStudy, onExport }) => {
  const [expandedSections, setExpandedSections] = useState({
    summary: true,
    original: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const summaryPoints = note.summary.split('\n').filter(point => point.trim());

  return (
    <div className="h-full overflow-y-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Study Summary</h2>
          <p className="text-gray-600 text-sm">
            Generated on {format(new Date(note.createdAt), 'MMM dd, yyyy')}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={onExport}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="Download" className="w-4 h-4" />
            <span>Export</span>
          </Button>
          <Button
            onClick={onStartStudy}
            className="flex items-center space-x-2 bg-accent hover:bg-accent/90"
          >
            <ApperIcon name="Brain" className="w-4 h-4" />
            <span>Start Studying</span>
          </Button>
        </div>
      </motion.div>

      {/* AI-Generated Summary */}
      <Card className="bg-white">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div 
            className="flex items-center justify-between p-4 border-b border-gray-100 cursor-pointer"
            onClick={() => toggleSection('summary')}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="Sparkles" className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">AI Summary</h3>
                <p className="text-sm text-gray-600">{summaryPoints.length} key points identified</p>
              </div>
            </div>
            <motion.div
              animate={{ rotate: expandedSections.summary ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ApperIcon name="ChevronDown" className="w-5 h-5 text-gray-400" />
            </motion.div>
          </div>

          <motion.div
            initial={false}
            animate={{ 
              height: expandedSections.summary ? 'auto' : 0,
              opacity: expandedSections.summary ? 1 : 0
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4">
              <div className="space-y-3">
                {summaryPoints.map((point, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-3"
                  >
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-primary">{index + 1}</span>
                    </div>
                    <p className="text-gray-700 break-words">{point.replace('• ', '')}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </Card>

      {/* Original Notes */}
      <Card className="bg-white">
        <div 
          className="flex items-center justify-between p-4 border-b border-gray-100 cursor-pointer"
          onClick={() => toggleSection('original')}
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="FileText" className="w-4 h-4 text-secondary" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Original Notes</h3>
              <p className="text-sm text-gray-600">{note.content.length} characters</p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: expandedSections.original ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ApperIcon name="ChevronDown" className="w-5 h-5 text-gray-400" />
          </motion.div>
        </div>

        <motion.div
          initial={false}
          animate={{ 
            height: expandedSections.original ? 'auto' : 0,
            opacity: expandedSections.original ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="p-4">
            <div className="bg-surface rounded-lg p-4">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans break-words">
                {note.content}
              </pre>
            </div>
          </div>
        </motion.div>
      </Card>

      {/* Study Statistics */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
        <div className="p-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="BarChart3" className="w-4 h-4 text-accent" />
            </div>
            <h3 className="font-semibold text-gray-900">Study Stats</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{note.keyPoints.length}</div>
              <div className="text-sm text-gray-600">Key Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">
                {note.keyPoints.filter(p => p.importance === 'high').length}
              </div>
              <div className="text-sm text-gray-600">High Priority</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">
                {Math.ceil(note.content.split(' ').length / 200)}
              </div>
              <div className="text-sm text-gray-600">Min Read Time</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SummaryDisplay;