import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';

const NoteHistory = ({ notes = [], onSelectNote, onClose }) => {
  return (
    <Card className="h-full bg-white">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">Previous Notes</h3>
          <p className="text-sm text-gray-600">{notes.length} saved notes</p>
        </div>
        <Button variant="ghost" onClick={onClose} className="p-2">
          <ApperIcon name="X" className="w-4 h-4" />
        </Button>
      </div>

      <div className="p-4 space-y-3 overflow-y-auto max-h-96">
        {notes.map((note, index) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelectNote(note)}
            className="p-3 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 cursor-pointer transition-all"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="text-sm font-medium text-gray-900">
                {format(new Date(note.createdAt), 'MMM dd, yyyy')}
              </div>
              <div className="text-xs text-gray-500">
                {note.keyPoints.length} points
              </div>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2 break-words">
              {note.content.substring(0, 80)}...
            </p>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-2">
                <ApperIcon name="BookOpen" className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-500">
                  {note.content.length} chars
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <ApperIcon name="Target" className="w-3 h-3 text-accent" />
                <span className="text-xs text-accent">
                  {note.keyPoints.filter(p => p.importance === 'high').length} high
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};

export default NoteHistory;