import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import ProgressBar from '@/components/atoms/ProgressBar';

const FlashcardViewer = ({ flashcards = [], onAnswer, onEndSession, session }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const currentCard = flashcards[currentIndex];
  const progress = ((currentIndex + 1) / flashcards.length) * 100;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    setShowAnswer(!showAnswer);
  };

  const handleAnswer = (correct) => {
    if (currentCard && session) {
      onAnswer(currentCard.id, correct);
      
      // Move to next card or end session
      if (currentIndex < flashcards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setIsFlipped(false);
        setShowAnswer(false);
      } else {
        // Session complete
        onEndSession();
      }
    }
  };

  const goToNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      setShowAnswer(false);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
      setShowAnswer(false);
    }
  };

  const getMasteryColor = (mastery) => {
    if (mastery >= 0.8) return 'text-green-600 bg-green-100';
    if (mastery >= 0.5) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  if (!currentCard) {
    return (
      <Card className="h-full flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="Brain" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Flashcards Available</h3>
          <p className="text-gray-600">Generate some notes first to create flashcards.</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Progress Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Study Session</h2>
          <p className="text-sm text-gray-600">
            Card {currentIndex + 1} of {flashcards.length}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getMasteryColor(currentCard.mastery)}`}>
            {Math.round(currentCard.mastery * 100)}% mastery
          </div>
          <Button
            variant="outline"
            onClick={onEndSession}
            className="text-sm"
          >
            End Session
          </Button>
        </div>
      </div>

      <ProgressBar value={progress} className="w-full" />

      {/* Flashcard */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-2xl">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative h-80"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isFlipped ? 'answer' : 'question'}
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -90, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0"
              >
                <Card 
                  className={`h-full cursor-pointer transition-all duration-200 ${
                    isFlipped 
                      ? 'bg-gradient-to-br from-accent/5 to-secondary/5 border-accent/20' 
                      : 'bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20'
                  }`}
                  onClick={handleFlip}
                >
                  <div className="h-full flex flex-col justify-center items-center p-8 text-center">
                    <div className="mb-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        isFlipped ? 'bg-accent/20' : 'bg-primary/20'
                      }`}>
                        <ApperIcon 
                          name={isFlipped ? 'BookOpen' : 'HelpCircle'} 
                          className={`w-6 h-6 ${isFlipped ? 'text-accent' : 'text-primary'}`} 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className={`text-lg font-semibold ${
                        isFlipped ? 'text-accent' : 'text-primary'
                      }`}>
                        {isFlipped ? 'Answer' : 'Question'}
                      </h3>
                      
                      <p className="text-lg text-gray-800 max-w-lg break-words">
                        {isFlipped ? currentCard.answer : currentCard.question}
                      </p>
                    </div>
                    
                    <div className="mt-6 text-sm text-gray-500 flex items-center space-x-2">
                      <ApperIcon name={isFlipped ? 'Eye' : 'MousePointer'} className="w-4 h-4" />
                      <span>
                        {isFlipped ? 'Click to see question' : 'Click to reveal answer'}
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="ChevronLeft" className="w-4 h-4" />
            <span>Previous</span>
          </Button>
          
          <Button
            variant="outline"
            onClick={goToNext}
            disabled={currentIndex === flashcards.length - 1}
            className="flex items-center space-x-2"
          >
            <span>Next</span>
            <ApperIcon name="ChevronRight" className="w-4 h-4" />
          </Button>
        </div>

        {showAnswer && session && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center space-x-3"
          >
            <span className="text-sm text-gray-600">How did you do?</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAnswer(false)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Incorrect
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAnswer(true)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Correct
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FlashcardViewer;