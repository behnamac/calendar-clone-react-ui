import { useState, useEffect } from "react";

interface LocalizationData {
  calendar: {
    title: string;
    navigation: {
      today: string;
      previous: string;
      next: string;
      previousArrow: string;
      nextArrow: string;
    };
    views: {
      year: string;
      month: string;
      week: string;
      day: string;
    };
    actions: {
      createEvent: string;
      editEvent: string;
      update: string;
      create: string;
      cancel: string;
      delete: string;
      addEvent: string;
    };
    eventModal: {
      title: string;
      description: string;
      startDate: string;
      startTime: string;
      endDate: string;
      endTime: string;
      allDay: string;
      eventColor: string;
      placeholders: {
        title: string;
        description: string;
      };
      validation: {
        titleRequired: string;
        startDateRequired: string;
        endDateRequired: string;
        startTimeRequired: string;
        endTimeRequired: string;
        endAfterStart: string;
      };
    };
    eventCard: {
      allDay: string;
    };
    dayView: {
      allDayEvents: string;
      eventsToday: string;
      eventsTodayPlural: string;
    };
    months: {
      january: string;
      february: string;
      march: string;
      april: string;
      may: string;
      june: string;
      july: string;
      august: string;
      september: string;
      october: string;
      november: string;
      december: string;
    };
    weekDays: {
      short: string[];
      veryShort: string[];
    };
    errors: {
      calendarContext: string;
    };
    demo: {
      hocView: string;
      totalEvents: string;
    };
    calendarHeader: {
      viewOptions: {
        month: string;
        week: string;
        day: string;
      };
    };
  };
}

export const useLocalization = (locale: string = "en") => {
  const [localization, setLocalization] = useState<LocalizationData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLocalization = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/local/${locale}.json`);
        if (!response.ok) {
          throw new Error(`Failed to load localization for ${locale}`);
        }
        const data = await response.json();
        setLocalization(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load localization"
        );
        // Fallback to default English structure
        setLocalization({
          calendar: {
            title: "Calendar",
            navigation: {
              today: "Today",
              previous: "←",
              next: "→",
              previousArrow: "←",
              nextArrow: "→",
            },
            views: { year: "Year", month: "Month", week: "Week", day: "Day" },
            actions: {
              createEvent: "Create Event",
              editEvent: "Edit Event",
              update: "Update",
              create: "Create",
              cancel: "Cancel",
              delete: "Delete",
              addEvent: "Add Event",
            },
            eventModal: {
              title: "Event Title",
              description: "Description",
              startDate: "Start Date",
              startTime: "Start Time",
              endDate: "End Date",
              endTime: "End Time",
              allDay: "All day event",
              eventColor: "Event Color",
              placeholders: {
                title: "Enter event title",
                description: "Enter event description (optional)",
              },
              validation: {
                titleRequired: "Please enter an event title",
                startDateRequired: "Please select a start date",
                endDateRequired: "Please select an end date",
                startTimeRequired: "Please select a start time",
                endTimeRequired: "Please select an end time",
                endAfterStart: "End date/time must be after start date/time",
              },
            },
            eventCard: { allDay: "All day" },
            dayView: {
              allDayEvents: "All Day Events",
              eventsToday: "event",
              eventsTodayPlural: "events today",
            },
            months: {
              january: "January",
              february: "February",
              march: "March",
              april: "April",
              may: "May",
              june: "June",
              july: "July",
              august: "August",
              september: "September",
              october: "October",
              november: "November",
              december: "December",
            },
            weekDays: {
              short: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
              veryShort: ["S", "M", "T", "W", "T", "F", "S"],
            },
            errors: {
              calendarContext:
                "Calendar components must be used within a Calendar",
            },
            demo: {
              hocView: "HOC Calendar View for",
              totalEvents: "Total Events:",
            },
            calendarHeader: {
              viewOptions: { month: "Month", week: "Week", day: "Day" },
            },
          },
        });
      } finally {
        setLoading(false);
      }
    };

    loadLocalization();
  }, [locale]);

  return { localization, loading, error };
};
