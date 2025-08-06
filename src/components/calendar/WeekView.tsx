import React, { useState, useEffect } from "react";
import { useEventManagement } from "../../hooks/useEventManagement";
import { useCalendarNavigation } from "../../hooks/useCalendarNavigation";
import { useLocalization } from "../../hooks/useLocalization";
import { isToday } from "../../utils/dateUtils";
import EventCard from "./EventCard";

const WeekView: React.FC = () => {
  const { localization } = useLocalization();
  const { currentDate, getCurrentWeekRange } = useCalendarNavigation();
  const { events, getEventsForDate, openEventModal } = useEventManagement();
  const [currentTime, setCurrentTime] = useState(new Date());

  const { startOfWeek, endOfWeek } = getCurrentWeekRange();
  const dayNames = localization?.calendar.weekDays.short || [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Calculate current time position
  const getCurrentTimePosition = () => {
    const now = currentTime;
    const currentHour = now.getHours() + now.getMinutes() / 60;
    return currentHour * 60; // 60px per hour
  };

  const currentTimePosition = getCurrentTimePosition();

  // Generate week days
  const weekDays = [];
  const currentDay = new Date(startOfWeek);
  while (currentDay <= endOfWeek) {
    weekDays.push(new Date(currentDay));
    currentDay.setDate(currentDay.getDate() + 1);
  }

  const handleDateClick = (date: Date) => {
    openEventModal();
  };

  const handleEventClick = (event: any, e: React.MouseEvent) => {
    e.stopPropagation();
    openEventModal(event);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-calendar-border">
        {dayNames.map((day, index) => (
          <div
            key={day}
            className="py-3 px-4 text-center text-sm font-medium text-muted-foreground bg-muted/30"
          >
            <div>{day}</div>
            <div className="text-xs text-muted-foreground">
              {weekDays[index]?.getDate()}
            </div>
          </div>
        ))}
      </div>

      {/* Week grid */}
      <div className="grid grid-cols-7 flex-1 relative">
        {/* Current time indicator for today's column */}
        {currentTimePosition && (
          <div
            className="absolute z-10 pointer-events-none"
            style={{
              top: `${currentTimePosition}px`,
              left: `${weekDays.findIndex((day) => isToday(day)) * (100 / 7)}%`,
              width: `${100 / 7}%`,
            }}
          >
            {/* Red line */}
            <div className="h-0.5 bg-red-500 w-full"></div>
            {/* Red circle on the left */}
            <div className="absolute -left-1 -top-1.5 w-3 h-3 bg-red-500 rounded-full"></div>
          </div>
        )}

        {weekDays.map((date, index) => {
          const dayEvents = getEventsForDate(date);
          const isTodayDate = isToday(date);

          return (
            <div
              key={index}
              className={`
                border-r border-b border-calendar-border min-h-[200px] p-2 cursor-pointer
                transition-colors duration-200 hover:bg-calendar-hover
                ${isTodayDate ? "bg-calendar-today" : "bg-background"}
              `}
              onClick={() => handleDateClick(date)}
            >
              <div
                className={`
                  text-sm font-medium mb-2 w-8 h-8 flex items-center justify-center rounded-full
                  transition-colors duration-200
                  ${
                    isTodayDate
                      ? "bg-calendar-primary dark:text-gray-800 text-white"
                      : "text-foreground hover:bg-calendar-hover"
                  }
                `}
              >
                {date.getDate()}
              </div>

              {/* Events for this day */}
              <div className="space-y-1">
                {dayEvents.slice(0, 5).map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isCompact={true}
                    onClick={(e) => handleEventClick(event, e)}
                  />
                ))}

                {dayEvents.length > 5 && (
                  <div className="text-xs text-muted-foreground px-2 py-1">
                    +{dayEvents.length - 5} more
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

export default WeekView;
