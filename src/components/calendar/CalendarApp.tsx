import React from "react";
import CalendarAppFactory, { CalendarPattern } from "./CalendarAppFactory";

/**
 * Calendar App Component
 *
 * Main entry point for the calendar application. This component
 * demonstrates separation of concerns by delegating to specific
 * pattern implementations through the factory pattern.
 */
interface CalendarAppProps {
  pattern?: CalendarPattern;
}

const CalendarApp: React.FC<CalendarAppProps> = ({ pattern = "compound" }) => {
  return <CalendarAppFactory pattern={pattern} />;
};

export default CalendarApp;
