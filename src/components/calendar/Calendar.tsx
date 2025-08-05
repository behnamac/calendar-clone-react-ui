import React, { createContext, useContext } from "react";
import { CalendarProvider, useCalendar } from "../../contexts/CalendarContext";
import { useLocalization } from "../../hooks/useLocalization";
import CalendarView from "./CalendarView";
import EventModal from "./EventModal";
import { ThemeToggle } from "../ui/theme-toggle";
import { CalendarIcon } from "lucide-react";

interface CalendarContextValue {
  // This will be provided by the CalendarProvider
}

const CalendarContext = createContext<CalendarContextValue | undefined>(
  undefined
);

export const useCalendarContext = () => {
  const { localization } = useLocalization();
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error(
      localization?.calendar.errors.calendarContext ||
        "Calendar components must be used within a Calendar"
    );
  }
  return context;
};

interface CalendarProps {
  children: React.ReactNode;
}

export const Calendar: React.FC<CalendarProps> & {
  Header: typeof CalendarHeader;
  MonthView: typeof CalendarMonthView;
  EventModal: typeof CalendarEventModal;
} = ({ children }) => {
  return (
    <CalendarProvider>
      <CalendarContext.Provider value={{}}>
        <div className="h-screen flex flex-col bg-background">{children}</div>
      </CalendarContext.Provider>
    </CalendarProvider>
  );
};

// Compound Components
interface CalendarHeaderProps {
  children?: React.ReactNode;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ children }) => {
  return (
    <div className="border-b border-calendar-border">
      {children || <DefaultCalendarHeader />}
    </div>
  );
};

const DefaultCalendarHeader: React.FC = () => {
  const { localization } = useLocalization();
  const { state, actions } = useCalendar();

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center space-x-10">
        <div className="inline-flex items-center gap-2">
          <CalendarIcon className="h-10 w-auto text-calendar-primary" />
          <h1 className="text-2xl font-semibold text-foreground">
            {localization?.calendar.title}
          </h1>
        </div>
        <button
          onClick={actions.navigateToToday}
          className="px-4 py-2 bg-calendar-primary text-white rounded-md hover:bg-calendar-primary/90"
        >
          {localization?.calendar.navigation.today}
        </button>
        <button
          onClick={actions.navigatePrevious}
          className="p-2 hover:bg-calendar-hover rounded-md"
        >
          {localization?.calendar.navigation.previousArrow}
        </button>
        <button
          onClick={actions.navigateNext}
          className="p-2 hover:bg-calendar-hover rounded-md"
        >
          {localization?.calendar.navigation.nextArrow}
        </button>
        <h1 className="text-xl font-semibold">
          {state.currentDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h1>
      </div>
      <div className="flex items-center space-x-2">
        <select
          value={state.currentView}
          onChange={(e) => actions.setView(e.target.value as any)}
          className="px-3 py-2 border border-calendar-border rounded-md"
        >
          <option value="month">
            {localization?.calendar.calendarHeader.viewOptions.month}
          </option>
          <option value="week">
            {localization?.calendar.calendarHeader.viewOptions.week}
          </option>
          <option value="day">
            {localization?.calendar.calendarHeader.viewOptions.day}
          </option>
        </select>

        {/* Theme toggle */}
        <div className="flex items-center justify-center p-1 rounded-lg bg-muted/50">
          <ThemeToggle
            size="sm"
            className="text-foreground hover:text-calendar-primary transition-colors"
          />
        </div>
      </div>
    </div>
  );
};

interface CalendarMonthViewProps {
  children?: React.ReactNode;
}

const CalendarMonthView: React.FC<CalendarMonthViewProps> = ({ children }) => {
  return (
    <div className="flex-1 overflow-hidden">
      {children || <DefaultCalendarMonthView />}
    </div>
  );
};

const DefaultCalendarMonthView: React.FC = () => {
  return <CalendarView />;
};

interface CalendarEventModalProps {
  children?: React.ReactNode;
}

const CalendarEventModal: React.FC<CalendarEventModalProps> = ({
  children,
}) => {
  return <>{children || <DefaultCalendarEventModal />}</>;
};

const DefaultCalendarEventModal: React.FC = () => {
  return <EventModal />;
};

// Attach compound components
Calendar.Header = CalendarHeader;
Calendar.MonthView = CalendarMonthView;
Calendar.EventModal = CalendarEventModal;
