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

  // Generate time slots for the full day (12 AM to 11 PM)
  const timeSlots = [];
  for (let hour = 0; hour <= 23; hour++) {
    timeSlots.push(hour);
  }

  const formatTime = (hour: number) => {
    if (hour === 0) return "12 AM";
    if (hour === 12) return "12 PM";
    if (hour > 12) return `${hour - 12} PM`;
    return `${hour} AM`;
  };

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
      <div className="grid grid-cols-8 border-b border-calendar-border">
        {/* Time column header */}
        <div className="py-2 lg:py-3 px-2 lg:px-4 text-center text-xs lg:text-sm font-medium text-muted-foreground bg-muted/30 border-r border-calendar-border">
          Time
        </div>

        {/* Day headers */}
        {dayNames.map((day, index) => (
          <div
            key={day}
            className="py-2 lg:py-3 px-1 lg:px-4 text-center text-xs lg:text-sm font-medium text-muted-foreground bg-muted/30"
          >
            <div className="hidden sm:block">{day}</div>
            <div className="sm:hidden">{day.charAt(0)}</div>
            <div className="text-xs text-muted-foreground">
              {weekDays[index]?.getDate()}
            </div>
          </div>
        ))}
      </div>

      {/* Week timeline */}
      <div className="flex-1 overflow-auto">
        <div className="relative">
          {/* Background time slots */}
          {timeSlots.map((hour) => (
            <div
              key={hour}
              className="grid grid-cols-8 border-b border-calendar-border min-h-[60px]"
            >
              {/* Time label */}
              <div className="p-1 lg:p-2 text-xs lg:text-sm text-muted-foreground border-r border-calendar-border bg-muted/20 flex items-center justify-center">
                {formatTime(hour)}
              </div>

              {/* Day columns */}
              {weekDays.map((date, dayIndex) => {
                const isTodayDate = isToday(date);
                return (
                  <div
                    key={dayIndex}
                    className={`
                      relative cursor-pointer transition-colors duration-200 hover:bg-calendar-hover
                      ${isTodayDate ? "bg-calendar-today/20" : "bg-background"}
                    `}
                    onClick={() => handleDateClick(date)}
                  >
                    {/* Click to add event */}
                    <div
                      className="absolute inset-0 cursor-pointer hover:bg-calendar-hover/50 transition-colors"
                      onClick={() => handleDateClick(date)}
                    />
                  </div>
                );
              })}
            </div>
          ))}

          {/* Current time indicator */}
          {currentTimePosition && (
            <div
              className="absolute left-0 right-0 z-10 pointer-events-none"
              style={{ top: `${currentTimePosition}px` }}
            >
              {/* Red line */}
              <div className="h-0.5 bg-red-500 w-full"></div>
              {/* Red circle on the left */}
              <div className="absolute -left-1 lg:-left-2 -top-1.5 w-2 h-2 lg:w-3 lg:h-3 bg-red-500 rounded-full"></div>
            </div>
          )}

          {/* Overlay events with proper positioning */}
          {weekDays.map((date, dayIndex) => {
            const dayEvents = getEventsForDate(date);

            return dayEvents
              .filter((event) => !event.allDay)
              .map((event) => {
                const eventStart = new Date(event.startDate);
                const eventEnd = new Date(event.endDate);

                // Calculate position and height
                const startHour =
                  eventStart.getHours() + eventStart.getMinutes() / 60;
                const endHour =
                  eventEnd.getHours() + eventEnd.getMinutes() / 60;
                const duration = endHour - startHour;

                // Position from top (12 AM = 0, 1 AM = 60px, etc.)
                const topPosition = startHour * 60; // 60px per hour
                const height = Math.max(duration * 60, 30); // Minimum 30px height

                // Calculate left position for the specific day column
                const leftPosition = (dayIndex + 1) * (100 / 8); // +1 for time column

                return (
                  <div
                    key={`${event.id}-${dayIndex}`}
                    className="absolute cursor-pointer"
                    style={{
                      top: `${topPosition}px`,
                      left: `${leftPosition}%`,
                      width: `${100 / 8}%`,
                      height: `${height}px`,
                    }}
                    onClick={(e) => handleEventClick(event, e)}
                  >
                    <EventCard
                      event={event}
                      isCompact={false}
                      onClick={(e) => handleEventClick(event, e)}
                    />
                  </div>
                );
              });
          })}
        </div>
      </div>

      {/* All day events */}
      {weekDays.some(
        (date) =>
          getEventsForDate(date).filter((event) => event.allDay).length > 0
      ) && (
        <div className="border-t border-calendar-border p-4 bg-muted/20">
          <h3 className="font-medium mb-2">
            {localization?.calendar.dayView.allDayEvents}
          </h3>
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((date, dayIndex) => {
              const dayEvents = getEventsForDate(date);
              const allDayEvents = dayEvents.filter((event) => event.allDay);

              return (
                <div key={dayIndex} className="space-y-1">
                  {allDayEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      isCompact={true}
                      onClick={(e) => handleEventClick(event, e)}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeekView;
