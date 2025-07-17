# React Design Patterns in Calendar Application

This document outlines the React design patterns implemented in the refactored calendar application. The refactoring demonstrates modern React best practices and design patterns for better code organization, reusability, and maintainability.

## Table of Contents

1. [Custom Hooks Pattern](#custom-hooks-pattern)
2. [Provider Pattern](#provider-pattern)
3. [Compound Components Pattern](#compound-components-pattern)
4. [Render Props Pattern](#render-props-pattern)
5. [Higher-Order Components (HOC) Pattern](#higher-order-components-hoc-pattern)
6. [Container/Presentational Pattern](#containerpresentational-pattern)
7. [Component Composition Pattern](#component-composition-pattern)

## 1. Custom Hooks Pattern

### Overview

Custom hooks allow us to extract component logic into reusable functions. This pattern promotes code reuse and separation of concerns.

### Implementation

#### `useCalendarState` Hook

```typescript
// src/hooks/useCalendarState.ts
export const useCalendarState = () => {
  const [state, dispatch] = useReducer(calendarReducer, initialState);

  const setCurrentDate = useCallback((date: Date) => {
    dispatch({ type: "SET_CURRENT_DATE", payload: date });
  }, []);

  // ... other actions

  return {
    state,
    actions: {
      setCurrentDate,
      setView,
      addEvent,
      // ... other actions
    },
  };
};
```

#### `useEventManagement` Hook

```typescript
// src/hooks/useEventManagement.ts
export const useEventManagement = () => {
  const { state, actions } = useCalendar();

  const createEvent = useCallback(
    (eventData: Omit<CalendarEvent, "id">) => {
      const newEvent: CalendarEvent = {
        ...eventData,
        id: Date.now().toString(),
      };
      actions.addEvent(newEvent);
      return newEvent;
    },
    [actions]
  );

  // ... other event management functions

  return {
    events: state.events,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventsForDate,
    // ... other functions
  };
};
```

#### `useCalendarNavigation` Hook

```typescript
// src/hooks/useCalendarNavigation.ts
export const useCalendarNavigation = () => {
  const { state, actions } = useCalendar();

  const navigateToToday = useCallback(() => {
    actions.navigateToToday();
  }, [actions]);

  // ... other navigation functions

  return {
    currentDate: state.currentDate,
    currentView: state.currentView,
    navigateToToday,
    navigatePrevious,
    navigateNext,
    // ... other functions
  };
};
```

### Benefits

- **Reusability**: Logic can be shared across multiple components
- **Testability**: Hooks can be tested independently
- **Separation of Concerns**: Business logic is separated from UI logic
- **Performance**: Optimized with `useCallback` and `useMemo`

## 2. Provider Pattern

### Overview

The Provider pattern uses React Context to share state across component trees without prop drilling.

### Implementation

#### Calendar Context

```typescript
// src/contexts/CalendarContext.tsx
interface CalendarContextType {
  state: ReturnType<typeof useCalendarState>["state"];
  actions: ReturnType<typeof useCalendarState>["actions"];
}

const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined
);

export const CalendarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { state, actions } = useCalendarState();

  return (
    <CalendarContext.Provider value={{ state, actions }}>
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error("useCalendar must be used within a CalendarProvider");
  }
  return context;
};
```

### Benefits

- **Global State Management**: Shared state across component tree
- **No Prop Drilling**: Avoid passing props through multiple levels
- **Type Safety**: Full TypeScript support with proper error handling

## 3. Compound Components Pattern

### Overview

Compound components allow you to create a set of components that work together but can be composed flexibly.

### Implementation

#### Calendar Compound Component

```typescript
// src/components/calendar/Calendar.tsx
export const Calendar: React.FC<CalendarProps> & {
  Header: typeof CalendarHeader;
  MonthView: typeof CalendarMonthView;
  EventModal: typeof CalendarEventModal;
} = ({ children }) => {
  return (
    <CalendarProvider>
      <CalendarContext.Provider value={{}}>
        <div className="h-screen flex flex-col bg-background">{children}</div>
      </CalendarContext.Provider>
    </CalendarProvider>
  );
};

// Attach compound components
Calendar.Header = CalendarHeader;
Calendar.MonthView = CalendarMonthView;
Calendar.EventModal = CalendarEventModal;
```

#### Usage

```typescript
// Basic usage
<Calendar>
  <Calendar.Header />
  <Calendar.MonthView />
  <Calendar.EventModal />
</Calendar>

// Custom usage
<Calendar>
  <Calendar.Header>
    <div className="p-4 bg-blue-100">
      <h1>Custom Header</h1>
    </div>
  </Calendar.Header>
  <Calendar.MonthView>
    <div className="p-4 bg-green-100">
      <h2>Custom Month View</h2>
    </div>
  </Calendar.MonthView>
</Calendar>
```

### Benefits

- **Flexibility**: Components can be composed in different ways
- **Customization**: Easy to customize individual parts
- **API Design**: Intuitive and readable component API

## 4. Render Props Pattern

### Overview

Render props allow you to share code between components using a prop whose value is a function.

### Implementation

#### CalendarData Component

```typescript
// src/components/calendar/CalendarData.tsx
interface CalendarDataProps {
  children: (props: {
    currentDate: Date;
    currentView: CalendarView;
    events: CalendarEvent[];
    // ... other props
  }) => React.ReactNode;
}

export const CalendarData: React.FC<CalendarDataProps> = ({ children }) => {
  const { state, actions } = useCalendar();

  return (
    <>
      {children({
        currentDate: state.currentDate,
        currentView: state.currentView,
        events: state.events,
        // ... other props
      })}
    </>
  );
};
```

#### Usage

```typescript
<CalendarData>
  {({
    currentDate,
    currentView,
    events,
    navigateToToday,
    navigatePrevious,
    navigateNext,
    setView,
    openEventModal,
  }) => (
    <div className="h-screen flex flex-col bg-background">
      {/* Custom implementation using the provided props */}
    </div>
  )}
</CalendarData>
```

### Benefits

- **Code Sharing**: Share logic between components
- **Customization**: Full control over rendering
- **Type Safety**: Full TypeScript support

## 5. Higher-Order Components (HOC) Pattern

### Overview

HOCs are functions that take a component and return a new component with additional props.

### Implementation

#### withCalendar HOC

```typescript
// src/components/calendar/withCalendar.tsx
export const withCalendar = <P extends object>(
  Component: React.ComponentType<P & WithCalendarProps>
) => {
  const WithCalendarComponent: React.FC<P> = (props) => {
    const { state, actions } = useCalendar();

    const calendarProps: WithCalendarProps = {
      currentDate: state.currentDate,
      currentView: state.currentView,
      events: state.events,
      // ... other props
    };

    return <Component {...props} {...calendarProps} />;
  };

  WithCalendarComponent.displayName = `withCalendar(${
    Component.displayName || Component.name
  })`;

  return WithCalendarComponent;
};
```

#### Usage

```typescript
const CalendarAppWithHOC: React.FC<CalendarAppWithHOCProps> = ({
  currentDate,
  currentView,
  events,
  navigateToToday,
  // ... other props
}) => {
  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Component implementation */}
    </div>
  );
};

export const CalendarAppWithHOCWrapped = withCalendar(CalendarAppWithHOC);
```

### Benefits

- **Code Reuse**: Share functionality across components
- **Props Injection**: Automatically inject calendar props
- **Composition**: Can be composed with other HOCs

## 6. Container/Presentational Pattern

### Overview

This pattern separates components into containers (logic) and presentational components (UI).

### Implementation

#### Calendar Container

```typescript
// src/components/calendar/containers/CalendarContainer.tsx
export const CalendarContainer: React.FC<CalendarContainerProps> = ({
  children,
}) => {
  const { state, actions } = useCalendar();

  const handleDateClick = (date: Date) => {
    actions.setSelectedDate(date);
    actions.openEventModal();
  };

  const handleEventClick = (event: CalendarEvent) => {
    actions.openEventModal(event);
  };

  // ... other handlers

  // If custom children are provided, render them with the handlers
  if (children) {
    return (
      <div className="h-screen flex flex-col bg-background">
        {React.cloneElement(children as React.ReactElement, {
          currentDate: state.currentDate,
          currentView: state.currentView,
          events: state.events,
          onDateClick: handleDateClick,
          onEventClick: handleEventClick,
          // ... other handlers
        })}
      </div>
    );
  }

  // Default render with existing components
  return (
    <div className="h-screen flex flex-col bg-background">
      <CalendarHeader />
      <div className="flex-1 overflow-hidden">
        <MonthView />
      </div>
      <EventModal />
    </div>
  );
};
```

#### Presentational Component

```typescript
const CustomCalendarView: React.FC<any> = ({
  currentDate,
  events,
  onDateClick,
  onEventClick,
  // ... other props
}) => {
  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Pure UI implementation */}
    </div>
  );
};
```

### Benefits

- **Separation of Concerns**: Logic and UI are separated
- **Testability**: Easy to test logic and UI independently
- **Reusability**: Presentational components can be reused with different containers

## 7. Component Composition Pattern

### Overview

Component composition allows you to build complex UIs from simple, reusable components.

### Implementation

```typescript
export const ComponentCompositionExample: React.FC = () => {
  return (
    <div className="h-screen flex flex-col bg-background">
      <CalendarHeader />
      <CalendarContent />
      <CalendarFooter />
    </div>
  );
};

const CalendarHeader: React.FC = () => {
  const { getCurrentMonthName } = useCalendarNavigation();

  return (
    <div className="border-b border-calendar-border p-4">
      <h1 className="text-2xl font-bold">{getCurrentMonthName()}</h1>
    </div>
  );
};

const CalendarContent: React.FC = () => {
  const { events } = useEventManagement();

  return (
    <div className="flex-1 p-4">
      <h2>Calendar Content</h2>
      <p>Total Events: {events.length}</p>
    </div>
  );
};

const CalendarFooter: React.FC = () => {
  return (
    <div className="border-t border-calendar-border p-4">
      <p className="text-sm text-gray-500">Calendar Footer</p>
    </div>
  );
};
```

### Benefits

- **Modularity**: Components are small and focused
- **Reusability**: Components can be reused in different contexts
- **Maintainability**: Easy to modify individual components

## Usage Examples

All patterns are demonstrated in the `src/examples/DesignPatternsExample.tsx` file. You can import and use any of these examples:

```typescript
import {
  CompoundComponentsExample,
  RenderPropsExample,
  CalendarAppWithHOCWrapped,
  ContainerPresentationalExample,
  CustomHooksExample,
  ComponentCompositionExample,
} from "./examples/DesignPatternsExample";
```

## Best Practices

1. **Choose the Right Pattern**: Use the pattern that best fits your use case
2. **Combine Patterns**: Don't be afraid to combine multiple patterns
3. **Keep Components Small**: Break down complex components into smaller ones
4. **Use TypeScript**: Leverage TypeScript for better type safety
5. **Test Your Patterns**: Write tests for your custom hooks and components
6. **Document Your Patterns**: Document how and when to use each pattern

## Conclusion

This refactored calendar application demonstrates modern React design patterns that promote:

- **Code Reusability**: Through custom hooks and compound components
- **Maintainability**: Through separation of concerns and modular design
- **Flexibility**: Through render props and HOCs
- **Type Safety**: Through comprehensive TypeScript usage
- **Performance**: Through optimized hooks and memoization

These patterns can be applied to other React applications to create more maintainable and scalable codebases.
