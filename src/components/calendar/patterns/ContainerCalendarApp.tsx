import React from "react";
import { CalendarContainer } from "../containers/CalendarContainer";

/**
 * Container/Presentational Pattern Example
 * 
 * This component demonstrates the Container/Presentational pattern where
 * the CalendarContainer handles all the business logic and state management,
 * while the presentational components focus only on rendering.
 */
const ContainerCalendarApp: React.FC = () => {
  return <CalendarContainer />;
};

export default ContainerCalendarApp; 