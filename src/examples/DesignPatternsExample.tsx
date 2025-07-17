import React from "react";
import { Calendar } from "../components/calendar/Calendar";
import { CalendarContainer } from "../components/calendar/containers/CalendarContainer";
import { CalendarData } from "../components/calendar/CalendarData";
import { withCalendar } from "../components/calendar/withCalendar";
import { useEventManagement } from "../hooks/useEventManagement";
import { useCalendarNavigation } from "../hooks/useCalendarNavigation";

/**
 * React Design Patterns Examples
 *
 * This file demonstrates various React design patterns implemented in the calendar application:
 *
 * 1. Component Composition Pattern
 * 2. Custom Hooks Pattern
 * 3. Render Props Pattern
 * 4. Compound Components Pattern
 * 5. Higher-Order Components (HOC) Pattern
 * 6. Provider Pattern
 * 7. Container/Presentational Pattern
 */

// ============================================================================
// 1. COMPOUND COMPONENTS PATTERN
// ============================================================================
export const CompoundComponentsExample: React.FC = () => {
  return (
    <Calendar>
      <Calendar.Header />
      <Calendar.MonthView />
      <Calendar.EventModal />
    </Calendar>
  );
};

// Custom compound component usage
export const CustomCompoundComponentsExample: React.FC = () => {
  return (
    <Calendar>
      <Calendar.Header>
        <div className="p-4 bg-blue-100">
          <h1>Custom Header</h1>
        </div>
      </Calendar.Header>
      <Calendar.MonthView>
        <div className="p-4 bg-green-100">
          <h2>Custom Month View</h2>
        </div>
      </Calendar.MonthView>
    </Calendar>
  );
};

// ============================================================================
// 2. RENDER PROPS PATTERN
// ============================================================================
export const RenderPropsExample: React.FC = () => {
  return (
    <CalendarData>
      {({
        currentDate,
        currentView,
        events,
        navigateToToday,
        navigatePrevious,
        navigateNext,
        setView,
        openEventModal,
      }) => (
        <div className="h-screen flex flex-col bg-background">
          {/* Custom header using render props */}
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

          {/* Custom month view using render props */}
          <div className="flex-1 overflow-hidden">
            <div className="p-4">
              <h2>Custom Month View for {currentDate.toLocaleDateString()}</h2>
              <p>Total Events: {events.length}</p>
              <div className="mt-4">
                <h3>Events:</h3>
                <ul className="space-y-2">
                  {events.map((event) => (
                    <li key={event.id} className="p-2 bg-gray-100 rounded">
                      {event.title} - {event.startDate.toLocaleDateString()}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </CalendarData>
  );
};

// ============================================================================
// 3. HIGHER-ORDER COMPONENTS (HOC) PATTERN
// ============================================================================
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
          <h2>HOC Calendar View for {currentDate.toLocaleDateString()}</h2>
          <p>Total Events: {events.length}</p>
          <div className="mt-4">
            <h3>Events:</h3>
            <ul className="space-y-2">
              {events.map((event) => (
                <li key={event.id} className="p-2 bg-gray-100 rounded">
                  {event.title} - {event.startDate.toLocaleDateString()}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export the HOC-wrapped component
export const CalendarAppWithHOCWrapped = withCalendar(CalendarAppWithHOC);

// ============================================================================
// 4. CONTAINER/PRESENTATIONAL PATTERN
// ============================================================================
export const ContainerPresentationalExample: React.FC = () => {
  return <CalendarContainer />;
};

// Custom container with custom children
export const CustomContainerExample: React.FC = () => {
  return (
    <CalendarContainer>
      <CustomCalendarView />
    </CalendarContainer>
  );
};

// Presentational component
const CustomCalendarView: React.FC<any> = ({
  currentDate,
  events,
  onDateClick,
  onEventClick,
  onEventSave,
  onEventDelete,
  onModalClose,
  onViewChange,
  onNavigatePrevious,
  onNavigateNext,
  onNavigateToToday,
}) => {
  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="border-b border-calendar-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={onNavigatePrevious}
              className="p-2 hover:bg-calendar-hover rounded-md"
            >
              ←
            </button>
            <button
              onClick={onNavigateNext}
              className="p-2 hover:bg-calendar-hover rounded-md"
            >
              →
            </button>
            <button
              onClick={onNavigateToToday}
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
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="p-4">
          <h2>Custom Presentational View</h2>
          <p>Date: {currentDate.toLocaleDateString()}</p>
          <p>Events: {events.length}</p>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 5. CUSTOM HOOKS PATTERN
// ============================================================================
export const CustomHooksExample: React.FC = () => {
  const {
    currentDate,
    currentView,
    navigateToToday,
    navigatePrevious,
    navigateNext,
    setView,
    getCurrentMonthName,
  } = useCalendarNavigation();

  const { events, getEventsForDate, openEventModal, createEvent, deleteEvent } =
    useEventManagement();

  const handleCreateSampleEvent = () => {
    createEvent({
      title: "Sample Event",
      description: "Created using custom hooks",
      startDate: new Date(),
      endDate: new Date(Date.now() + 3600000), // 1 hour later
      color: "blue",
      allDay: false,
    });
  };

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
            <h1 className="text-xl font-semibold">{getCurrentMonthName()}</h1>
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
            <button
              onClick={handleCreateSampleEvent}
              className="px-4 py-2 bg-green-500 text-white rounded-md"
            >
              Add Sample Event
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="p-4">
          <h2>Custom Hooks Example</h2>
          <p>Current Date: {currentDate.toLocaleDateString()}</p>
          <p>Total Events: {events.length}</p>
          <p>Today's Events: {getEventsForDate(currentDate).length}</p>

          <div className="mt-4">
            <h3>All Events:</h3>
            <ul className="space-y-2">
              {events.map((event) => (
                <li
                  key={event.id}
                  className="p-2 bg-gray-100 rounded flex justify-between"
                >
                  <span>
                    {event.title} - {event.startDate.toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => deleteEvent(event.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded text-sm"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 6. COMPONENT COMPOSITION PATTERN
// ============================================================================
export const ComponentCompositionExample: React.FC = () => {
  return (
    <div className="h-screen flex flex-col bg-background">
      <CalendarHeader />
      <CalendarContent />
      <CalendarFooter />
    </div>
  );
};

const CalendarHeader: React.FC = () => {
  const { getCurrentMonthName } = useCalendarNavigation();

  return (
    <div className="border-b border-calendar-border p-4">
      <h1 className="text-2xl font-bold">{getCurrentMonthName()}</h1>
    </div>
  );
};

const CalendarContent: React.FC = () => {
  const { events } = useEventManagement();

  return (
    <div className="flex-1 p-4">
      <h2>Calendar Content</h2>
      <p>Total Events: {events.length}</p>
    </div>
  );
};

const CalendarFooter: React.FC = () => {
  return (
    <div className="border-t border-calendar-border p-4">
      <p className="text-sm text-gray-500">Calendar Footer</p>
    </div>
  );
};

// ============================================================================
// MAIN EXPORT
// ============================================================================
export default {
  CompoundComponentsExample,
  CustomCompoundComponentsExample,
  RenderPropsExample,
  CalendarAppWithHOCWrapped,
  ContainerPresentationalExample,
  CustomContainerExample,
  CustomHooksExample,
  ComponentCompositionExample,
};
