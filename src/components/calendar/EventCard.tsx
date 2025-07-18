import React from 'react';
import { CalendarEvent } from '../../types/calendar';
import { formatTime } from '../../utils/dateUtils';

interface EventCardProps {
  event: CalendarEvent;
  isCompact?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, isCompact = false, onClick }) => {
  const getEventColorClasses = (color: CalendarEvent['color']) => {
    const colorMap = {
      blue: 'bg-event-blue text-white',
      green: 'bg-event-green text-white',
      red: 'bg-event-red text-white',
      purple: 'bg-event-purple text-white',
      orange: 'bg-event-orange text-white'
    };
    return colorMap[color] || colorMap.blue;
  };

  if (isCompact) {
    return (
      <div
        className={`
          px-2 py-1 rounded text-xs font-medium cursor-pointer
          transition-all duration-200 hover:shadow-event
          ${getEventColorClasses(event.color)}
        `}
        onClick={onClick}
        title={`${event.title}${event.description ? ` - ${event.description}` : ''}`}
      >
        <div className="truncate">
          {!event.allDay && (
            <span className="opacity-90 mr-1">
              {formatTime(event.startDate)}
            </span>
          )}
          {event.title}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        p-3 rounded-lg cursor-pointer shadow-calendar
        transition-all duration-200 hover:shadow-event hover:scale-[1.02]
        ${getEventColorClasses(event.color)}
      `}
      onClick={onClick}
    >
      <div className="font-medium text-sm mb-1">{event.title}</div>
      
      {!event.allDay && (
        <div className="text-xs opacity-90 mb-1">
          {formatTime(event.startDate)} - {formatTime(event.endDate)}
        </div>
      )}
      
      {event.allDay && (
        <div className="text-xs opacity-90 mb-1">
          All day
        </div>
      )}
      
      {event.description && (
        <div className="text-xs opacity-80 line-clamp-2">
          {event.description}
        </div>
      )}
    </div>
  );
};

export default EventCard;