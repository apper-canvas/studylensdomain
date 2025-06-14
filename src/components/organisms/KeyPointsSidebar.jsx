import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';

const KeyPointsSidebar = ({ keyPoints = [], onPointUpdate }) => {
  const getImportanceColor = (importance) => {
    switch (importance) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getImportanceIcon = (importance) => {
    switch (importance) {
      case 'high': return 'AlertTriangle';
      case 'medium': return 'AlertCircle';
      case 'low': return 'Info';
      default: return 'Circle';
    }
  };

  const toggleHighlight = (pointId, currentHighlighted) => {
    onPointUpdate(pointId, { highlighted: !currentHighlighted });
  };

  return (
    <div className="h-full overflow-y-auto">
      <Card className="bg-white h-full">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Target" className="w-4 h-4 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Key Points</h3>
              <p className="text-sm text-gray-600">{keyPoints.length} identified</p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {keyPoints.length === 0 ? (
            <div className="text-center py-8">
              <ApperIcon name="Search" className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No key points identified yet</p>
            </div>
          ) : (
            keyPoints.map((point, index) => (
              <motion.div
                key={point.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-lg border-2 transition-all ${
                  point.highlighted 
                    ? 'border-accent bg-accent/5' 
                    : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <Badge 
                    variant="outline"
                    className={`text-xs ${getImportanceColor(point.importance)}`}
                  >
                    <ApperIcon 
                      name={getImportanceIcon(point.importance)} 
                      className="w-3 h-3 mr-1" 
                    />
                    {point.importance}
                  </Badge>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleHighlight(point.id, point.highlighted)}
                    className={`p-1 rounded transition-colors ${
                      point.highlighted
                        ? 'text-accent bg-accent/10'
                        : 'text-gray-400 hover:text-accent hover:bg-accent/10'
                    }`}
                  >
                    <ApperIcon name="Bookmark" className="w-4 h-4" />
                  </motion.button>
                </div>
                
                <p className="text-sm text-gray-700 break-words leading-relaxed">
                  {point.text}
                </p>
              </motion.div>
            ))
          )}
        </div>

        {keyPoints.length > 0 && (
          <div className="p-4 border-t border-gray-100 bg-surface">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">
                {keyPoints.filter(p => p.highlighted).length} highlighted
              </span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-xs text-gray-500">High</span>
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-xs text-gray-500">Med</span>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-500">Low</span>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default KeyPointsSidebar;