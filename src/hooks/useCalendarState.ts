import { useReducer, useCallback } from "react";
import { CalendarEvent, CalendarState, CalendarView } from "../types/calendar";

type CalendarAction =
  | { type: "SET_CURRENT_DATE"; payload: Date }
  | { type: "SET_VIEW"; payload: CalendarView }
  | { type: "ADD_EVENT"; payload: CalendarEvent }
  | { type: "UPDATE_EVENT"; payload: CalendarEvent }
  | { type: "DELETE_EVENT"; payload: string }
  | { type: "SET_SELECTED_DATE"; payload: Date | null }
  | { type: "OPEN_EVENT_MODAL"; payload?: CalendarEvent }
  | { type: "CLOSE_EVENT_MODAL" }
  | { type: "NAVIGATE_TO_TODAY" }
  | { type: "NAVIGATE_PREVIOUS" }
  | { type: "NAVIGATE_NEXT" };

const initialState: CalendarState = {
  currentDate: new Date(),
  currentView: "month",
  events: [
    {
      id: "1",
      title: "Team Standup",
      description: "Daily team standup meeting",
      startDate: new Date(2024, 11, 20, 9, 0),
      endDate: new Date(2024, 11, 20, 9, 30),
      color: "blue",
      allDay: false,
    },
    {
      id: "2",
      title: "Project Review",
      description: "Quarterly project review with stakeholders",
      startDate: new Date(2024, 11, 22, 14, 0),
      endDate: new Date(2024, 11, 22, 16, 0),
      color: "green",
      allDay: false,
    },
    {
      id: "3",
      title: "Conference",
      description: "Tech conference - all day event",
      startDate: new Date(2024, 11, 25, 0, 0),
      endDate: new Date(2024, 11, 25, 23, 59),
      color: "purple",
      allDay: true,
    },
  ],
  selectedDate: null,
  isEventModalOpen: false,
  editingEvent: null,
};

const calendarReducer = (
  state: CalendarState,
  action: CalendarAction
): CalendarState => {
  switch (action.type) {
    case "SET_CURRENT_DATE":
      return { ...state, currentDate: action.payload };

    case "SET_VIEW":
      return { ...state, currentView: action.payload };

    case "ADD_EVENT":
      return {
        ...state,
        events: [...state.events, action.payload],
        isEventModalOpen: false,
        selectedDate: null,
      };

    case "UPDATE_EVENT":
      return {
        ...state,
        events: state.events.map((event) =>
          event.id === action.payload.id ? action.payload : event
        ),
        isEventModalOpen: false,
        editingEvent: null,
      };

    case "DELETE_EVENT":
      return {
        ...state,
        events: state.events.filter((event) => event.id !== action.payload),
        isEventModalOpen: false,
        editingEvent: null,
      };

    case "SET_SELECTED_DATE":
      return { ...state, selectedDate: action.payload };

    case "OPEN_EVENT_MODAL":
      return {
        ...state,
        isEventModalOpen: true,
        editingEvent: action.payload || null,
      };

    case "CLOSE_EVENT_MODAL":
      return {
        ...state,
        isEventModalOpen: false,
        editingEvent: null,
        selectedDate: null,
      };

    case "NAVIGATE_TO_TODAY":
      return { ...state, currentDate: new Date() };

    case "NAVIGATE_PREVIOUS":
      const prevDate = new Date(state.currentDate);
      if (state.currentView === "year") {
        prevDate.setFullYear(prevDate.getFullYear() - 1);
      } else if (state.currentView === "month") {
        prevDate.setMonth(prevDate.getMonth() - 1);
      } else if (state.currentView === "week") {
        prevDate.setDate(prevDate.getDate() - 7);
      } else {
        prevDate.setDate(prevDate.getDate() - 1);
      }
      return { ...state, currentDate: prevDate };

    case "NAVIGATE_NEXT":
      const nextDate = new Date(state.currentDate);
      if (state.currentView === "year") {
        nextDate.setFullYear(nextDate.getFullYear() + 1);
      } else if (state.currentView === "month") {
        nextDate.setMonth(nextDate.getMonth() + 1);
      } else if (state.currentView === "week") {
        nextDate.setDate(nextDate.getDate() + 7);
      } else {
        nextDate.setDate(nextDate.getDate() + 1);
      }
      return { ...state, currentDate: nextDate };

    default:
      return state;
  }
};

export const useCalendarState = () => {
  const [state, dispatch] = useReducer(calendarReducer, initialState);

  const setCurrentDate = useCallback((date: Date) => {
    dispatch({ type: "SET_CURRENT_DATE", payload: date });
  }, []);

  const setView = useCallback((view: CalendarView) => {
    dispatch({ type: "SET_VIEW", payload: view });
  }, []);

  const addEvent = useCallback((event: CalendarEvent) => {
    dispatch({ type: "ADD_EVENT", payload: event });
  }, []);

  const updateEvent = useCallback((event: CalendarEvent) => {
    dispatch({ type: "UPDATE_EVENT", payload: event });
  }, []);

  const deleteEvent = useCallback((eventId: string) => {
    dispatch({ type: "DELETE_EVENT", payload: eventId });
  }, []);

  const setSelectedDate = useCallback((date: Date | null) => {
    dispatch({ type: "SET_SELECTED_DATE", payload: date });
  }, []);

  const openEventModal = useCallback((event?: CalendarEvent) => {
    dispatch({ type: "OPEN_EVENT_MODAL", payload: event });
  }, []);

  const closeEventModal = useCallback(() => {
    dispatch({ type: "CLOSE_EVENT_MODAL" });
  }, []);

  const navigateToToday = useCallback(() => {
    dispatch({ type: "NAVIGATE_TO_TODAY" });
  }, []);

  const navigatePrevious = useCallback(() => {
    dispatch({ type: "NAVIGATE_PREVIOUS" });
  }, []);

  const navigateNext = useCallback(() => {
    dispatch({ type: "NAVIGATE_NEXT" });
  }, []);

  return {
    state,
    actions: {
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
    },
  };
};
