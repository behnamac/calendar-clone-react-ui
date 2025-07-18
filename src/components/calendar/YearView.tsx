import React from "react";
import { useEventManagement } from "../../hooks/useEventManagement";
import { useCalendarNavigation } from "../../hooks/useCalendarNavigation";
import { CalendarEvent } from "../../types/calendar";

const YearView: React.FC = () => {
  const { events, getEventsForDate, openEventModal } = useEventManagement();
  const { currentDate, navigateToMonth } = useCalendarNavigation();

  const currentYear = currentDate.getFullYear();

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isCurrentMonth = (month: number) => {
    return month === currentDate.getMonth();
  };

  const handleDateClick = (month: number, day: number) => {
    const clickedDate = new Date(currentYear, month, day);
    navigateToMonth(month, currentYear);
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
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const daysInMonth = getDaysInMonth(currentYear, month);
    const firstDayOfMonth = getFirstDayOfMonth(currentYear, month);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-6" />);
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
            h-6 w-6 flex items-center justify-center text-xs cursor-pointer rounded
            hover:bg-calendar-hover transition-colors relative
            ${
              isToday(date)
                ? "bg-calendar-primary text-white font-semibold"
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
        className="bg-background border border-calendar-border rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => handleMonthClick(month)}
      >
        <h3
          className={`
          text-sm font-semibold mb-2 text-center transition-colors
          ${isCurrentMonth(month) ? "text-calendar-primary" : "text-foreground"}
        `}
        >
          {monthNames[month]}
        </h3>
        <div className="grid grid-cols-7 gap-0.5">
          {/* Day headers */}
          {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
            <div
              key={day}
              className="h-5 flex items-center justify-center text-xs font-medium text-muted-foreground"
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
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 12 }, (_, month) => renderMonth(month))}
      </div>
    </div>
  );
};

export default YearView;
