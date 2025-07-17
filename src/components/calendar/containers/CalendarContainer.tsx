import React from "react";
import { useCalendar } from "../../../contexts/CalendarContext";
import { CalendarEvent } from "../../../types/calendar";
import CalendarHeader from "../CalendarHeader";
import MonthView from "../MonthView";
import EventModal from "../EventModal";

interface CalendarContainerProps {
  children?: React.ReactNode;
}

export const CalendarContainer: React.FC<CalendarContainerProps> = ({
  children,
}) => {
  const { state, actions } = useCalendar();

  const handleDateClick = (date: Date) => {
    actions.setSelectedDate(date);
    actions.openEventModal();
  };

  const handleEventClick = (event: CalendarEvent) => {
    actions.openEventModal(event);
  };

  const handleEventSave = (event: CalendarEvent) => {
    if (event.id) {
      actions.updateEvent(event);
    } else {
      actions.addEvent(event);
    }
  };

  const handleEventDelete = (eventId: string) => {
    actions.deleteEvent(eventId);
  };

  const handleModalClose = () => {
    actions.closeEventModal();
  };

  const handleViewChange = (view: "month" | "week" | "day") => {
    actions.setView(view);
  };

  const handleNavigatePrevious = () => {
    actions.navigatePrevious();
  };

  const handleNavigateNext = () => {
    actions.navigateNext();
  };

  const handleNavigateToToday = () => {
    actions.navigateToToday();
  };

  // If custom children are provided, render them with the handlers
  if (children) {
    return (
      <div className="h-screen flex flex-col bg-background">
        {React.cloneElement(children as React.ReactElement, {
          currentDate: state.currentDate,
          currentView: state.currentView,
          events: state.events,
          selectedDate: state.selectedDate,
          isEventModalOpen: state.isEventModalOpen,
          editingEvent: state.editingEvent,
          onDateClick: handleDateClick,
          onEventClick: handleEventClick,
          onEventSave: handleEventSave,
          onEventDelete: handleEventDelete,
          onModalClose: handleModalClose,
          onViewChange: handleViewChange,
          onNavigatePrevious: handleNavigatePrevious,
          onNavigateNext: handleNavigateNext,
          onNavigateToToday: handleNavigateToToday,
        })}
      </div>
    );
  }

  // Default render with existing components
  return (
    <div className="h-screen flex flex-col bg-background">
      <CalendarHeader />
      <div className="flex-1 overflow-hidden">
        <MonthView />
      </div>
      <EventModal />
    </div>
  );
};
