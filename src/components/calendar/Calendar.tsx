import React, { createContext, useContext } from "react";
import { CalendarProvider } from "@/contexts/CalendarContext";
import { useLocalization } from "@/hooks/useLocalization";
import CalendarView from "./CalendarView";
import EventModal from "./EventModal";
import CalendarHeader from "./CalendarHeader";

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
  Header: typeof CalendarHeaderWrapper;
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
interface CalendarHeaderWrapperProps {
  children?: React.ReactNode;
}

const CalendarHeaderWrapper: React.FC<CalendarHeaderWrapperProps> = ({
  children,
}) => {
  return (
    <div className="border-b border-calendar-border">
      {children || <CalendarHeader />}
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
Calendar.Header = CalendarHeaderWrapper;
Calendar.MonthView = CalendarMonthView;
Calendar.EventModal = CalendarEventModal;
