# Screens Directory Structure

This directory contains all the screens for the PitStop app, organized into logical categories for better maintainability and clarity.

## Directory Structure

```
screens/
├── auth/                    # Authentication screens
│   ├── LoginScreen.tsx
│   ├── SignUpScreen.tsx
│   ├── ForgotPasswordScreen.tsx
│   ├── OTPVerificationScreen.tsx
│   ├── OTPLoginScreen.tsx
│   ├── ResetPasswordScreen.tsx
│   ├── ChangePasswordScreen.tsx
│   └── index.ts
├── main/                    # Main app screens
│   ├── HomeScreen.tsx
│   └── index.ts
├── settings/                # Settings and profile management
│   ├── SettingsScreen.tsx
│   ├── EditProfileSettings.tsx
│   └── index.ts
├── onboarding/              # Onboarding and initial experience
│   ├── SplashScreen.tsx
│   └── index.ts
├── index.ts                 # Main export file
└── README.md               # This file
```

## Categories

### Auth (`/auth`)
Authentication-related screens including login, registration, password management, and OTP flows.

### Main (`/main`)
Core application screens that users interact with after authentication.

### Settings (`/settings`)
User profile management, app settings, and configuration screens.

### Onboarding (`/onboarding`)
Initial app experience screens like splash screen and welcome flows.

## Usage

Import screens from the main index file:
```typescript
import { LoginScreen, HomeScreen, SettingsScreen, SplashScreen } from '../screens';
```

Or import from specific categories:
```typescript
import { LoginScreen, SignUpScreen } from '../screens/auth';
import { HomeScreen } from '../screens/main';
import { SettingsScreen } from '../screens/settings';
import { SplashScreen } from '../screens/onboarding';
``` 