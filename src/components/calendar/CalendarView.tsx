import React from "react";
import { useCalendarNavigation } from "../../hooks/useCalendarNavigation";
import YearView from "./YearView";
import MonthView from "./MonthView";
import WeekView from "./WeekView";
import DayView from "./DayView";

const CalendarView: React.FC = () => {
  const { currentView } = useCalendarNavigation();

  const renderView = () => {
    switch (currentView) {
      case "year":
        return <YearView />;
      case "month":
        return <MonthView />;
      case "week":
        return <WeekView />;
      case "day":
        return <DayView />;
      default:
        return <MonthView />;
    }
  };

  return <div className="flex-1 overflow-hidden">{renderView()}</div>;
};

export default CalendarView;
