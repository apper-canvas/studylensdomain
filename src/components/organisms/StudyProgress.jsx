import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import CircularProgress from '@/components/atoms/CircularProgress';

const StudyProgress = ({ session, flashcards = [], onEndSession }) => {
  if (!session) {
    return (
      <Card className="h-full flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="Play" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Study?</h3>
          <p className="text-gray-600">Start a study session to track your progress.</p>
        </div>
      </Card>
    );
  }

  const accuracy = session.cardsReviewed > 0 
    ? Math.round((session.correctAnswers / session.cardsReviewed) * 100)
    : 0;

  const overallMastery = flashcards.length > 0
    ? Math.round((flashcards.reduce((sum, card) => sum + card.mastery, 0) / flashcards.length) * 100)
    : 0;

  const sessionDuration = new Date() - new Date(session.startTime);
  const minutes = Math.floor(sessionDuration / 60000);
  const seconds = Math.floor((sessionDuration % 60000) / 1000);

  return (
    <Card className="h-full bg-white">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
            <ApperIcon name="TrendingUp" className="w-4 h-4 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Study Progress</h3>
            <p className="text-sm text-gray-600">Current session stats</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Session Accuracy */}
        <div className="text-center">
          <CircularProgress 
            value={accuracy} 
            size={80}
            strokeWidth={6}
            className="mx-auto mb-2"
          />
          <div className="text-2xl font-bold text-gray-900">{accuracy}%</div>
          <div className="text-sm text-gray-600">Session Accuracy</div>
        </div>

        {/* Session Stats */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Clock" className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Duration</span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {minutes}m {seconds}s
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Cards" className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Cards Reviewed</span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {session.cardsReviewed}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ApperIcon name="CheckCircle" className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-600">Correct</span>
            </div>
            <span className="text-sm font-medium text-green-600">
              {session.correctAnswers}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ApperIcon name="XCircle" className="w-4 h-4 text-red-500" />
              <span className="text-sm text-gray-600">Incorrect</span>
            </div>
            <span className="text-sm font-medium text-red-600">
              {session.cardsReviewed - session.correctAnswers}
            </span>
          </div>
        </div>

        {/* Overall Mastery */}
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Mastery</span>
            <span className="text-sm font-bold text-primary">{overallMastery}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${overallMastery}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
            />
          </div>
        </div>

        {/* Mastery Breakdown */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700 mb-2">Card Mastery</div>
          {flashcards.slice(0, 5).map((card, index) => (
            <div key={card.id} className="flex items-center justify-between text-xs">
              <span className="text-gray-600 truncate max-w-[120px]">
                {card.question}
              </span>
              <div className="flex items-center space-x-2">
                <div className="w-12 bg-gray-200 rounded-full h-1">
                  <div 
                    className="bg-primary h-1 rounded-full"
                    style={{ width: `${card.mastery * 100}%` }}
                  />
                </div>
                <span className="text-gray-500 min-w-[30px]">
                  {Math.round(card.mastery * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="border-t border-gray-100 pt-4">
          <Button
            onClick={onEndSession}
            variant="outline"
            className="w-full"
          >
            End Session
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default StudyProgress;