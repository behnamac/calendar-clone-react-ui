import React from "react";
import { useEventManagement } from "@/hooks/useEventManagement";
import { useCalendarNavigation } from "@/hooks/useCalendarNavigation";
import { useLocalization } from "@/hooks/useLocalization";
import { useCalendar } from "@/contexts/CalendarContext";
import { CalendarEvent } from "@/types/calendar";
import { isToday } from "@/utils/dateUtils";

const YearView: React.FC = () => {
  const { localization } = useLocalization();
  const { events, getEventsForDate, openEventModal } = useEventManagement();
  const { currentDate, navigateToMonth, navigateToDate, setView } =
    useCalendarNavigation();
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
    navigateToMonth(month, currentYear);
  };

  const getEventColor = (events: CalendarEvent[]) => {
    if (events.length === 0) return null;
    // Return the color of the first event, or a default color
    return events[0].color || "blue";
  };

  const renderMonth = (month: number) => {
    const monthNames = [
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

    const daysInMonth = getDaysInMonth(currentYear, month);
    const firstDayOfMonth = getFirstDayOfMonth(currentYear, month);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-5 lg:h-6" />);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, month, day);
      const dayEvents = getEventsForDate(date);
      const hasEvents = dayEvents.length > 0;
      const eventColor = getEventColor(dayEvents);

      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(month, day)}
          className={`
            h-5 w-5 lg:h-6 lg:w-6 flex items-center justify-center text-xs cursor-pointer rounded
            hover:bg-calendar-hover transition-colors relative
            ${
              isToday(date)
                ? "bg-calendar-primary dark:text-gray-800 text-white font-semibold"
                : ""
            }
            ${
              isCurrentMonth(month)
                ? "text-foreground"
                : "text-muted-foreground"
            }
          `}
        >
          {day}
          {hasEvents && (
            <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2">
              <div
                className={`w-1 h-1 rounded-full ${
                  eventColor === "blue"
                    ? "bg-event-blue"
                    : eventColor === "green"
                    ? "bg-event-green"
                    : eventColor === "red"
                    ? "bg-event-red"
                    : eventColor === "purple"
                    ? "bg-event-purple"
                    : eventColor === "orange"
                    ? "bg-event-orange"
                    : "bg-calendar-primary"
                }`}
              ></div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div
        key={month}
        className="bg-background border border-calendar-border rounded-lg p-2 lg:p-3 hover:shadow-md transition-shadow cursor-pointer min-h-[200px] lg:min-h-[220px]"
        onClick={() => handleMonthClick(month)}
      >
        <h3
          className={`
          text-xs lg:text-sm font-semibold mb-2 text-center transition-colors
          ${isCurrentMonth(month) ? "text-calendar-primary" : "text-foreground"}
        `}
        >
          {monthNames[month]}
        </h3>
        <div className="grid grid-cols-7 gap-0.5">
          {/* Day headers */}
          {(
            localization?.calendar.weekDays.veryShort || [
              "S",
              "M",
              "T",
              "W",
              "T",
              "F",
              "S",
            ]
          ).map((day) => (
            <div
              key={day}
              className="h-4 lg:h-5 flex items-center justify-center text-xs font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
          {/* Calendar days */}
          {days}
        </div>
      </div>
    );
  };

  return (
    <div className="p-3 lg:p-6 h-full overflow-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
        {Array.from({ length: 12 }, (_, month) => renderMonth(month))}
      </div>
    </div>
  );
};

export default YearView;
