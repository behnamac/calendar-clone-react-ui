import { useState, useEffect } from "react";
import { CalendarEvent } from "../types/calendar";
import { useCalendar } from "../contexts/CalendarContext";

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

export const useEventForm = (
  editingEvent: CalendarEvent | null,
  isModalOpen: boolean
) => {
  const { state } = useCalendar();

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    allDay: false,
    color: "blue",
  });

  // Reset form when modal opens/closes or editingEvent changes
  useEffect(() => {
    if (isModalOpen) {
      if (editingEvent) {
        // Editing existing event - populate form with event data
        const startDate = new Date(editingEvent.startDate);
        const endDate = new Date(editingEvent.endDate);

        setFormData({
          title: editingEvent.title,
          description: editingEvent.description || "",
          startDate: startDate.toISOString().split("T")[0],
          startTime: editingEvent.allDay
            ? ""
            : startDate.toTimeString().slice(0, 5),
          endDate: endDate.toISOString().split("T")[0],
          endTime: editingEvent.allDay
            ? ""
            : endDate.toTimeString().slice(0, 5),
          allDay: editingEvent.allDay || false,
          color: editingEvent.color,
        });
      } else {
        // Creating new event - use selected date if available, otherwise empty values
        const selectedDate = state.selectedDate;
        const startDate = selectedDate
          ? selectedDate.toISOString().split("T")[0]
          : "";
        const endDate = selectedDate
          ? selectedDate.toISOString().split("T")[0]
          : "";

        setFormData({
          title: "",
          description: "",
          startDate: startDate,
          startTime: "",
          endDate: endDate,
          endTime: "",
          allDay: false,
          color: "blue",
        });
      }
    } else {
      // Modal is closed - reset form to empty state
      setFormData({
        title: "",
        description: "",
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        allDay: false,
        color: "blue",
      });
    }
  }, [isModalOpen, editingEvent, state.selectedDate]);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    handleInputChange,
  };
};
