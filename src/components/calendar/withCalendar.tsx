import React from "react";
import { useCalendar } from "../../contexts/CalendarContext";
import { CalendarEvent, CalendarView } from "../../types/calendar";

interface WithCalendarProps {
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

export const withCalendar = <P extends object>(
  Component: React.ComponentType<P & WithCalendarProps>
) => {
  const WithCalendarComponent: React.FC<P> = (props) => {
    const { state, actions } = useCalendar();

    const calendarProps: WithCalendarProps = {
      currentDate: state.currentDate,
      currentView: state.currentView,
      events: state.events,
      selectedDate: state.selectedDate,
      isEventModalOpen: state.isEventModalOpen,
      editingEvent: state.editingEvent,
      setCurrentDate: actions.setCurrentDate,
      setView: actions.setView,
      addEvent: actions.addEvent,
      updateEvent: actions.updateEvent,
      deleteEvent: actions.deleteEvent,
      setSelectedDate: actions.setSelectedDate,
      openEventModal: actions.openEventModal,
      closeEventModal: actions.closeEventModal,
      navigateToToday: actions.navigateToToday,
      navigatePrevious: actions.navigatePrevious,
      navigateNext: actions.navigateNext,
    };

    return <Component {...props} {...calendarProps} />;
  };

  WithCalendarComponent.displayName = `withCalendar(${
    Component.displayName || Component.name
  })`;

  return WithCalendarComponent;
};
