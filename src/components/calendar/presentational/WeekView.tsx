import React from "react";
import EventCard from "./EventCard";
import { CalendarEvent } from "@/types/calendar";
import { LocalizationData } from "@/hooks/useLocalization";

interface WeekEventData extends CalendarEvent {
  topPosition: number;
  height: number;
  leftPosition: number;
  width: number;
}

interface WeekDayData {
  date: Date;
  dayIndex: number;
  events: WeekEventData[];
  allDayEvents: CalendarEvent[];
}

interface WeekViewProps {
  dayNames: string[];
  weekDays: Date[];
  timeSlots: number[];
  currentTimePosition: number | null;
  weekEventsData: WeekDayData[];
  localization: LocalizationData | null;
  onDateClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent, e: React.MouseEvent) => void;
  formatTime: (hour: number) => string;
}

const WeekView: React.FC<WeekViewProps> = ({
  dayNames,
  weekDays,
  timeSlots,
  currentTimePosition,
  weekEventsData,
  localization,
  onDateClick,
  onEventClick,
  formatTime,
}) => {
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Day headers */}
      <div className="grid grid-cols-8 border-b border-calendar-border">
        {/* Time column header */}
        <div className="py-2 lg:py-3 px-2 lg:px-4 text-center text-xs lg:text-sm font-medium text-muted-foreground bg-muted/30 border-r border-calendar-border">
          Time
        </div>

        {/* Day headers */}
        {dayNames.map((day, index) => (
          <div
            key={day}
            className="py-2 lg:py-3 px-1 lg:px-4 text-center text-xs lg:text-sm font-medium text-muted-foreground bg-muted/30"
          >
            <div className="hidden sm:block">{day}</div>
            <div className="sm:hidden">{day.charAt(0)}</div>
            <div className="text-xs text-muted-foreground">
              {weekDays[index]?.getDate()}
            </div>
          </div>
        ))}
      </div>

      {/* Week timeline */}
      <div className="flex-1 overflow-auto">
        <div className="relative">
          {/* Background time slots */}
          {timeSlots.map((hour) => (
            <div
              key={hour}
              className="grid grid-cols-8 border-b border-calendar-border min-h-[60px]"
            >
              {/* Time label */}
              <div className="p-1 lg:p-2 text-xs lg:text-sm text-muted-foreground border-r border-calendar-border bg-muted/20 flex items-center justify-center">
                {formatTime(hour)}
              </div>

              {/* Day columns */}
              {weekDays.map((date, dayIndex) => {
                const isTodayDate =
                  date.toDateString() === new Date().toDateString();
                return (
                  <div
                    key={dayIndex}
                    className={`
                      relative cursor-pointer transition-colors duration-200 hover:bg-calendar-hover
                      ${isTodayDate ? "bg-calendar-today/20" : "bg-background"}
                    `}
                    onClick={() => onDateClick(date)}
                  >
                    {/* Click to add event */}
                    <div
                      className="absolute inset-0 cursor-pointer hover:bg-calendar-hover/50 transition-colors"
                      onClick={() => onDateClick(date)}
                    />
                  </div>
                );
              })}
            </div>
          ))}

          {/* Current time indicator */}
          {currentTimePosition && (
            <div
              className="absolute left-0 right-0 z-10 pointer-events-none"
              style={{ top: `${currentTimePosition}px` }}
            >
              {/* Red line */}
              <div className="h-0.5 bg-red-500 w-full"></div>
              {/* Red circle on the left */}
              <div className="absolute -left-1 lg:-left-2 -top-1.5 w-2 h-2 lg:w-3 lg:h-3 bg-red-500 rounded-full"></div>
            </div>
          )}

          {/* Overlay events with proper positioning */}
          {weekEventsData.map((dayData) =>
            dayData.events.map((event) => (
              <div
                key={`${event.id}-${dayData.dayIndex}`}
                className="absolute cursor-pointer"
                style={{
                  top: `${event.topPosition}px`,
                  left: `${event.leftPosition}%`,
                  width: `${event.width}%`,
                  height: `${event.height}px`,
                }}
                onClick={(e) => onEventClick(event, e)}
              >
                <EventCard
                  event={event}
                  isCompact={false}
                  onClick={(e) => onEventClick(event, e)}
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* All day events */}
      {weekEventsData.some((dayData) => dayData.allDayEvents.length > 0) && (
        <div className="border-t border-calendar-border p-4 bg-muted/20">
          <h3 className="font-medium mb-2">
            {localization?.calendar.dayView.allDayEvents}
          </h3>
          <div className="grid grid-cols-7 gap-2">
            {weekEventsData.map((dayData) => (
              <div key={dayData.dayIndex} className="space-y-1">
                {dayData.allDayEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isCompact={true}
                    onClick={(e) => onEventClick(event, e)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeekView;
