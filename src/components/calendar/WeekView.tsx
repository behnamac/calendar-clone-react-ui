import React from "react";
import { useEventManagement } from "../../hooks/useEventManagement";
import { useCalendarNavigation } from "../../hooks/useCalendarNavigation";
import { isToday } from "../../utils/dateUtils";
import EventCard from "./EventCard";

const WeekView: React.FC = () => {
  const { currentDate, getCurrentWeekRange } = useCalendarNavigation();
  const { events, getEventsForDate, openEventModal } = useEventManagement();

  const { startOfWeek, endOfWeek } = getCurrentWeekRange();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
      <div className="grid grid-cols-7 flex-1">
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
                      ? "bg-calendar-primary text-white"
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
