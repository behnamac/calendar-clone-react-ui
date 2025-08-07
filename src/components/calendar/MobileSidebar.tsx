import React, { useState } from "react";
import {
  Menu,
  Calendar as CalendarIcon,
  Settings,
  Plus,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useCalendarNavigation } from "@/hooks/useCalendarNavigation";
import { useEventManagement } from "@/hooks/useEventManagement";
import { useLocalization } from "@/hooks/useLocalization";
import { useHeaderDate } from "@/hooks/useHeaderDate";
import { CalendarView } from "@/types/calendar";

/**
 * MobileSidebar Component
 *
 * A slide-out sidebar for mobile devices that contains:
 * - Navigation controls (Today, Previous, Next)
 * - View selection (Year, Month, Week, Day)
 * - Create event button
 * - Theme toggle
 *
 * This component is automatically included in the Calendar.Header
 * and only shows on mobile devices (screen width < 768px).
 */
const MobileSidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { localization } = useLocalization();
  const {
    currentView,
    navigateToToday,
    navigatePrevious,
    navigateNext,
    setView,
  } = useCalendarNavigation();

  const { openEventModal } = useEventManagement();
  const { formatHeaderDate, getViewOptions } = useHeaderDate();

  const handleViewChange = (view: CalendarView) => {
    setView(view);
    setIsOpen(false);
  };

  const handleCreateEvent = () => {
    openEventModal();
    setIsOpen(false);
  };

  const handleNavigate = (direction: "previous" | "next" | "today") => {
    switch (direction) {
      case "previous":
        navigatePrevious();
        break;
      case "next":
        navigateNext();
        break;
      case "today":
        navigateToToday();
        break;
    }
  };

  const viewOptions = getViewOptions(localization);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="lg:hidden h-8 w-8 p-0">
          <Menu className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[320px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-calendar-primary" />
            {localization?.calendar.title}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-6 mt-6">
          {/* Current Date Display */}
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <h2 className="text-lg font-semibold text-foreground">
              {formatHeaderDate()}
            </h2>
          </div>

          {/* Navigation Controls */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Navigation
            </h3>

            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleNavigate("today")}
                className="w-full justify-start"
                aria-label="Go to today"
              >
                {localization?.calendar.navigation.today}
              </Button>

              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavigate("previous")}
                  className="flex-1"
                  aria-label="Go to previous period"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavigate("next")}
                  className="flex-1"
                  aria-label="Go to next period"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* View Selection */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              View
            </h3>
            <Select value={currentView} onValueChange={handleViewChange}>
              <SelectTrigger className="w-full capitalize">
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

          {/* Actions */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Actions
            </h3>
            <Button
              onClick={handleCreateEvent}
              className="w-full bg-calendar-primary dark:text-gray-800 hover:bg-calendar-primary-hover text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              {localization?.calendar.actions.createEvent}
            </Button>
          </div>

          {/* Settings */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Settings
            </h3>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Theme</span>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
