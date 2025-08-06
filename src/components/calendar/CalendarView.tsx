import React from "react";
import { useCalendarNavigation } from "@/hooks/useCalendarNavigation";
import YearView from "./YearView";
import MonthView from "./MonthView";
import WeekViewContainer from "./containers/WeekViewContainer";
import DayViewContainer from "./containers/DayViewContainer";

const CalendarView: React.FC = () => {
  const { currentView } = useCalendarNavigation();

  const renderView = () => {
    switch (currentView) {
      case "year":
        return <YearView />;
      case "month":
        return <MonthView />;
      case "week":
        return <WeekViewContainer />;
      case "day":
        return <DayViewContainer />;
      default:
        return <MonthView />;
    }
  };

  return <div className="flex-1 overflow-hidden">{renderView()}</div>;
};

export default CalendarView;
