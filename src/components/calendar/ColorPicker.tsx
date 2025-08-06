import React from "react";
import { Label } from "../ui/label";
import { CalendarEvent } from "../../types/calendar";

interface ColorPickerProps {
  selectedColor: CalendarEvent["color"];
  onColorChange: (color: CalendarEvent["color"]) => void;
  label: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColor,
  onColorChange,
  label,
}) => {
  const colors: CalendarEvent["color"][] = [
    "blue",
    "green",
    "red",
    "purple",
    "orange",
  ];

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onColorChange(color)}
            className={`
              w-8 h-8 rounded-full border-2 transition-all duration-200
              ${
                selectedColor === color
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
  );
};

export default ColorPicker;
