# Localization System

This directory contains localization files for the calendar application. The system supports multiple languages through JSON files.

## Structure

Each language file should follow this structure:
- `en.json` - English (default)
- `es.json` - Spanish
- `fr.json` - French (example)
- etc.

## File Format

Each localization file should contain a JSON object with the following structure:

```json
{
  "calendar": {
    "title": "Calendar",
    "navigation": {
      "today": "Today",
      "previous": "←",
      "next": "→"
    },
    "views": {
      "year": "Year",
      "month": "Month",
      "week": "Week", 
      "day": "Day"
    },
    "actions": {
      "createEvent": "Create Event",
      "editEvent": "Edit Event",
      "update": "Update",
      "create": "Create",
      "cancel": "Cancel",
      "delete": "Delete",
      "addEvent": "Add Event"
    },
    "eventModal": {
      "title": "Event Title",
      "description": "Description",
      "startDate": "Start Date",
      "startTime": "Start Time",
      "endDate": "End Date",
      "endTime": "End Time", 
      "allDay": "All day event",
      "eventColor": "Event Color",
      "placeholders": {
        "title": "Enter event title",
        "description": "Enter event description (optional)"
      },
      "validation": {
        "titleRequired": "Please enter an event title",
        "startDateRequired": "Please select a start date",
        "endDateRequired": "Please select an end date",
        "startTimeRequired": "Please select a start time",
        "endTimeRequired": "Please select an end time",
        "endAfterStart": "End date/time must be after start date/time"
      }
    },
    "eventCard": {
      "allDay": "All day"
    },
    "dayView": {
      "allDayEvents": "All Day Events",
      "eventsToday": "event",
      "eventsTodayPlural": "events today"
    },
    "months": {
      "january": "January",
      "february": "February",
      "march": "March",
      "april": "April",
      "may": "May",
      "june": "June",
      "july": "July",
      "august": "August",
      "september": "September",
      "october": "October",
      "november": "November",
      "december": "December"
    },
    "weekDays": {
      "short": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      "veryShort": ["S", "M", "T", "W", "T", "F", "S"]
    },
    "errors": {
      "calendarContext": "Calendar components must be used within a Calendar"
    },
    "demo": {
      "hocView": "HOC Calendar View for",
      "totalEvents": "Total Events:"
    }
  }
}
```

## Usage

To use a different language, pass the locale code to the `useLocalization` hook:

```tsx
import { useLocalization } from '../../hooks/useLocalization';

const MyComponent = () => {
  const { localization } = useLocalization('es'); // For Spanish
  // or
  const { localization } = useLocalization(); // Defaults to 'en'
  
  return <div>{localization?.calendar.title}</div>;
};
```

## Adding New Languages

1. Create a new JSON file in this directory (e.g., `fr.json`)
2. Copy the structure from `en.json`
3. Translate all the text values to the target language
4. Update the locale code in your components to use the new language

## Fallback

If a localization file fails to load, the system will fall back to the default English text to ensure the application continues to work.

## Available Languages

- English (`en.json`) - Default
- Spanish (`es.json`) - Available
- Add more languages as needed 