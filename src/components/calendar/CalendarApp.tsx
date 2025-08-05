import React from "react";
import { Calendar } from "./Calendar";
import { CalendarContainer } from "./containers/CalendarContainer";
import { CalendarData } from "./CalendarData";
import { withCalendar } from "./withCalendar";
import CalendarView from "./CalendarView";

// Example of using Compound Components pattern
const CalendarApp: React.FC = () => {
  return (
    <Calendar>
      <Calendar.Header />
      <CalendarView />
      <Calendar.EventModal />
    </Calendar>
  );
};

// Example of using Container/Presentational pattern
const CalendarAppWithContainer: React.FC = () => {
  return <CalendarContainer />;
};

// Example of using HOC pattern
interface CalendarAppWithHOCProps {
  currentDate: Date;
  currentView: "month" | "week" | "day";
  events: any[];
  selectedDate: Date | null;
  isEventModalOpen: boolean;
  editingEvent: any;
  setCurrentDate: (date: Date) => void;
  setView: (view: "month" | "week" | "day") => void;
  addEvent: (event: any) => void;
  updateEvent: (event: any) => void;
  deleteEvent: (eventId: string) => void;
  setSelectedDate: (date: Date | null) => void;
  openEventModal: (event?: any) => void;
  closeEventModal: () => void;
  navigateToToday: () => void;
  navigatePrevious: () => void;
  navigateNext: () => void;
}

const CalendarAppWithHOC: React.FC<CalendarAppWithHOCProps> = ({
  currentDate,
  currentView,
  events,
  navigateToToday,
  navigatePrevious,
  navigateNext,
  setView,
  openEventModal,
}) => {
  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="border-b border-calendar-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={navigatePrevious}
              className="p-2 hover:bg-calendar-hover rounded-md"
            >
              ←
            </button>
            <button
              onClick={navigateNext}
              className="p-2 hover:bg-calendar-hover rounded-md"
            >
              →
            </button>
            <button
              onClick={navigateToToday}
              className="px-4 py-2 bg-calendar-primary text-white rounded-md hover:bg-calendar-primary/90"
            >
              Today
            </button>
            <h1 className="text-xl font-semibold">
              {currentDate.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={currentView}
              onChange={(e) => setView(e.target.value as any)}
              className="px-3 py-2 border border-calendar-border rounded-md"
            >
              <option value="month">Month</option>
              <option value="week">Week</option>
              <option value="day">Day</option>
            </select>
            <button
              onClick={() => openEventModal()}
              className="px-4 py-2 bg-calendar-primary text-white rounded-md"
            >
              Create Event
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="p-4">
          <p>HOC Calendar View for {currentDate.toLocaleDateString()}</p>
          <p>Total Events: {events.length}</p>
        </div>
      </div>
    </div>
  );
};

// Export the HOC-wrapped component
export const CalendarAppWithHOCWrapped = withCalendar(CalendarAppWithHOC);

// Export the default component (using Compound Components)
export default CalendarApp;
