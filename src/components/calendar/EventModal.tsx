import React, { useState, useEffect } from "react";
import { X, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { useEventManagement } from "../../hooks/useEventManagement";
import { CalendarEvent } from "../../types/calendar";
import { generateId } from "../../utils/dateUtils";

const EventModal: React.FC = () => {
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
        // Creating new event - set default values
        const today = new Date().toISOString().split("T")[0];
        setFormData({
          title: "",
          description: "",
          startDate: today,
          startTime: "09:00",
          endDate: today,
          endTime: "10:00",
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
  }, [isEventModalOpen, editingEvent]);

  const handleClose = () => {
    closeEventModal();
    // Form will be reset by the useEffect when modal closes
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.startDate) return;

    const startDateTime = formData.allDay
      ? new Date(formData.startDate + "T00:00")
      : new Date(formData.startDate + "T" + formData.startTime);

    const endDateTime = formData.allDay
      ? new Date(formData.endDate + "T23:59")
      : new Date(formData.endDate + "T" + formData.endTime);

    const eventData = {
      title: formData.title,
      description: formData.description,
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
      <div className="relative bg-background rounded-lg shadow-modal w-full max-w-md mx-4 animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold">
            {editingEvent ? "Edit Event" : "Create Event"}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter event title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter event description (optional)"
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
            <Label htmlFor="allDay">All day event</Label>
          </div>

          {/* Date and time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                type="date"
                id="startDate"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                required
              />
            </div>

            {!formData.allDay && (
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  type="time"
                  id="startTime"
                  value={formData.startTime}
                  onChange={(e) =>
                    handleInputChange("startTime", e.target.value)
                  }
                  required
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                type="date"
                id="endDate"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                required
              />
            </div>

            {!formData.allDay && (
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  type="time"
                  id="endTime"
                  value={formData.endTime}
                  onChange={(e) => handleInputChange("endTime", e.target.value)}
                  required
                />
              </div>
            )}
          </div>

          {/* Color picker */}
          <div className="space-y-2">
            <Label>Event Color</Label>
            <div className="flex gap-2">
              {(
                [
                  "blue",
                  "green",
                  "red",
                  "purple",
                  "orange",
                ] as CalendarEvent["color"][]
              ).map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleInputChange("color", color)}
                  className={`
                    w-8 h-8 rounded-full border-2 transition-all duration-200
                    ${
                      formData.color === color
                        ? "border-foreground scale-110"
                        : "border-transparent hover:scale-105"
                    }
                    ${color === "blue" ? "bg-event-blue" : ""}
                    ${color === "green" ? "bg-event-green" : ""}
                    ${color === "red" ? "bg-event-red" : ""}
                    ${color === "purple" ? "bg-event-purple" : ""}
                    ${color === "orange" ? "bg-event-orange" : ""}
                  `}
                />
              ))}
            </div>
          </div>

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
                  Delete
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-calendar-primary hover:bg-calendar-primary-hover"
              >
                {editingEvent ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
