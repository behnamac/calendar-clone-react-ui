import React from 'react';
import { useCalendar } from '../../contexts/CalendarContext';
import { 
  getCalendarDays, 
  isDateInCurrentMonth, 
  isToday, 
  getEventsForDate 
} from '../../utils/dateUtils';
import EventCard from './EventCard';

const MonthView: React.FC = () => {
  const { state, dispatch } = useCalendar();
  const { currentDate, events } = state;
  
  const calendarDays = getCalendarDays(currentDate);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleDateClick = (date: Date) => {
    dispatch({ type: 'SET_SELECTED_DATE', payload: date });
    dispatch({ type: 'OPEN_EVENT_MODAL' });
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-calendar-border">
        {dayNames.map((day) => (
          <div
            key={day}
            className="py-3 px-4 text-center text-sm font-medium text-muted-foreground bg-muted/30"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 flex-1">
        {calendarDays.map((date, index) => {
          const dayEvents = getEventsForDate(events, date);
          const isCurrentMonth = isDateInCurrentMonth(date, currentDate);
          const isTodayDate = isToday(date);
          
          return (
            <div
              key={index}
              className={`
                border-r border-b border-calendar-border min-h-[120px] p-2 cursor-pointer
                transition-colors duration-200 hover:bg-calendar-hover
                ${!isCurrentMonth ? 'bg-muted/20' : 'bg-background'}
                ${isTodayDate ? 'bg-calendar-today' : ''}
              `}
              onClick={() => handleDateClick(date)}
            >
              <div
                className={`
                  text-sm font-medium mb-1 w-8 h-8 flex items-center justify-center rounded-full
                  transition-colors duration-200
                  ${!isCurrentMonth 
                    ? 'text-calendar-other-month' 
                    : isTodayDate 
                      ? 'bg-calendar-primary text-white' 
                      : 'text-foreground hover:bg-calendar-hover'
                  }
                `}
              >
                {date.getDate()}
              </div>
              
              {/* Events for this day */}
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isCompact={true}
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch({ type: 'OPEN_EVENT_MODAL', payload: event });
                    }}
                  />
                ))}
                
                {dayEvents.length > 3 && (
                  <div className="text-xs text-muted-foreground px-2 py-1">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthView;