import { useEventManagement } from "./useEventManagement";
import { useCalendarNavigation } from "./useCalendarNavigation";
import { CalendarEvent } from "../types/calendar";

interface WeekEventData extends CalendarEvent {
  topPosition: number;
  height: number;
  leftPosition: number;
  width: number;
}

interface WeekDayData {
  date: Date;
  dayIndex: number;
  events: WeekEventData[];
  allDayEvents: CalendarEvent[];
}

export const useWeekEvents = () => {
  const { getEventsForDate } = useEventManagement();
  const { getCurrentWeekRange } = useCalendarNavigation();

  const generateWeekDays = () => {
    const { startOfWeek, endOfWeek } = getCurrentWeekRange();
    const weekDays = [];
    const currentDay = new Date(startOfWeek);

    while (currentDay <= endOfWeek) {
      weekDays.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }

    return weekDays;
  };

  const processWeekEventsData = (weekDays: Date[]): WeekDayData[] => {
    return weekDays.map((date, dayIndex) => {
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
  };

  return {
    generateWeekDays,
    processWeekEventsData,
  };
};
