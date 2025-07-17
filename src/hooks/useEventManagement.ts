import { useCallback } from "react";
import { useCalendar } from "../contexts/CalendarContext";
import { CalendarEvent } from "../types/calendar";

export const useEventManagement = () => {
  const { state, actions } = useCalendar();

  const createEvent = useCallback(
    (eventData: Omit<CalendarEvent, "id">) => {
      const newEvent: CalendarEvent = {
        ...eventData,
        id: Date.now().toString(), // Simple ID generation
      };
      actions.addEvent(newEvent);
      return newEvent;
    },
    [actions]
  );

  const updateEvent = useCallback(
    (event: CalendarEvent) => {
      actions.updateEvent(event);
    },
    [actions]
  );

  const deleteEvent = useCallback(
    (eventId: string) => {
      actions.deleteEvent(eventId);
    },
    [actions]
  );

  const getEventsForDate = useCallback(
    (date: Date) => {
      return state.events.filter((event) => {
        const eventDate = new Date(event.startDate);
        return (
          eventDate.getDate() === date.getDate() &&
          eventDate.getMonth() === date.getMonth() &&
          eventDate.getFullYear() === date.getFullYear()
        );
      });
    },
    [state.events]
  );

  const getEventsForDateRange = useCallback(
    (startDate: Date, endDate: Date) => {
      return state.events.filter((event) => {
        const eventStart = new Date(event.startDate);
        const eventEnd = new Date(event.endDate);

        return (
          (eventStart >= startDate && eventStart <= endDate) ||
          (eventEnd >= startDate && eventEnd <= endDate) ||
          (eventStart <= startDate && eventEnd >= endDate)
        );
      });
    },
    [state.events]
  );

  const openEventModal = useCallback(
    (event?: CalendarEvent) => {
      actions.openEventModal(event);
    },
    [actions]
  );

  const closeEventModal = useCallback(() => {
    actions.closeEventModal();
  }, [actions]);

  return {
    events: state.events,
    editingEvent: state.editingEvent,
    isEventModalOpen: state.isEventModalOpen,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventsForDate,
    getEventsForDateRange,
    openEventModal,
    closeEventModal,
  };
};
