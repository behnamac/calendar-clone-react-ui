import React from "react";
import { Calendar } from "../Calendar";
import CalendarView from "../CalendarView";

/**
 * Compound Components Pattern Example
 * 
 * This component demonstrates the Compound Components pattern where
 * the Calendar component provides sub-components that can be composed
 * together in a declarative way.
 */
const CompoundCalendarApp: React.FC = () => {
  return (
    <Calendar>
      <Calendar.Header />
      <CalendarView />
      <Calendar.EventModal />
    </Calendar>
  );
};

export default CompoundCalendarApp; 