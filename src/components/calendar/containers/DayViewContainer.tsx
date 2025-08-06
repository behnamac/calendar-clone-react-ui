import React from "react";
import { useEventManagement } from "@/hooks/useEventManagement";
import { useCalendarNavigation } from "@/hooks/useCalendarNavigation";
import { useLocalization } from "@/hooks/useLocalization";
import { useCurrentTime } from "@/hooks/useCurrentTime";
import { useTimeFormatting } from "@/hooks/useTimeFormatting";
import { isToday } from "@/utils/dateUtils";
import DayView from "@/components/calendar/presentational/DayView";
import { CalendarEvent } from "@/types/calendar";

const DayViewContainer: React.FC = () => {
  const { localization } = useLocalization();
  const { currentDate } = useCalendarNavigation();
  const { getEventsForDate, openEventModal } = useEventManagement();
  const { getCurrentTimePosition } = useCurrentTime();
  const { formatTime, generateTimeSlots } = useTimeFormatting();

  const dayEvents = getEventsForDate(currentDate);
  const isTodayDate = isToday(currentDate);
  const currentTimePosition = getCurrentTimePosition(isTodayDate);
  const timeSlots = generateTimeSlots();

  const handleDateClick = () => {
    openEventModal();
  };

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    openEventModal(event);
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
