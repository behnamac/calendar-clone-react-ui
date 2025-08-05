import React from "react";
import { useLocalization } from "../../../hooks/useLocalization";
import { withCalendar } from "../withCalendar";
import { CalendarEvent, CalendarView } from "../../../types/calendar";

/**
 * HOC Calendar App Props Interface
 *
 * Defines the props that will be injected by the withCalendar HOC
 */
interface HOCCalendarAppProps {
  currentDate: Date;
  currentView: CalendarView;
  events: CalendarEvent[];
  selectedDate: Date | null;
  isEventModalOpen: boolean;
  editingEvent: CalendarEvent | null;
  setCurrentDate: (date: Date) => void;
  setView: (view: CalendarView) => void;
  addEvent: (event: CalendarEvent) => void;
  updateEvent: (event: CalendarEvent) => void;
  deleteEvent: (eventId: string) => void;
  setSelectedDate: (date: Date | null) => void;
  openEventModal: (event?: CalendarEvent) => void;
  closeEventModal: () => void;
  navigateToToday: () => void;
  navigatePrevious: () => void;
  navigateNext: () => void;
}

/**
 * HOC Calendar Header Component
 *
 * Handles the navigation and view selection UI
 */
const HOCCalendarHeader: React.FC<{
  currentDate: Date;
  currentView: CalendarView;
  navigateToToday: () => void;
  navigatePrevious: () => void;
  navigateNext: () => void;
  setView: (view: CalendarView) => void;
  openEventModal: () => void;
}> = ({
  currentDate,
  currentView,
  navigateToToday,
  navigatePrevious,
  navigateNext,
  setView,
  openEventModal,
}) => {
  const { localization } = useLocalization();

  return (
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
            {localization?.calendar.navigation.today}
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
            onChange={(e) => setView(e.target.value as CalendarView)}
            className="px-3 py-2 border border-calendar-border rounded-md"
          >
            <option value="month">{localization?.calendar.views.month}</option>
            <option value="week">{localization?.calendar.views.week}</option>
            <option value="day">{localization?.calendar.views.day}</option>
          </select>
          <button
            onClick={openEventModal}
            className="px-4 py-2 bg-calendar-primary text-white rounded-md"
          >
            {localization?.calendar.actions.createEvent}
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * HOC Calendar Content Component
 *
 * Handles the main content area display
 */
const HOCCalendarContent: React.FC<{
  currentDate: Date;
  events: CalendarEvent[];
}> = ({ currentDate, events }) => {
  const { localization } = useLocalization();

  return (
    <div className="flex-1 overflow-hidden">
      <div className="p-4">
        <p>
          {localization?.calendar.demo.hocView}{" "}
          {currentDate.toLocaleDateString()}
        </p>
        <p>
          {localization?.calendar.demo.totalEvents} {events.length}
        </p>
      </div>
    </div>
  );
};

/**
 * HOC Calendar App Component
 *
 * Higher-Order Component pattern example that receives all calendar
 * state and actions as props from the withCalendar HOC.
 */
const HOCCalendarApp: React.FC<HOCCalendarAppProps> = ({
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
      <HOCCalendarHeader
        currentDate={currentDate}
        currentView={currentView}
        navigateToToday={navigateToToday}
        navigatePrevious={navigatePrevious}
        navigateNext={navigateNext}
        setView={setView}
        openEventModal={openEventModal}
      />
      <HOCCalendarContent currentDate={currentDate} events={events} />
    </div>
  );
};

// Export the HOC-wrapped component
export const HOCCalendarAppWrapped = withCalendar(HOCCalendarApp);

export default HOCCalendarApp;
