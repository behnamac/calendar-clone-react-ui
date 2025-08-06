export const useTimeFormatting = () => {
  const formatTime = (hour: number) => {
    if (hour === 0) return "12 AM";
    if (hour === 12) return "12 PM";
    if (hour > 12) return `${hour - 12} PM`;
    return `${hour} AM`;
  };

  const generateTimeSlots = (startHour: number = 0, endHour: number = 23) => {
    const timeSlots = [];
    for (let hour = startHour; hour <= endHour; hour++) {
      timeSlots.push(hour);
    }
    return timeSlots;
  };

  return {
    formatTime,
    generateTimeSlots,
  };
};
