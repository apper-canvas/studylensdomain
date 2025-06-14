import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import TextArea from '@/components/atoms/TextArea';
import NoteHistory from '@/components/molecules/NoteHistory';

const NoteInput = ({ onSubmit, loading, existingNotes = [], onSelectNote }) => {
  const [content, setContent] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content);
      setContent('');
    }
  };

  const handlePaste = (e) => {
    // Auto-detect paste and show helpful feedback
    setTimeout(() => {
      if (e.target.value.length > 50) {
        // Show processing hint for larger content
      }
    }, 100);
  };

  const sampleNote = `Photosynthesis Overview:
Photosynthesis is the process by which plants convert light energy into chemical energy.

Key Components:
• Chlorophyll - green pigment that captures light
• Carbon dioxide - from atmosphere  
• Water - absorbed by roots
• Sunlight - energy source

Chemical Equation:
6CO2 + 6H2O + light energy → C6H12O6 + 6O2

Two Main Stages:
1. Light-dependent reactions (occur in thylakoids)
2. Light-independent reactions (Calvin cycle in stroma)

Importance:
- Produces oxygen for atmosphere
- Forms base of food chain
- Removes CO2 from atmosphere`;

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 flex flex-col"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Input Your Notes</h2>
            <p className="text-gray-600 text-sm">Paste or type your class notes to get started</p>
          </div>
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setContent(sampleNote)}
              className="text-sm text-primary hover:text-secondary transition-colors flex items-center space-x-1"
            >
              <ApperIcon name="Sparkles" className="w-4 h-4" />
              <span>Try Sample</span>
            </motion.button>
            {existingNotes.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowHistory(!showHistory)}
                className="text-sm text-gray-600 hover:text-primary transition-colors flex items-center space-x-1"
              >
                <ApperIcon name="History" className="w-4 h-4" />
                <span>History ({existingNotes.length})</span>
              </motion.button>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          <div className="flex-1 mb-4">
            <TextArea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onPaste={handlePaste}
              placeholder="Paste your notes here or start typing...&#10;&#10;Tip: Include key terms, definitions, and important concepts for better flashcard generation!"
              className="h-full min-h-[400px] resize-none"
              disabled={loading}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>{content.length} characters</span>
              {content.length > 0 && (
                <span className="flex items-center space-x-1">
                  <ApperIcon name="Zap" className="w-4 h-4 text-accent" />
                  <span>AI will analyze your notes</span>
                </span>
              )}
            </div>
            <Button
              type="submit"
              disabled={!content.trim() || loading}
              loading={loading}
              className="px-6 py-3"
            >
              {loading ? 'Processing...' : 'Generate Study Materials'}
            </Button>
          </div>
        </form>
      </motion.div>

      {showHistory && existingNotes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="w-full lg:w-80 flex-shrink-0"
        >
          <NoteHistory
            notes={existingNotes}
            onSelectNote={(note) => {
              onSelectNote(note);
              setShowHistory(false);
            }}
            onClose={() => setShowHistory(false)}
          />
        </motion.div>
      )}
    </div>
  );
};

export default NoteInput;