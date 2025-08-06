import React from "react";
import { useEventManagement } from "@/hooks/useEventManagement";
import { useCalendarNavigation } from "@/hooks/useCalendarNavigation";
import { useLocalization } from "@/hooks/useLocalization";
import { useCurrentTime } from "@/hooks/useCurrentTime";
import { useTimeFormatting } from "@/hooks/useTimeFormatting";
import { useWeekEvents } from "@/hooks/useWeekEvents";
import WeekView from "@/components/calendar/presentational/WeekView";
import { CalendarEvent } from "@/types/calendar";

const WeekViewContainer: React.FC = () => {
  const { localization } = useLocalization();
  const { openEventModal } = useEventManagement();
  const { getCurrentTimePosition } = useCurrentTime();
  const { formatTime, generateTimeSlots } = useTimeFormatting();
  const { generateWeekDays, processWeekEventsData } = useWeekEvents();

  const dayNames = localization?.calendar.weekDays.short || [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];

  const currentTimePosition = getCurrentTimePosition();
  const weekDays = generateWeekDays();
  const timeSlots = generateTimeSlots();
  const weekEventsData = processWeekEventsData(weekDays);

  const handleDateClick = (date: Date) => {
    openEventModal();
  };

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    openEventModal(event);
  };

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
