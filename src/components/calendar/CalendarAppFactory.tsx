import React from "react";
import CompoundCalendarApp from "./patterns/CompoundCalendarApp";
import ContainerCalendarApp from "./patterns/ContainerCalendarApp";
import { HOCCalendarAppWrapped } from "./patterns/HOCCalendarApp";
import RenderPropsCalendarApp from "./patterns/RenderPropsCalendarApp";

/**
 * Calendar Pattern Types
 */
export type CalendarPattern = "compound" | "container" | "hoc" | "render-props";

/**
 * Calendar App Factory Props
 */
interface CalendarAppFactoryProps {
  pattern: CalendarPattern;
}

/**
 * Calendar App Factory Component
 *
 * This component acts as a factory that can render different calendar
 * implementations based on the specified design pattern. This demonstrates
 * how different patterns can be used to solve the same problem.
 */
const CalendarAppFactory: React.FC<CalendarAppFactoryProps> = ({ pattern }) => {
  switch (pattern) {
    case "compound":
      return <CompoundCalendarApp />;
    case "container":
      return <ContainerCalendarApp />;
    case "hoc":
      return <HOCCalendarAppWrapped />;
    case "render-props":
      return <RenderPropsCalendarApp />;
    default:
      return <CompoundCalendarApp />;
  }
};

export default CalendarAppFactory;
