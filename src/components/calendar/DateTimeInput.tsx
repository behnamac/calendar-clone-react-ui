import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaRegCalendarAlt, FaRegClock } from "react-icons/fa";

interface DateTimeInputProps {
  type: "date" | "time";
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
}

const DateTimeInput: React.FC<DateTimeInputProps> = ({
  type,
  id,
  label,
  value,
  onChange,
  required = false,
  className = "",
}) => {
  const Icon = type === "date" ? FaRegCalendarAlt : FaRegClock;

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          type={type}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="pr-10"
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          onClick={() =>
            (document.getElementById(id) as HTMLInputElement)?.showPicker()
          }
        >
          <Icon className="dark:text-white" />
        </button>
      </div>
    </div>
  );
};

export default DateTimeInput;
