import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, parseISO, isSameDay } from 'date-fns';
import { toast } from 'react-toastify';
import studyCalendarService from '@/services/api/studyCalendarService';
import studySessionService from '@/services/api/studySessionService';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import LoadingState from '@/components/molecules/LoadingState';
import ErrorState from '@/components/molecules/ErrorState';

const StudyCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    loadCalendarData();
    loadStreak();
  }, [currentDate]);

  const loadCalendarData = async () => {
    setLoading(true);
    setError(null);
    try {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      
      const eventsData = await studyCalendarService.getByDateRange(
        format(monthStart, 'yyyy-MM-dd'),
        format(monthEnd, 'yyyy-MM-dd')
      );
      setEvents(eventsData);
    } catch (err) {
      setError(err.message || 'Failed to load calendar');
      toast.error('Failed to load calendar events');
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

  const handlePreviousMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const handleMarkCompleted = async (eventId) => {
    try {
      await studyCalendarService.markCompleted(eventId);
      setEvents(prev => prev.map(event =>
        event.Id === eventId ? { ...event, completed: true } : event
      ));
      toast.success('Study session completed! 🎉');
      loadStreak(); // Refresh streak after completion
    } catch (err) {
      toast.error('Failed to mark as completed');
    }
  };

  const handleReschedule = async (eventId, newDate) => {
    try {
      await studyCalendarService.reschedule(eventId, newDate);
      loadCalendarData();
      toast.success('Event rescheduled successfully');
    } catch (err) {
      toast.error('Failed to reschedule event');
    }
  };

  const getEventsForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return events.filter(event => event.date === dateStr);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  if (loading && events.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingState message="Loading your study calendar..." />
      </div>
    );
  }

  if (error && events.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <ErrorState 
          message={error}
          onRetry={loadCalendarData}
        />
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden">
      <div className="max-w-7xl mx-auto p-6 h-full flex flex-col">
        {/* Header with Streak Counter */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Study Calendar</h1>
            <p className="text-gray-600">Track your study schedule and maintain your streak</p>
          </div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-r from-primary to-secondary p-4 rounded-lg text-white"
          >
            <div className="flex items-center space-x-3">
              <ApperIcon name="Flame" className="w-6 h-6" />
              <div>
                <div className="text-2xl font-bold">{streak}</div>
                <div className="text-sm opacity-90">Day Streak</div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
          {/* Calendar Grid */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {format(currentDate, 'MMMM yyyy')}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={handlePreviousMonth}
                      variant="outline"
                      size="sm"
                    >
                      <ApperIcon name="ChevronLeft" className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={handleNextMonth}
                      variant="outline"
                      size="sm"
                    >
                      <ApperIcon name="ChevronRight" className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-4">
                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map(day => {
                    const dayEvents = getEventsForDate(day);
                    const isSelected = selectedDate && isSameDay(day, selectedDate);
                    
                    return (
                      <motion.button
                        key={day.toString()}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedDate(day)}
                        className={`
                          relative p-2 min-h-[80px] rounded-lg border transition-all
                          ${isToday(day) ? 'border-primary bg-primary/5' : 'border-gray-200'}
                          ${isSelected ? 'ring-2 ring-primary' : ''}
                          ${!isSameMonth(day, currentDate) ? 'text-gray-400' : 'text-gray-900'}
                          hover:bg-gray-50
                        `}
                      >
                        <div className="text-sm font-medium mb-1">
                          {format(day, 'd')}
                        </div>
                        
                        <div className="space-y-1">
                          {dayEvents.slice(0, 2).map(event => (
                            <div
                              key={event.Id}
                              className={`
                                w-full h-1.5 rounded-full
                                ${event.completed ? 'bg-green-500' : getPriorityColor(event.priority)}
                              `}
                            />
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-xs text-gray-500">
                              +{dayEvents.length - 2} more
                            </div>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </Card>
          </div>

          {/* Event Details Sidebar */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">
                  {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
                </h3>
              </div>

              <div className="p-4 space-y-4 overflow-y-auto">
                {selectedDate && selectedDateEvents.length > 0 ? (
                  selectedDateEvents.map(event => (
                    <motion.div
                      key={event.Id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-gray-200 rounded-lg p-3"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{event.title}</h4>
                        <Badge
                          variant={event.completed ? 'success' : event.priority === 'high' ? 'error' : 'default'}
                          size="sm"
                        >
                          {event.completed ? 'Done' : event.priority}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">
                        {event.cardCount} cards to review
                      </p>

                      <div className="flex space-x-2">
                        {!event.completed && (
                          <Button
                            onClick={() => handleMarkCompleted(event.Id)}
                            size="sm"
                            variant="primary"
                          >
                            <ApperIcon name="Check" className="w-3 h-3 mr-1" />
                            Complete
                          </Button>
                        )}
                        <Button
                          onClick={() => {
                            const newDate = prompt('Enter new date (YYYY-MM-DD):');
                            if (newDate) handleReschedule(event.Id, newDate);
                          }}
                          size="sm"
                          variant="outline"
                        >
                          <ApperIcon name="Calendar" className="w-3 h-3 mr-1" />
                          Reschedule
                        </Button>
                      </div>
                    </motion.div>
                  ))
                ) : selectedDate ? (
                  <div className="text-center text-gray-500 py-8">
                    <ApperIcon name="Calendar" className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No events scheduled for this date</p>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <ApperIcon name="Calendar" className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>Click on a date to view events</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyCalendar;