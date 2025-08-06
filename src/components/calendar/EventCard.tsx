import React from "react";
import { CalendarEvent } from "@/types/calendar";
import { formatTime } from "@/utils/dateUtils";
import { useLocalization } from "@/hooks/useLocalization";

interface EventCardProps {
  event: CalendarEvent;
  isCompact?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  isCompact = false,
  onClick,
}) => {
  const { localization } = useLocalization();
  const getEventColorClasses = (color: CalendarEvent["color"]) => {
    const colorMap = {
      blue: "bg-event-blue text-white",
      green: "bg-event-green text-white",
      red: "bg-event-red text-white",
      purple: "bg-event-purple text-white",
      orange: "bg-event-orange text-white",
    };
    return colorMap[color] || colorMap.blue;
  };

  if (isCompact) {
    return (
      <div
        className={`
          px-1 lg:px-2 py-0.5 lg:py-1 rounded text-xs font-medium cursor-pointer
          transition-all duration-200 hover:shadow-event
          ${getEventColorClasses(event.color)}
        `}
        onClick={onClick}
        title={`${event.title}${
          event.description ? ` - ${event.description}` : ""
        }`}
      >
        <div className="truncate">
          {!event.allDay && (
            <span className="opacity-90 mr-1 hidden sm:inline">
              {formatTime(event.startDate)}
            </span>
          )}
          <span className="truncate block">{event.title}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        h-full p-1 lg:p-2 rounded cursor-pointer shadow-calendar
        transition-all duration-200 hover:shadow-event hover:scale-[1.01]
        ${getEventColorClasses(event.color)}
        flex flex-col justify-start
      `}
      onClick={onClick}
    >
      <div className="font-medium text-xs lg:text-sm truncate">
        {event.title}
      </div>

      {!event.allDay && (
        <div className="text-xs opacity-90 truncate">
          <span className="hidden sm:inline">
            {formatTime(event.startDate)} - {formatTime(event.endDate)}
          </span>
          <span className="sm:hidden">{formatTime(event.startDate)}</span>
        </div>
      )}

      {event.allDay && (
        <div className="text-xs opacity-90">
          {localization?.calendar.eventCard.allDay}
        </div>
      )}

      {event.description && (
        <div className="text-xs opacity-80 line-clamp-1 mt-auto hidden sm:block">
          {event.description}
        </div>
      )}
    </div>
  );
};

export default EventCard;
