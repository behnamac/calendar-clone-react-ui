import React from 'react';
import { CalendarProvider } from '../../contexts/CalendarContext';
import CalendarHeader from './CalendarHeader';
import MonthView from './MonthView';
import EventModal from './EventModal';

const CalendarApp: React.FC = () => {
  return (
    <CalendarProvider>
      <div className="h-screen flex flex-col bg-background">
        <CalendarHeader />
        <div className="flex-1 overflow-hidden">
          <MonthView />
        </div>
        <EventModal />
      </div>
    </CalendarProvider>
  );
};

export default CalendarApp;