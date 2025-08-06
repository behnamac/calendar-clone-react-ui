import React, { createContext, useContext } from "react";
import { useCalendarState } from "@/hooks/useCalendarState";

interface CalendarContextType {
  state: ReturnType<typeof useCalendarState>["state"];
  actions: ReturnType<typeof useCalendarState>["actions"];
}

const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined
);

export const CalendarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { state, actions } = useCalendarState();

  return (
    <CalendarContext.Provider value={{ state, actions }}>
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error("useCalendar must be used within a CalendarProvider");
  }
  return context;
};
