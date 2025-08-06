import React from "react";
import { useEventManagement } from "../../hooks/useEventManagement";
import { useCalendarNavigation } from "../../hooks/useCalendarNavigation";
import { useLocalization } from "../../hooks/useLocalization";
import { isToday } from "../../utils/dateUtils";
import EventCard from "./EventCard";

const DayView: React.FC = () => {
  const { localization } = useLocalization();
  const { currentDate } = useCalendarNavigation();
  const { events, getEventsForDate, openEventModal } = useEventManagement();

  const dayEvents = getEventsForDate(currentDate);
  const isTodayDate = isToday(currentDate);

  // Generate time slots for the day (6 AM to 10 PM)
  const timeSlots = [];
  for (let hour = 6; hour <= 22; hour++) {
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
    return hour === 12 ? "12 PM" : hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Day header */}
      <div className="border-b border-calendar-border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">
              {currentDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </h2>
            <p className="text-muted-foreground">
              {dayEvents.length}{" "}
              {dayEvents.length !== 1
                ? localization?.calendar.dayView.eventsTodayPlural
                : localization?.calendar.dayView.eventsToday}
            </p>
          </div>
          <button
            onClick={handleDateClick}
            className="px-4 py-2 bg-calendar-primary dark:text-gray-800 text-white rounded-md hover:bg-calendar-primary/90"
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
              <div className="w-20 p-2 text-sm text-muted-foreground border-r border-calendar-border bg-muted/20">
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

              // Position from top (6 AM = 0, 7 AM = 60px, etc.)
              const topPosition = (startHour - 6) * 60; // 60px per hour
              const height = Math.max(duration * 60, 30); // Minimum 30px height

              return (
                <div
                  key={event.id}
                  className="absolute left-20 right-0 mx-2 cursor-pointer"
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
