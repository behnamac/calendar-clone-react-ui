import React from "react";
import { X, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { useEventManagement } from "../../hooks/useEventManagement";
import { useLocalization } from "../../hooks/useLocalization";
import { useEventForm } from "../../hooks/useEventForm";
import { useEventValidation } from "../../hooks/useEventValidation";
import { CalendarEvent } from "../../types/calendar";
import DateTimeInput from "./DateTimeInput";
import ColorPicker from "./ColorPicker";

const EventModal: React.FC = () => {
  const { localization } = useLocalization();
  const {
    isEventModalOpen,
    editingEvent,
    closeEventModal,
    createEvent,
    updateEvent,
    deleteEvent,
  } = useEventManagement();

  const { formData, handleInputChange } = useEventForm(
    editingEvent,
    isEventModalOpen
  );
  const { validateForm, createEventData } = useEventValidation(
    formData,
    localization
  );

  const handleClose = () => {
    closeEventModal();
    // Form will be reset by the useEffect when modal closes
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateForm();
    if (!validation.isValid) {
      alert(validation.errorMessage);
      return;
    }

    const eventData = createEventData();

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
