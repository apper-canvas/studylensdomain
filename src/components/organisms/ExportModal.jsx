import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Modal from '@/components/molecules/Modal';

const ExportModal = ({ isOpen, onClose, note, flashcards = [] }) => {
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [selectedContent, setSelectedContent] = useState(['summary', 'keypoints', 'flashcards']);
  const [exporting, setExporting] = useState(false);

  const exportFormats = [
    { id: 'pdf', label: 'PDF Document', icon: 'FileText', description: 'Formatted document with styling' },
    { id: 'txt', label: 'Text File', icon: 'File', description: 'Plain text format' },
    { id: 'json', label: 'JSON Data', icon: 'Code', description: 'Raw data format' }
  ];

  const contentOptions = [
    { id: 'summary', label: 'AI Summary', icon: 'Sparkles' },
    { id: 'keypoints', label: 'Key Points', icon: 'Target' },
    { id: 'flashcards', label: 'Flashcards', icon: 'Brain' },
    { id: 'original', label: 'Original Notes', icon: 'FileText' }
  ];

  const handleContentToggle = (contentId) => {
    setSelectedContent(prev => 
      prev.includes(contentId)
        ? prev.filter(id => id !== contentId)
        : [...prev, contentId]
    );
  };

  const generateContent = () => {
    let content = '';
    
    if (selectedContent.includes('summary')) {
      content += `STUDY SUMMARY\n${'='.repeat(50)}\n\n`;
      content += note.summary.replace(/\n/g, '\n• ') + '\n\n';
    }
    
    if (selectedContent.includes('keypoints')) {
      content += `KEY POINTS\n${'='.repeat(50)}\n\n`;
      note.keyPoints.forEach((point, index) => {
        content += `${index + 1}. ${point.text} [${point.importance.toUpperCase()}]\n`;
      });
      content += '\n';
    }
    
    if (selectedContent.includes('flashcards')) {
      content += `FLASHCARDS\n${'='.repeat(50)}\n\n`;
      flashcards.forEach((card, index) => {
        content += `Card ${index + 1}:\n`;
        content += `Q: ${card.question}\n`;
        content += `A: ${card.answer}\n`;
        content += `Mastery: ${Math.round(card.mastery * 100)}%\n\n`;
      });
    }
    
    if (selectedContent.includes('original')) {
      content += `ORIGINAL NOTES\n${'='.repeat(50)}\n\n`;
      content += note.content + '\n\n';
    }
    
    return content;
  };

  const handleExport = async () => {
    if (selectedContent.length === 0) {
      toast.error('Please select at least one content type to export');
      return;
    }

    setExporting(true);
    
    try {
      const content = generateContent();
      const filename = `study-materials-${new Date().toISOString().split('T')[0]}`;
      
      if (selectedFormat === 'txt') {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.txt`;
        a.click();
        URL.revokeObjectURL(url);
      } else if (selectedFormat === 'json') {
        const data = {
          note: selectedContent.includes('original') ? note : null,
          summary: selectedContent.includes('summary') ? note.summary : null,
          keyPoints: selectedContent.includes('keypoints') ? note.keyPoints : null,
          flashcards: selectedContent.includes('flashcards') ? flashcards : null,
          exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } else if (selectedFormat === 'pdf') {
        // Simple PDF export - in a real app, you'd use a proper PDF library
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        toast.info('PDF export converted to text format for this demo');
      }
      
      toast.success('Study materials exported successfully! 📄');
      onClose();
    } catch (error) {
      toast.error('Failed to export study materials');
    } finally {
      setExporting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export Study Materials">
      <div className="space-y-6">
        {/* Format Selection */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Export Format</h3>
          <div className="space-y-2">
            {exportFormats.map((format) => (
              <motion.div
                key={format.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-3 border rounded-lg cursor-pointer transition-all ${
                  selectedFormat === format.id
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedFormat(format.id)}
              >
                <div className="flex items-center space-x-3">
                  <ApperIcon name={format.icon} className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{format.label}</div>
                    <div className="text-sm text-gray-600">{format.description}</div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedFormat === format.id
                      ? 'border-primary bg-primary'
                      : 'border-gray-300'
                  }`}>
                    {selectedFormat === format.id && (
                      <div className="w-full h-full rounded-full bg-primary flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Content Selection */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Content to Include</h3>
          <div className="space-y-2">
            {contentOptions.map((option) => (
              <motion.div
                key={option.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-3 border rounded-lg cursor-pointer transition-all ${
                  selectedContent.includes(option.id)
                    ? 'border-accent bg-accent/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleContentToggle(option.id)}
              >
                <div className="flex items-center space-x-3">
                  <ApperIcon name={option.icon} className="w-5 h-5 text-accent" />
                  <div className="flex-1 font-medium text-gray-900">{option.label}</div>
                  <div className={`w-4 h-4 rounded border ${
                    selectedContent.includes(option.id)
                      ? 'border-accent bg-accent'
                      : 'border-gray-300'
                  }`}>
                    {selectedContent.includes(option.id) && (
                      <ApperIcon name="Check" className="w-3 h-3 text-white" />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Preview */}
        {selectedContent.length > 0 && (
          <div className="border rounded-lg p-4 bg-surface">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Export Preview</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div>Format: {exportFormats.find(f => f.id === selectedFormat)?.label}</div>
              <div>Content: {selectedContent.length} section(s)</div>
              <div>Estimated size: ~{Math.round(generateContent().length / 1024)} KB</div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={selectedContent.length === 0 || exporting}
            loading={exporting}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="Download" className="w-4 h-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ExportModal;