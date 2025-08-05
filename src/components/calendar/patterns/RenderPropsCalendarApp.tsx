import React from "react";
import { CalendarData } from "../CalendarData";
import { CalendarEvent, CalendarView } from "../../../types/calendar";

/**
 * Render Props Calendar App Props Interface
 * 
 * Defines the props that will be provided by the CalendarData component
 */
interface RenderPropsCalendarAppProps {
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
 * Render Props Calendar App Component
 * 
 * Render Props pattern example that receives calendar state and actions
 * as a function parameter from the CalendarData component.
 */
const RenderPropsCalendarApp: React.FC = () => {
  return (
    <CalendarData>
      {({
        currentDate,
        currentView,
        events,
        selectedDate,
        isEventModalOpen,
        editingEvent,
        setCurrentDate,
        setView,
        addEvent,
        updateEvent,
        deleteEvent,
        setSelectedDate,
        openEventModal,
        closeEventModal,
        navigateToToday,
        navigatePrevious,
        navigateNext,
      }: RenderPropsCalendarAppProps) => (
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
                  onChange={(e) => setView(e.target.value as CalendarView)}
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
            {/* This would be your custom month view implementation */}
            <div className="p-4">
              <p>Custom Month View for {currentDate.toLocaleDateString()}</p>
              <p>Total Events: {events.length}</p>
            </div>
          </div>
        </div>
      )}
    </CalendarData>
  );
};

export default RenderPropsCalendarApp; 