# Calendar Component Patterns - Separation of Concerns

This directory contains different implementations of the calendar application using various React design patterns, demonstrating proper separation of concerns.

## Design Patterns Implemented

### 1. Compound Components Pattern (`CompoundCalendarApp.tsx`)
**Purpose**: Demonstrates how to create flexible, composable components
- **Concerns**: Component composition and declarative API
- **Benefits**: 
  - Highly flexible and customizable
  - Clear component hierarchy
  - Easy to understand and use

```tsx
<Calendar>
  <Calendar.Header />
  <CalendarView />
  <Calendar.EventModal />
</Calendar>
```

### 2. Container/Presentational Pattern (`ContainerCalendarApp.tsx`)
**Purpose**: Separates business logic from presentation
- **Concerns**: 
  - Container: State management and business logic
  - Presentational: Pure UI rendering
- **Benefits**:
  - Clear separation of responsibilities
  - Easy to test components in isolation
  - Reusable presentational components

### 3. Higher-Order Component Pattern (`HOCCalendarApp.tsx`)
**Purpose**: Enhances components with additional functionality
- **Concerns**: 
  - HOC: Logic injection and state management
  - Component: Pure rendering with injected props
- **Benefits**:
  - Reusable logic across components
  - Clean component interfaces
  - Easy to compose multiple HOCs

### 4. Render Props Pattern (`RenderPropsCalendarApp.tsx`)
**Purpose**: Shares code between components using a prop whose value is a function
- **Concerns**: 
  - Provider: State and logic management
  - Consumer: Rendering with provided data
- **Benefits**:
  - Maximum flexibility
  - No prop drilling
  - Dynamic rendering control

## Architecture Overview

```
CalendarApp.tsx (Main Entry Point)
├── CalendarAppFactory.tsx (Pattern Selector)
├── patterns/
│   ├── CompoundCalendarApp.tsx
│   ├── ContainerCalendarApp.tsx
│   ├── HOCCalendarApp.tsx
│   └── RenderPropsCalendarApp.tsx
└── index.ts (Exports)
```

## Separation of Concerns Benefits

### 1. **Single Responsibility Principle**
Each component has one clear purpose:
- `CompoundCalendarApp`: Component composition
- `ContainerCalendarApp`: Business logic separation
- `HOCCalendarApp`: Logic injection
- `RenderPropsCalendarApp`: Dynamic rendering

### 2. **Maintainability**
- Easy to modify individual patterns without affecting others
- Clear boundaries between different concerns
- Isolated testing for each pattern

### 3. **Reusability**
- Each pattern can be used independently
- Components can be mixed and matched
- Easy to extend with new patterns

### 4. **Testability**
- Each pattern can be tested in isolation
- Clear interfaces make mocking easier
- Business logic separated from UI logic

## Usage Examples

### Using Different Patterns

```tsx
// Compound Components
<CalendarApp pattern="compound" />

// Container/Presentational
<CalendarApp pattern="container" />

// Higher-Order Component
<CalendarApp pattern="hoc" />

// Render Props
<CalendarApp pattern="render-props" />
```

### Direct Pattern Usage

```tsx
import { 
  CompoundCalendarApp,
  ContainerCalendarApp,
  HOCCalendarAppWrapped,
  RenderPropsCalendarApp 
} from './patterns';

// Use specific patterns directly
<CompoundCalendarApp />
<ContainerCalendarApp />
<HOCCalendarAppWrapped />
<RenderPropsCalendarApp />
```

## Best Practices Demonstrated

1. **Interface Segregation**: Each pattern has its own focused interface
2. **Dependency Inversion**: Components depend on abstractions, not concretions
3. **Open/Closed Principle**: Easy to add new patterns without modifying existing code
4. **Composition over Inheritance**: Uses composition to achieve flexibility

## When to Use Each Pattern

- **Compound Components**: When you need flexible, composable UI
- **Container/Presentational**: When you want clear separation of logic and UI
- **HOC**: When you need to share logic across multiple components
- **Render Props**: When you need maximum flexibility in rendering

This implementation demonstrates how different design patterns can solve the same problem while maintaining clean separation of concerns. 