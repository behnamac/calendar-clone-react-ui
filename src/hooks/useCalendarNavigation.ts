import { useCallback } from "react";
import { useCalendar } from "../contexts/CalendarContext";
import { CalendarView } from "../types/calendar";

export const useCalendarNavigation = () => {
  const { state, actions } = useCalendar();

  const navigateToToday = useCallback(() => {
    actions.navigateToToday();
  }, [actions]);

  const navigatePrevious = useCallback(() => {
    actions.navigatePrevious();
  }, [actions]);

  const navigateNext = useCallback(() => {
    actions.navigateNext();
  }, [actions]);

  const navigateToDate = useCallback(
    (date: Date) => {
      actions.setCurrentDate(date);
    },
    [actions]
  );

  const navigateToMonth = useCallback(
    (month: number, year: number) => {
      const newDate = new Date(year, month, 1);
      actions.setCurrentDate(newDate);
    },
    [actions]
  );

  const navigateToWeek = useCallback(
    (weekStartDate: Date) => {
      actions.setCurrentDate(weekStartDate);
    },
    [actions]
  );

  const setView = useCallback(
    (view: CalendarView) => {
      actions.setView(view);
    },
    [actions]
  );

  const getCurrentMonthName = useCallback(() => {
    return state.currentDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  }, [state.currentDate]);

  const getCurrentYear = useCallback(() => {
    return state.currentDate.getFullYear().toString();
  }, [state.currentDate]);

  const getCurrentWeekRange = useCallback(() => {
    const startOfWeek = new Date(state.currentDate);
    const dayOfWeek = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);

    return { startOfWeek, endOfWeek };
  }, [state.currentDate]);

  const getCurrentMonthRange = useCallback(() => {
    const startOfMonth = new Date(
      state.currentDate.getFullYear(),
      state.currentDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      state.currentDate.getFullYear(),
      state.currentDate.getMonth() + 1,
      0
    );

    return { startOfMonth, endOfMonth };
  }, [state.currentDate]);

  const getCurrentYearRange = useCallback(() => {
    const startOfYear = new Date(state.currentDate.getFullYear(), 0, 1);
    const endOfYear = new Date(state.currentDate.getFullYear(), 11, 31);

    return { startOfYear, endOfYear };
  }, [state.currentDate]);

  return {
    currentDate: state.currentDate,
    currentView: state.currentView,
    navigateToToday,
    navigatePrevious,
    navigateNext,
    navigateToDate,
    navigateToMonth,
    navigateToWeek,
    setView,
    getCurrentMonthName,
    getCurrentYear,
    getCurrentWeekRange,
    getCurrentMonthRange,
    getCurrentYearRange,
  };
};
