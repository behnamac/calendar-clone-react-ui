import React, { useState, useEffect } from "react";
import { useEventManagement } from "@/hooks/useEventManagement";
import { useCalendarNavigation } from "@/hooks/useCalendarNavigation";
import { useLocalization } from "@/hooks/useLocalization";
import { isToday } from "@/utils/dateUtils";
import EventCard from "./EventCard";

const DayView: React.FC = () => {
  const { localization } = useLocalization();
  const { currentDate } = useCalendarNavigation();
  const { events, getEventsForDate, openEventModal } = useEventManagement();
  const [currentTime, setCurrentTime] = useState(new Date());

  const dayEvents = getEventsForDate(currentDate);
  const isTodayDate = isToday(currentDate);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Calculate current time position
  const getCurrentTimePosition = () => {
    if (!isTodayDate) return null;

    const now = currentTime;
    const currentHour = now.getHours() + now.getMinutes() / 60;
    return currentHour * 60; // 60px per hour
  };

  const currentTimePosition = getCurrentTimePosition();

  // Generate time slots for the full day (12 AM to 11 PM)
  const timeSlots = [];
  for (let hour = 0; hour <= 23; hour++) {
    timeSlots.push(hour);
  }

  const handleDateClick = () => {
    openEventModal();
  };

  const handleEventClick = (event: any, e: React.MouseEvent) => {
    e.stopPropagation();
    openEventModal(event);
  };

  const formatTime = (hour: number) => {
    if (hour === 0) return "12 AM";
    if (hour === 12) return "12 PM";
    if (hour > 12) return `${hour - 12} PM`;
    return `${hour} AM`;
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Day header */}
      <div className="border-b border-calendar-border p-3 lg:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg lg:text-2xl font-semibold">
              {currentDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </h2>
            <p className="text-sm lg:text-base text-muted-foreground">
              {dayEvents.length}{" "}
              {dayEvents.length !== 1
                ? localization?.calendar.dayView.eventsTodayPlural
                : localization?.calendar.dayView.eventsToday}
            </p>
          </div>
          <button
            onClick={handleDateClick}
            className="px-3 py-2 lg:px-4 lg:py-2 bg-calendar-primary dark:text-gray-800 text-white rounded-md hover:bg-calendar-primary/90 text-sm lg:text-base"
          >
            {localization?.calendar.actions.addEvent}
          </button>
        </div>
      </div>

      {/* Day timeline */}
      <div className="flex-1 overflow-auto">
        <div className="relative">
          {/* Background time slots */}
          {timeSlots.map((hour) => (
            <div
              key={hour}
              className="flex border-b border-calendar-border min-h-[60px]"
            >
              {/* Time label */}
              <div className="w-16 lg:w-20 p-2 text-xs lg:text-sm text-muted-foreground border-r border-calendar-border bg-muted/20 flex items-center justify-center">
                {formatTime(hour)}
              </div>

              {/* Time slot background */}
              <div className="flex-1 relative">
                {/* Click to add event */}
                <div
                  className="absolute inset-0 cursor-pointer hover:bg-calendar-hover/50 transition-colors"
                  onClick={handleDateClick}
                />
              </div>
            </div>
          ))}

          {/* Current time indicator */}
          {currentTimePosition !== null && (
            <div
              className="absolute left-16 lg:left-20 right-0 z-10 pointer-events-none"
              style={{ top: `${currentTimePosition}px` }}
            >
              {/* Red line */}
              <div className="h-0.5 bg-red-500 w-full"></div>
              {/* Red circle on the left */}
              <div className="absolute -left-1 lg:-left-2 -top-1.5 w-2 h-2 lg:w-3 lg:h-3 bg-red-500 rounded-full"></div>
            </div>
          )}

          {/* Overlay events with proper positioning */}
          {dayEvents
            .filter((event) => !event.allDay)
            .map((event) => {
              const eventStart = new Date(event.startDate);
              const eventEnd = new Date(event.endDate);

              // Calculate position and height
              const startHour =
                eventStart.getHours() + eventStart.getMinutes() / 60;
              const endHour = eventEnd.getHours() + eventEnd.getMinutes() / 60;
              const duration = endHour - startHour;

              // Position from top (12 AM = 0, 1 AM = 60px, etc.)
              const topPosition = startHour * 60; // 60px per hour
              const height = Math.max(duration * 60, 30); // Minimum 30px height

              return (
                <div
                  key={event.id}
                  className="absolute left-16 lg:left-20 right-0 mx-1 lg:mx-2 cursor-pointer"
                  style={{
                    top: `${topPosition}px`,
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
            })}
        </div>
      </div>

      {/* All day events */}
      {dayEvents.filter((event) => event.allDay).length > 0 && (
        <div className="border-t border-calendar-border p-4 bg-muted/20">
          <h3 className="font-medium mb-2">
            {localization?.calendar.dayView.allDayEvents}
          </h3>
          <div className="space-y-2">
            {dayEvents
              .filter((event) => event.allDay)
              .map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isCompact={true}
                  onClick={(e) => handleEventClick(event, e)}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DayView;
