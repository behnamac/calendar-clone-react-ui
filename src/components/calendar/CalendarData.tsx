import React from "react";
import { useCalendar } from "../../contexts/CalendarContext";
import { CalendarEvent, CalendarView } from "../../types/calendar";

interface CalendarDataProps {
  children: (props: {
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
  }) => React.ReactNode;
}

export const CalendarData: React.FC<CalendarDataProps> = ({ children }) => {
  const { state, actions } = useCalendar();

  return (
    <>
      {children({
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
      })}
    </>
  );
};
