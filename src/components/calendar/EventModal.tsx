import React, { useState, useEffect } from "react";
import { X, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { useEventManagement } from "../../hooks/useEventManagement";
import { useLocalization } from "../../hooks/useLocalization";
import { CalendarEvent } from "../../types/calendar";
import { useCalendar } from "../../contexts/CalendarContext";
import DateTimeInput from "./DateTimeInput";
import ColorPicker from "./ColorPicker";

const EventModal: React.FC = () => {
  const { localization } = useLocalization();
  const { state } = useCalendar();
  const {
    isEventModalOpen,
    editingEvent,
    closeEventModal,
    createEvent,
    updateEvent,
    deleteEvent,
  } = useEventManagement();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    allDay: false,
    color: "blue" as CalendarEvent["color"],
  });

  // Reset form when modal opens/closes or editingEvent changes
  useEffect(() => {
    if (isEventModalOpen) {
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
  }, [isEventModalOpen, editingEvent, state.selectedDate]);

  const handleClose = () => {
    closeEventModal();
    // Form will be reset by the useEffect when modal closes
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.title.trim()) {
      alert(localization?.calendar.eventModal.validation.titleRequired);
      return;
    }

    if (!formData.startDate) {
      alert(localization?.calendar.eventModal.validation.startDateRequired);
      return;
    }

    if (!formData.endDate) {
      alert(localization?.calendar.eventModal.validation.endDateRequired);
      return;
    }

    // For non-all-day events, validate time fields
    if (!formData.allDay) {
      if (!formData.startTime) {
        alert(localization?.calendar.eventModal.validation.startTimeRequired);
        return;
      }
      if (!formData.endTime) {
        alert(localization?.calendar.eventModal.validation.endTimeRequired);
        return;
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
      alert(localization?.calendar.eventModal.validation.endAfterStart);
      return;
    }

    const eventData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      startDate: startDateTime,
      endDate: endDateTime,
      color: formData.color,
      allDay: formData.allDay,
    };

    if (editingEvent) {
      const event: CalendarEvent = {
        ...eventData,
        id: editingEvent.id,
      };
      updateEvent(event);
    } else {
      createEvent(eventData);
    }
  };

  const handleDelete = () => {
    if (editingEvent) {
      deleteEvent(editingEvent.id);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!isEventModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-background rounded-lg shadow-modal w-full max-w-md mx-2 sm:mx-4 animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 lg:p-6 border-b border-border">
          <h2 className="text-lg font-semibold">
            {editingEvent
              ? localization?.calendar.actions.editEvent
              : localization?.calendar.actions.createEvent}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 lg:p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              {localization?.calendar.eventModal.title}
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder={localization?.calendar.eventModal.placeholders.title}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              {localization?.calendar.eventModal.description}
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder={
                localization?.calendar.eventModal.placeholders.description
              }
              rows={3}
            />
          </div>

          {/* All day toggle */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="allDay"
              checked={formData.allDay}
              onChange={(e) => handleInputChange("allDay", e.target.checked)}
              className="rounded border-border"
            />
            <Label htmlFor="allDay">
              {localization?.calendar.eventModal.allDay}
            </Label>
          </div>

          {/* Date and time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DateTimeInput
              type="date"
              id="startDate"
              label={localization?.calendar.eventModal.startDate || ""}
              value={formData.startDate}
              onChange={(value) => handleInputChange("startDate", value)}
              required
            />

            {!formData.allDay && (
              <DateTimeInput
                type="time"
                id="startTime"
                label={localization?.calendar.eventModal.startTime || ""}
                value={formData.startTime}
                onChange={(value) => handleInputChange("startTime", value)}
                required
              />
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DateTimeInput
              type="date"
              id="endDate"
              label={localization?.calendar.eventModal.endDate || ""}
              value={formData.endDate}
              onChange={(value) => handleInputChange("endDate", value)}
              required
            />

            {!formData.allDay && (
              <DateTimeInput
                type="time"
                id="endTime"
                label={localization?.calendar.eventModal.endTime || ""}
                value={formData.endTime}
                onChange={(value) => handleInputChange("endTime", value)}
                required
              />
            )}
          </div>

          <ColorPicker
            selectedColor={formData.color}
            onColorChange={(color) => handleInputChange("color", color)}
            label={localization?.calendar.eventModal.eventColor || ""}
          />

          {/* Actions */}
          <div className="flex items-center justify-between pt-4">
            <div>
              {editingEvent && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  {localization?.calendar.actions.delete}
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                {localization?.calendar.actions.cancel}
              </Button>
              <Button
                type="submit"
                className="bg-calendar-primary hover:bg-calendar-primary-hover"
              >
                {editingEvent
                  ? localization?.calendar.actions.update
                  : localization?.calendar.actions.create}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
