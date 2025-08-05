import React from "react";
import { Calendar } from "./Calendar";
import CalendarView from "./CalendarView";

/**
 * Calendar App Component
 *
 * Main entry point for the calendar application using the Compound Components pattern.
 * This provides a clean, composable API for the calendar.
 */
const CalendarApp: React.FC = () => {
  return (
    <Calendar>
      <Calendar.Header />
      <CalendarView />
      <Calendar.EventModal />
    </Calendar>
  );
};

export default CalendarApp;
