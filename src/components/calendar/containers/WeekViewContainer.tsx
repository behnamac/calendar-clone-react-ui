import React, { useState, useEffect } from "react";
import { useEventManagement } from "@/hooks/useEventManagement";
import { useCalendarNavigation } from "@/hooks/useCalendarNavigation";
import { useLocalization } from "@/hooks/useLocalization";
import { isToday } from "@/utils/dateUtils";
import WeekView from "../presentational/WeekView";
import { CalendarEvent } from "@/types/calendar";

const WeekViewContainer: React.FC = () => {
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

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    openEventModal(event);
  };

  // Prepare events data for each day
  const weekEventsData = weekDays.map((date, dayIndex) => {
    const dayEvents = getEventsForDate(date);

    return {
      date,
      dayIndex,
      events: dayEvents
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

          // Calculate left position for the specific day column
          const leftPosition = (dayIndex + 1) * (100 / 8); // +1 for time column

          return {
            ...event,
            topPosition,
            height,
            leftPosition,
            width: 100 / 8,
          };
        }),
      allDayEvents: dayEvents.filter((event) => event.allDay),
    };
  });

  return (
    <WeekView
      dayNames={dayNames}
      weekDays={weekDays}
      timeSlots={timeSlots}
      currentTimePosition={currentTimePosition}
      weekEventsData={weekEventsData}
      localization={localization}
      onDateClick={handleDateClick}
      onEventClick={handleEventClick}
      formatTime={formatTime}
    />
  );
};

export default WeekViewContainer;
