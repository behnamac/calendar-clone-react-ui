import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { useCalendar } from '../../contexts/CalendarContext';
import { CalendarView } from '../../types/calendar';

const CalendarHeader: React.FC = () => {
  const { state, dispatch } = useCalendar();
  const { currentDate, currentView } = state;

  const formatHeaderDate = () => {
    switch (currentView) {
      case 'month':
        return currentDate.toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric'
        });
      case 'week':
        const weekStart = new Date(currentDate);
        weekStart.setDate(currentDate.getDate() - currentDate.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        return `${weekStart.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        })} - ${weekEnd.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })}`;
      case 'day':
        return currentDate.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        });
      default:
        return '';
    }
  };

  const handleViewChange = (view: CalendarView) => {
    dispatch({ type: 'SET_VIEW', payload: view });
  };

  const handlePrevious = () => {
    dispatch({ type: 'NAVIGATE_PREVIOUS' });
  };

  const handleNext = () => {
    dispatch({ type: 'NAVIGATE_NEXT' });
  };

  const handleToday = () => {
    dispatch({ type: 'NAVIGATE_TO_TODAY' });
  };

  const handleCreateEvent = () => {
    dispatch({ type: 'OPEN_EVENT_MODAL' });
  };

  return (
    <div className="flex items-center justify-between py-4 px-6 border-b border-calendar-border bg-background">
      {/* Left section - Logo and navigation */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-6 w-6 text-calendar-primary" />
          <h1 className="text-xl font-semibold text-foreground">Calendar</h1>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={handleToday}
            className="text-sm font-medium"
          >
            Today
          </Button>
          
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevious}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNext}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <h2 className="text-2xl font-semibold text-foreground">
          {formatHeaderDate()}
        </h2>
      </div>

      {/* Right section - View toggles and create button */}
      <div className="flex items-center gap-4">
        <div className="flex items-center bg-muted rounded-lg p-1">
          {(['month', 'week', 'day'] as CalendarView[]).map((view) => (
            <Button
              key={view}
              variant={currentView === view ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => handleViewChange(view)}
              className={`px-4 py-2 text-sm font-medium capitalize transition-smooth ${
                currentView === view 
                  ? 'bg-background shadow-sm' 
                  : 'hover:bg-calendar-hover'
              }`}
            >
              {view}
            </Button>
          ))}
        </div>
        
        <Button
          onClick={handleCreateEvent}
          className="bg-calendar-primary hover:bg-calendar-primary-hover text-white font-medium"
        >
          Create Event
        </Button>
      </div>
    </div>
  );
};

export default CalendarHeader;