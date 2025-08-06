import React, { useState, useEffect } from "react";
import { useEventManagement } from "@/hooks/useEventManagement";
import { useCalendarNavigation } from "@/hooks/useCalendarNavigation";
import { useLocalization } from "@/hooks/useLocalization";
import { isToday } from "@/utils/dateUtils";
import DayView from "../presentational/DayView";
import { CalendarEvent } from "@/types/calendar";

const DayViewContainer: React.FC = () => {
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

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
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
    <DayView
      currentDate={currentDate}
      dayEvents={dayEvents}
      isTodayDate={isTodayDate}
      currentTimePosition={currentTimePosition}
      timeSlots={timeSlots}
      localization={localization}
      onDateClick={handleDateClick}
      onEventClick={handleEventClick}
      formatTime={formatTime}
      allDayText={localization?.calendar.eventCard.allDay}
    />
  );
};

export default DayViewContainer;
