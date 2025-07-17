export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  color: 'blue' | 'green' | 'red' | 'purple' | 'orange';
  allDay?: boolean;
}

export type CalendarView = 'month' | 'week' | 'day';

export interface CalendarState {
  currentDate: Date;
  currentView: CalendarView;
  events: CalendarEvent[];
  selectedDate: Date | null;
  isEventModalOpen: boolean;
  editingEvent: CalendarEvent | null;
}