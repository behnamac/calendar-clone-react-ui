import { useEventManagement } from "./useEventManagement";
import { useCalendarNavigation } from "./useCalendarNavigation";
import { useCalendar } from "../contexts/CalendarContext";
import { CalendarEvent } from "../types/calendar";
import { isToday } from "../utils/dateUtils";

export const useYearView = () => {
  const { getEventsForDate } = useEventManagement();
  const { currentDate } = useCalendarNavigation();
  const { actions } = useCalendar();

  const currentYear = currentDate.getFullYear();

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const isCurrentMonth = (month: number) => {
    return month === currentDate.getMonth();
  };

  const handleDateClick = (month: number, day: number) => {
    // Create the date properly, ensuring it's the exact day
    const clickedDate = new Date(currentYear, month, day, 12, 0, 0, 0); // Set to noon to avoid timezone issues

    // Set both view and date directly using actions
    actions.setView("day");
    actions.setCurrentDate(clickedDate);
  };

  const handleMonthClick = (month: number) => {
    const { navigateToMonth } = useCalendarNavigation();
    navigateToMonth(month, currentYear);
  };

  const getEventColor = (events: CalendarEvent[]) => {
    if (events.length === 0) return null;
    // Return the color of the first event, or a default color
    return events[0].color || "blue";
  };

  const getMonthNames = (localization: any) => [
    localization?.calendar.months.january || "January",
    localization?.calendar.months.february || "February",
    localization?.calendar.months.march || "March",
    localization?.calendar.months.april || "April",
    localization?.calendar.months.may || "May",
    localization?.calendar.months.june || "June",
    localization?.calendar.months.july || "July",
    localization?.calendar.months.august || "August",
    localization?.calendar.months.september || "September",
    localization?.calendar.months.october || "October",
    localization?.calendar.months.november || "November",
    localization?.calendar.months.december || "December",
  ];

  const generateMonthDays = (month: number) => {
    const daysInMonth = getDaysInMonth(currentYear, month);
    const firstDayOfMonth = getFirstDayOfMonth(currentYear, month);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ type: "empty", key: `empty-${i}` });
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, month, day);
      const dayEvents = getEventsForDate(date);
      const hasEvents = dayEvents.length > 0;
      const eventColor = getEventColor(dayEvents);

      days.push({
        type: "day",
        key: day,
        day,
        date,
        dayEvents,
        hasEvents,
        eventColor,
        isToday: isToday(date),
        isCurrentMonth: isCurrentMonth(month),
      });
    }

    return days;
  };

  return {
    currentYear,
    getDaysInMonth,
    getFirstDayOfMonth,
    isCurrentMonth,
    handleDateClick,
    handleMonthClick,
    getEventColor,
    getMonthNames,
    generateMonthDays,
  };
};
