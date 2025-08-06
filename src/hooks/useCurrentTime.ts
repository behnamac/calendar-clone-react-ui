import { useState, useEffect } from "react";

export const useCurrentTime = (updateInterval: number = 60000) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, updateInterval); // Update every minute by default

    return () => clearInterval(timer);
  }, [updateInterval]);

  const getCurrentTimePosition = (isTodayDate: boolean = true) => {
    if (!isTodayDate) return null;

    const now = currentTime;
    const currentHour = now.getHours() + now.getMinutes() / 60;
    return currentHour * 60; // 60px per hour
  };

  return {
    currentTime,
    getCurrentTimePosition,
  };
};
