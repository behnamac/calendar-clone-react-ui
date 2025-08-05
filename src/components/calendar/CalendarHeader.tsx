import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../ui/select";
import { ThemeToggle } from "../ui/theme-toggle";
import { useCalendarNavigation } from "../../hooks/useCalendarNavigation";
import { useEventManagement } from "../../hooks/useEventManagement";
import { useLocalization } from "../../hooks/useLocalization";
import { CalendarView } from "../../types/calendar";

const CalendarHeader: React.FC = () => {
  const { localization } = useLocalization();
  const {
    currentDate,
    currentView,
    navigateToToday,
    navigatePrevious,
    navigateNext,
    setView,
    getCurrentMonthName,
    getCurrentYear,
    getCurrentWeekRange,
  } = useCalendarNavigation();

  const { openEventModal } = useEventManagement();

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

  const handleViewChange = (view: CalendarView) => {
    setView(view);
  };

  const handleCreateEvent = () => {
    openEventModal();
  };

  const viewOptions = [
    { value: "year", label: localization?.calendar.views.year },
    { value: "month", label: localization?.calendar.views.month },
    { value: "week", label: localization?.calendar.views.week },
    { value: "day", label: localization?.calendar.views.day },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 px-6 border-b border-calendar-border bg-background gap-4">
      {/* Left section - Logo and navigation */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-6 w-6 text-calendar-primary" />
          <h1 className="text-xl font-semibold text-foreground">
            {localization?.calendar.title}
          </h1>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={navigateToToday}
            className="text-sm font-medium"
          >
            {localization?.calendar.navigation.today}
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

      {/* Right section - View select, theme toggle and create button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* View select dropdown */}
        <div className="w-full sm:w-auto min-w-[120px]">
          <Select value={currentView} onValueChange={handleViewChange}>
            <SelectTrigger className="capitalize">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {viewOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Theme toggle */}
        <ThemeToggle size="sm" />

        <Button
          onClick={handleCreateEvent}
          className="bg-calendar-primary hover:bg-calendar-primary-hover text-white font-medium w-full sm:w-auto"
        >
          {localization?.calendar.actions.createEvent}
        </Button>
      </div>
    </div>
  );
};

export default CalendarHeader;
