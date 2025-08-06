import { useCalendarNavigation } from "./useCalendarNavigation";
import { CalendarView } from "../types/calendar";

export const useHeaderDate = () => {
  const {
    currentDate,
    currentView,
    getCurrentMonthName,
    getCurrentYear,
    getCurrentWeekRange,
  } = useCalendarNavigation();

  const formatHeaderDate = () => {
    switch (currentView) {
      case "year":
        return getCurrentYear();
      case "month":
        return getCurrentMonthName();
      case "week":
        const { startOfWeek, endOfWeek } = getCurrentWeekRange();
        return `${startOfWeek.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })} - ${endOfWeek.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}`;
      case "day":
        return currentDate.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        });
      default:
        return "";
    }
  };

  const getViewOptions = (localization: any) => [
    { value: "year" as CalendarView, label: localization?.calendar.views.year },
    {
      value: "month" as CalendarView,
      label: localization?.calendar.views.month,
    },
    { value: "week" as CalendarView, label: localization?.calendar.views.week },
    { value: "day" as CalendarView, label: localization?.calendar.views.day },
  ];

  return {
    formatHeaderDate,
    getViewOptions,
  };
};
