import { CalendarEvent } from "../types/calendar";
import { LocalizationData } from "./useLocalization";

interface FormData {
  title: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  allDay: boolean;
  color: CalendarEvent["color"];
}

export const useEventValidation = (
  formData: FormData,
  localization: LocalizationData | null
) => {
  const validateForm = (): { isValid: boolean; errorMessage?: string } => {
    // Validate required fields
    if (!formData.title.trim()) {
      return {
        isValid: false,
        errorMessage:
          localization?.calendar.eventModal.validation.titleRequired,
      };
    }

    if (!formData.startDate) {
      return {
        isValid: false,
        errorMessage:
          localization?.calendar.eventModal.validation.startDateRequired,
      };
    }

    if (!formData.endDate) {
      return {
        isValid: false,
        errorMessage:
          localization?.calendar.eventModal.validation.endDateRequired,
      };
    }

    // For non-all-day events, validate time fields
    if (!formData.allDay) {
      if (!formData.startTime) {
        return {
          isValid: false,
          errorMessage:
            localization?.calendar.eventModal.validation.startTimeRequired,
        };
      }
      if (!formData.endTime) {
        return {
          isValid: false,
          errorMessage:
            localization?.calendar.eventModal.validation.endTimeRequired,
        };
      }
    }

    const startDateTime = formData.allDay
      ? new Date(formData.startDate + "T00:00")
      : new Date(formData.startDate + "T" + formData.startTime);

    const endDateTime = formData.allDay
      ? new Date(formData.endDate + "T23:59")
      : new Date(formData.endDate + "T" + formData.endTime);

    // Validate that end date/time is after start date/time
    if (endDateTime <= startDateTime) {
      return {
        isValid: false,
        errorMessage:
          localization?.calendar.eventModal.validation.endAfterStart,
      };
    }

    return { isValid: true };
  };

  const createEventData = () => {
    const startDateTime = formData.allDay
      ? new Date(formData.startDate + "T00:00")
      : new Date(formData.startDate + "T" + formData.startTime);

    const endDateTime = formData.allDay
      ? new Date(formData.endDate + "T23:59")
      : new Date(formData.endDate + "T" + formData.endTime);

    return {
      title: formData.title.trim(),
      description: formData.description.trim(),
      startDate: startDateTime,
      endDate: endDateTime,
      color: formData.color,
      allDay: formData.allDay,
    };
  };

  return {
    validateForm,
    createEventData,
  };
};
