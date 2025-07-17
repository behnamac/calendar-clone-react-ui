import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import { useCalendarNavigation } from "../../hooks/useCalendarNavigation";
import { useEventManagement } from "../../hooks/useEventManagement";
import { CalendarView } from "../../types/calendar";

const CalendarHeader: React.FC = () => {
  const {
    currentDate,
    currentView,
    navigateToToday,
    navigatePrevious,
    navigateNext,
    setView,
    getCurrentMonthName,
    getCurrentWeekRange,
  } = useCalendarNavigation();

  const { openEventModal } = useEventManagement();

  const formatHeaderDate = () => {
    switch (currentView) {
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

  const handleViewChange = (view: CalendarView) => {
    setView(view);
  };

  const handleCreateEvent = () => {
    openEventModal();
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 px-6 border-b border-calendar-border bg-background gap-4">
      {/* Left section - Logo and navigation */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-6 w-6 text-calendar-primary" />
          <h1 className="text-xl font-semibold text-foreground">Calendar</h1>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={navigateToToday}
            className="text-sm font-medium"
          >
            Today
          </Button>

          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={navigatePrevious}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={navigateNext}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-foreground">
          {formatHeaderDate()}
        </h2>
      </div>

      {/* Right section - View toggles and create button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* View toggles - Side by side on desktop, stacked on mobile */}
        <div className="flex items-center bg-muted rounded-lg p-1 w-full sm:w-auto">
          {(["month", "week", "day"] as CalendarView[]).map((view) => (
            <Button
              key={view}
              variant={currentView === view ? "secondary" : "ghost"}
              size="sm"
              onClick={() => handleViewChange(view)}
              className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium capitalize transition-smooth ${
                currentView === view
                  ? "bg-background shadow-sm"
                  : "hover:bg-calendar-hover"
              }`}
            >
              {view}
            </Button>
          ))}
        </div>

        <Button
          onClick={handleCreateEvent}
          className="bg-calendar-primary hover:bg-calendar-primary-hover text-white font-medium w-full sm:w-auto"
        >
          Create Event
        </Button>
      </div>
    </div>
  );
};

export default CalendarHeader;
