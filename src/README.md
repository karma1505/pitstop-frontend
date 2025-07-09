# iGarage App - Source Structure

This directory contains the main source code for the iGarage React Native app built with Expo.

## Directory Structure

```
src/
├── components/   # Reusable UI components
│   ├── Button.tsx
│   └── index.ts  # Component exports
├── screens/      # Full screen components
│   ├── HomeScreen.tsx
│   └── index.ts  # Screen exports
├── navigation/   # App navigation setup
│   └── AppNavigator.tsx
├── api/          # API service layer
│   └── garageApi.ts
├── utils/        # Utility functions and constants
│   ├── formatters.ts
│   ├── validators.ts
│   ├── constants.ts
│   └── index.ts  # Utility exports
├── types/        # TypeScript type definitions
│   └── index.ts  # Global types and interfaces
└── App.tsx       # Main app component
```

## Key Features

### Components (`/components`)
- **Reusable UI components** that can be used throughout the app
- Each component is self-contained with its own props interface
- Example: `Button` component with variants, sizes, and states

### Screens (`/screens`)
- **Full-screen components** that represent different app views
- Import and use components from the `/components` directory
- Example: `HomeScreen` with welcome message and action buttons

### Navigation (`/navigation`)
- **App routing and navigation** setup
- Uses React Navigation (install packages as noted in AppNavigator.tsx)
- Centralized navigation configuration

### API (`/api`)
- **Service layer** for backend API communication
- RESTful API methods with error handling
- Example: `GarageApi` class with CRUD operations

### Utils (`/utils`)
- **Utility functions** organized by purpose:
  - `formatters.ts`: Data formatting (currency, dates, phone numbers)
  - `validators.ts`: Input validation functions
  - `constants.ts`: App-wide constants (colors, spacing, API endpoints)

### Types (`/types`)
- **TypeScript interfaces** and type definitions
- Global types used across the application
- Navigation parameter types

## Usage Examples

### Importing Components
```typescript
import { Button } from '../components';
// or
import Button from '../components/Button';
```

### Importing Utilities
```typescript
import { formatCurrency, COLORS, validateEmail } from '../utils';
```

### Importing Types
```typescript
import { Garage, User, ApiResponse } from '../types';
```

## Development Guidelines

1. **Components**: Keep components small and focused on a single responsibility
2. **Screens**: Compose screens using multiple smaller components
3. **Types**: Define interfaces for all data structures
4. **Constants**: Use predefined colors, spacing, and other design tokens
5. **API**: Keep API logic separate from UI components
6. **Utils**: Create reusable functions for common operations

## Next Steps

1. Install navigation dependencies:
   ```bash
   pnpm add @react-navigation/native @react-navigation/stack
   pnpm add react-native-screens react-native-safe-area-context
   ```

2. Add state management (Redux Toolkit, Zustand, or Context API)
3. Implement authentication flow
4. Add more screens and components as needed
5. Set up testing framework (Jest + React Native Testing Library) 