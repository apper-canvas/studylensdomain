import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { noteService, flashcardService, studySessionService } from '@/services';
import NoteInput from '@/components/organisms/NoteInput';
import SummaryDisplay from '@/components/organisms/SummaryDisplay';
import KeyPointsSidebar from '@/components/organisms/KeyPointsSidebar';
import FlashcardViewer from '@/components/organisms/FlashcardViewer';
import StudyProgress from '@/components/organisms/StudyProgress';
import ExportModal from '@/components/organisms/ExportModal';
import LoadingState from '@/components/molecules/LoadingState';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';
import ApperIcon from '@/components/ApperIcon';
const StudyDashboard = () => {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [studyMode, setStudyMode] = useState('input'); // input, summary, flashcards
  const [currentSession, setCurrentSession] = useState(null);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
useEffect(() => {
    loadInitialData();
    loadStreak();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      const notesData = await noteService.getAll();
      setNotes(notesData);
      if (notesData.length > 0) {
        setCurrentNote(notesData[0]);
        const flashcardsData = await flashcardService.getByNoteId(notesData[0].id);
        setFlashcards(flashcardsData);
      }
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load study materials');
    } finally {
      setLoading(false);
}
  };

  const loadStreak = async () => {
    try {
      const currentStreak = await studySessionService.getStreak();
      setStreak(currentStreak);
    } catch (err) {
      console.error('Failed to load streak:', err);
    }
  };
  const handleNoteSubmit = async (content) => {
    if (!content.trim()) {
      toast.error('Please enter some notes to analyze');
      return;
    }

    setLoading(true);
    try {
      // Create new note with AI processing
      const newNote = await noteService.create({ content });
      setNotes(prev => [newNote, ...prev]);
      setCurrentNote(newNote);
      
      // Generate flashcards from key points
      const generatedFlashcards = await flashcardService.generateFromKeyPoints(
        newNote.id, 
        newNote.keyPoints
      );
      setFlashcards(generatedFlashcards);
      
      // Switch to summary view
      setStudyMode('summary');
      toast.success('Notes processed successfully! 🎉');
    } catch (err) {
      toast.error(err.message || 'Failed to process notes');
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStartStudySession = async () => {
    if (flashcards.length === 0) {
      toast.error('No flashcards available for study');
      return;
    }

    try {
      const session = await studySessionService.create({
        cardsReviewed: 0,
        correctAnswers: 0
      });
      setCurrentSession(session);
      setStudyMode('flashcards');
      toast.success('Study session started! 📚');
    } catch (err) {
      toast.error('Failed to start study session');
    }
  };

  const handleFlashcardAnswer = async (flashcardId, correct) => {
    if (!currentSession) return;

    try {
      // Update flashcard mastery
      const flashcard = flashcards.find(f => f.id === flashcardId);
      if (flashcard) {
        const newMastery = correct 
          ? Math.min(1, flashcard.mastery + 0.2)
          : Math.max(0, flashcard.mastery - 0.1);
        
        await flashcardService.update(flashcardId, { mastery: newMastery });
        
        // Update local state
        setFlashcards(prev => prev.map(f => 
          f.id === flashcardId ? { ...f, mastery: newMastery } : f
        ));
      }

      // Update session stats
      const updatedSession = await studySessionService.update(currentSession.id, {
        cardsReviewed: currentSession.cardsReviewed + 1,
        correctAnswers: currentSession.correctAnswers + (correct ? 1 : 0)
      });
      setCurrentSession(updatedSession);

      if (correct) {
        toast.success('Correct! 🎉', { autoClose: 1000 });
      } else {
        toast.error('Keep studying! 📖', { autoClose: 1000 });
      }
    } catch (err) {
      toast.error('Failed to update progress');
    }
  };

  const handleEndSession = async () => {
    if (!currentSession) return;

    try {
      await studySessionService.endSession(currentSession.id);
      setCurrentSession(null);
      setStudyMode('summary');
      toast.success(`Session complete! You got ${currentSession.correctAnswers}/${currentSession.cardsReviewed} correct! 🎯`);
    } catch (err) {
      toast.error('Failed to end session');
    }
  };

const ModeSelector = () => (
    <div className="flex bg-surface rounded-lg p-1 mb-6">
      {[
        { id: 'input', label: 'Input Notes', icon: 'PenTool' },
        { id: 'summary', label: 'Summary', icon: 'FileText' },
        { id: 'flashcards', label: 'Study Cards', icon: 'Brain' }
      ].map((mode) => (
        <motion.button
          key={mode.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setStudyMode(mode.id)}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all ${
            studyMode === mode.id
              ? 'bg-primary text-white shadow-sm'
              : 'text-gray-600 hover:text-primary'
          }`}
        >
          <ApperIcon name={mode.icon} className="w-4 h-4" />
          <span className="text-sm font-medium">{mode.label}</span>
        </motion.button>
      ))}
    </div>
  );

  if (loading && !currentNote) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingState message="Loading your study materials..." />
      </div>
    );
  }

  if (error && !currentNote) {
    return (
      <div className="h-full flex items-center justify-center">
        <ErrorState 
          message={error}
          onRetry={loadInitialData}
        />
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden">
      <div className="max-w-7xl mx-auto p-6 h-full flex flex-col">
        <ModeSelector />
        
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {studyMode === 'input' && (
              <motion.div
                key="input"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="h-full"
              >
                {notes.length === 0 ? (
                  <EmptyState
                    icon="BookOpen"
                    title="Ready to Transform Your Notes?"
                    description="Paste your class notes and watch them become organized study materials with AI-powered summaries and flashcards."
                    actionLabel="Start with Sample Notes"
                    onAction={() => handleNoteSubmit("Photosynthesis is the process by which plants convert light energy into chemical energy using chlorophyll and sunlight.")}
                  />
                ) : (
                  <NoteInput 
                    onSubmit={handleNoteSubmit}
                    loading={loading}
                    existingNotes={notes}
                    onSelectNote={setCurrentNote}
                  />
                )}
              </motion.div>
            )}

            {studyMode === 'summary' && currentNote && (
              <motion.div
                key="summary"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="h-full grid grid-cols-1 lg:grid-cols-4 gap-6"
              >
                <div className="lg:col-span-3">
                  <SummaryDisplay 
                    note={currentNote}
                    onStartStudy={handleStartStudySession}
                    onExport={() => setShowExportModal(true)}
                  />
                </div>
                <div className="lg:col-span-1">
                  <KeyPointsSidebar 
                    keyPoints={currentNote.keyPoints}
                    onPointUpdate={(pointId, updates) => {
                      const updatedKeyPoints = currentNote.keyPoints.map(point =>
                        point.id === pointId ? { ...point, ...updates } : point
                      );
                      setCurrentNote(prev => ({ ...prev, keyPoints: updatedKeyPoints }));
                    }}
                  />
                </div>
              </motion.div>
            )}

            {studyMode === 'flashcards' && (
              <motion.div
                key="flashcards"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="h-full"
              >
                {flashcards.length === 0 ? (
                  <EmptyState
                    icon="Brain"
                    title="No Flashcards Available"
                    description="Create some notes first to generate flashcards for studying."
                    actionLabel="Go to Note Input"
                    onAction={() => setStudyMode('input')}
                  />
                ) : (
                  <div className="h-full grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-3">
                      <FlashcardViewer
                        flashcards={flashcards}
                        onAnswer={handleFlashcardAnswer}
                        onEndSession={handleEndSession}
                        session={currentSession}
                      />
                    </div>
<div className="lg:col-span-1">
                      <StudyProgress
                        session={currentSession}
                        flashcards={flashcards}
                        onEndSession={handleEndSession}
                        streak={streak}
                        onStreakUpdate={loadStreak}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {showExportModal && (
          <ExportModal
            isOpen={showExportModal}
            onClose={() => setShowExportModal(false)}
            note={currentNote}
            flashcards={flashcards}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudyDashboard;