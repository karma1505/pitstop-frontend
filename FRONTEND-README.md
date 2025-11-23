# PitStop Frontend

A comprehensive React Native mobile application for garage management, built with Expo and TypeScript. This app empowers garage owners to manage their business operations on-the-go.

## 🎯 Overview

PitStop Frontend is a production-ready mobile application that provides garage owners with complete control over their business operations including customer management, staff coordination, financial tracking, and service management. Built with React Native and Expo for cross-platform compatibility (iOS & Android).

## 🏗️ Architecture

### Technology Stack

- **Framework**: React Native 0.81.0
- **Platform**: Expo 54.0.0
- **Language**: TypeScript 5.8.3
- **UI Library**: React 19.1.0
- **State Management**: React Context API
- **Storage**: AsyncStorage
- **Navigation**: Custom navigation system
- **Icons**: Expo Vector Icons
- **Haptics**: Expo Haptics

### Project Structure

```
pitstop-frontend/
├── App.tsx                          # Root app component wrapper
├── index.ts                         # Entry point
├── src/
│   ├── App.tsx                      # Main app logic and navigation
│   ├── api/                         # API integration layer
│   │   ├── client/                  # API client configuration
│   │   ├── services/                # Service-specific API calls
│   │   ├── types/                   # API type definitions
│   │   ├── garageApi.ts             # Main API service class
│   │   └── index.ts
│   ├── assets/                      # Images, fonts, and static files
│   ├── components/                  # Reusable UI components
│   │   ├── forms/                   # Form components
│   │   ├── myGarage/                # Garage-specific components
│   │   ├── onboarding/              # Onboarding components
│   │   ├── AddressDropdown.tsx      # Address selection component
│   │   ├── BackButton.tsx           # Navigation back button
│   │   ├── Button.tsx               # Custom button component
│   │   ├── OTPInput.tsx             # OTP input component
│   │   ├── OTPTimer.tsx             # OTP countdown timer
│   │   └── index.ts
│   ├── context/                     # React Context providers
│   │   ├── AuthContext.tsx          # Authentication state
│   │   ├── OnboardingContext.tsx    # Onboarding flow state
│   │   ├── TabNavigationContext.tsx # Tab navigation state
│   │   ├── ThemeContext.tsx         # Theme (dark/light mode)
│   │   └── index.ts
│   ├── navigation/                  # Navigation configuration
│   ├── screens/                     # Full-screen components
│   │   ├── auth/                    # Authentication screens
│   │   ├── customer/                # Customer management screens
│   │   ├── main/                    # Main app screens
│   │   ├── myGarage/                # Garage management screens
│   │   ├── onboarding/              # Onboarding flow screens
│   │   ├── settings/                # Settings screens
│   │   └── index.ts
│   ├── services/                    # Business logic services
│   │   └── onboardingService.ts     # Onboarding service
│   ├── types/                       # TypeScript type definitions
│   ├── utils/                       # Utility functions
│   │   ├── constants.ts             # App constants
│   │   ├── formatters.ts            # Data formatters
│   │   ├── indianAddressData.ts     # Indian address data
│   │   ├── theme.ts                 # Theme configuration
│   │   ├── validation.ts            # Validation utilities
│   │   ├── validators.ts            # Input validators
│   │   └── index.ts
│   └── README.md
├── package.json
└── tsconfig.json
```

## 🚀 Core Features

### 1. Authentication System
- **Email/Password Login**: Secure login with JWT tokens
- **OTP-based Login**: Alternative login method using phone OTP
- **User Registration**: Complete signup flow with validation
- **Forgot Password**: Password recovery via OTP
- **Password Reset**: Secure password reset flow
- **Change Password**: In-app password change
- **Profile Management**: Update user profile and garage details
- **Auto-login**: Persistent authentication with token refresh
- **Token Validation**: Automatic token validation and refresh

### 2. Onboarding Wizard
Multi-step guided setup for new garage owners:
1. **Welcome Screen**: Introduction to PitStop
2. **Garage Registration**: Business details and location
3. **Payment Configuration**: Setup payment methods
4. **Staff Registration**: Add initial staff members
5. **Completion**: Onboarding success confirmation

Features:
- Step-by-step progress tracking
- Back navigation support
- Data persistence across steps
- Validation at each step
- Skip options where applicable

### 3. Customer Management
- **Customer List**: View all customers with search/filter
- **Customer Details**: Complete customer profile view
- **Add Customer**: Create new customer records
- **Edit Customer**: Update customer information
- **Customer Vehicles**: Associate vehicles with customers
- **Customer History**: View service history

### 4. Settings & Preferences
- **Profile Settings**: Edit personal and garage information
- **Change Password**: Secure password update
- **Theme Toggle**: Switch between light and dark mode
- **Logout**: Secure session termination
- **App Information**: Version and support details

### 5. Theme Support
- **Dark Mode**: Eye-friendly dark theme
- **Light Mode**: Classic light theme
- **System Sync**: Follow device theme (future)
- **Persistent Preference**: Theme choice saved locally

### 6. UI/UX Features
- **Splash Screen**: Branded loading screen
- **Loading States**: Skeleton screens and spinners
- **Error Handling**: User-friendly error messages
- **Form Validation**: Real-time input validation
- **Haptic Feedback**: Touch feedback for interactions
- **Responsive Design**: Adapts to different screen sizes
- **Accessibility**: Screen reader support (future)

## 📋 Prerequisites

- **Node.js** 16 or higher
- **npm** or **pnpm** package manager
- **Expo CLI** (installed globally or via npx)
- **iOS Simulator** (for iOS development on Mac)
- **Android Studio** (for Android development)
- **Physical Device** (optional, for testing)

## ⚙️ Setup Instructions

### 1. Install Dependencies

```bash
# Using npm
npm install

# Using pnpm (recommended)
pnpm install
```

### 2. Configure Backend URL

Update the backend URL in `src/api/garageApi.ts`:

```typescript
const BASE_URL = 'http://YOUR_BACKEND_IP:8080/api/v1';
```

**Important**: 
- For iOS Simulator: Use `http://localhost:8080/api/v1`
- For Android Emulator: Use `http://10.0.2.2:8080/api/v1`
- For Physical Device: Use your computer's local IP (e.g., `http://192.168.1.100:8080/api/v1`)

### 3. Start the Development Server

```bash
# Start Expo development server
npm start
# or
pnpm start

# Start with cache cleared
npm run start:clear

# Start with tunnel (for testing on physical device)
npm run start:tunnel
```

### 4. Run on Device/Simulator

```bash
# iOS (Mac only)
npm run ios

# Android
npm run android

# Web (limited functionality)
npm run web
```

## 📱 App Screens

### Authentication Flow
1. **SplashScreen**: App loading and initialization
2. **LoginScreen**: Email/password or OTP login
3. **SignUpScreen**: New user registration
4. **ForgotPasswordScreen**: Initiate password recovery
5. **OTPVerificationScreen**: Verify OTP code
6. **ResetPasswordScreen**: Set new password
7. **OTPLoginScreen**: Phone-based login

### Main App Flow
1. **HomeScreen**: Dashboard with quick actions
2. **CustomerListScreen**: Browse all customers
3. **CustomerDetailScreen**: View customer details
4. **CustomerFormScreen**: Add/edit customer
5. **SettingsScreen**: App settings and preferences
6. **ChangePasswordScreen**: Update password
7. **EditProfileSettings**: Update profile

### Onboarding Flow
1. **OnboardingWelcomeScreen**: Welcome message
2. **GarageRegistrationScreen**: Garage setup
3. **PaymentConfigurationScreen**: Payment methods
4. **StaffRegistrationScreen**: Add staff
5. **OnboardingCompleteScreen**: Success screen

## 🔌 API Integration

### API Service (`garageApi.ts`)

The app uses a centralized API service class:

```typescript
import { GarageApi } from './api';

// Login
const response = await GarageApi.login({
  email: 'user@example.com',
  password: 'password123'
});

// Register
const response = await GarageApi.register({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  password: 'SecurePass123!',
  // ... other fields
});

// Get customers (authenticated)
const customers = await GarageApi.getCustomers();
```

### Authentication Flow

1. **Login**: User credentials → Backend → JWT token
2. **Token Storage**: Token saved in AsyncStorage
3. **Auto-login**: Token validated on app start
4. **API Requests**: Token sent in Authorization header
5. **Token Refresh**: Automatic refresh when expired

### API Methods

**Authentication**
- `login(credentials)`: Email/password login
- `register(userData)`: User registration
- `forgotPassword(request)`: Send password reset OTP
- `verifyOTP(request)`: Verify OTP code
- `resetPassword(request)`: Reset password with OTP
- `sendLoginOTP(request)`: Send login OTP
- `loginWithOTP(request)`: Login with OTP
- `changePassword(request)`: Change password (authenticated)
- `updateProfile(request)`: Update profile (authenticated)

**Customer Management**
- `getCustomers()`: List all customers
- `getCustomer(id)`: Get customer details
- `createCustomer(data)`: Create customer
- `updateCustomer(id, data)`: Update customer
- `deleteCustomer(id)`: Delete customer

## 🎨 Theming

### Theme Context

The app uses a theme context for consistent styling:

```typescript
import { useTheme } from './context/ThemeContext';

function MyComponent() {
  const { theme, isDark, toggleTheme } = useTheme();
  
  return (
    <View style={{ backgroundColor: theme.background }}>
      <Text style={{ color: theme.text }}>Hello</Text>
    </View>
  );
}
```

### Theme Colors

**Light Mode**
- Background: `#FFFFFF`
- Text: `#000000`
- Primary: `#007AFF`
- Secondary: `#5856D6`

**Dark Mode**
- Background: `#000000`
- Text: `#FFFFFF`
- Primary: `#0A84FF`
- Secondary: `#5E5CE6`

## 🔐 State Management

### Context Providers

1. **AuthContext**: Authentication state and methods
   - `isAuthenticated`: Boolean auth status
   - `user`: Current user data
   - `login()`: Login method
   - `logout()`: Logout method
   - `validateToken()`: Token validation

2. **ThemeContext**: Theme state and toggle
   - `theme`: Current theme object
   - `isDark`: Boolean dark mode status
   - `toggleTheme()`: Switch themes

3. **OnboardingContext**: Onboarding flow state
   - `currentStep`: Current onboarding step
   - `goToNextStep()`: Advance to next step
   - `goToPreviousStep()`: Go back one step
   - `completeOnboarding()`: Mark onboarding complete

4. **TabNavigationContext**: Tab navigation state
   - `activeTab`: Current active tab
   - `setActiveTab()`: Switch tabs

## 🧪 Testing

```bash
# Run tests (when configured)
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- MyComponent.test.tsx
```

## 🔧 Configuration

### TypeScript Configuration

The app uses strict TypeScript settings for type safety:

```json
{
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "jsx": "react-native"
  }
}
```

### Expo Configuration

Key settings in `app.json`:

```json
{
  "expo": {
    "name": "PitStop",
    "slug": "pitstop",
    "version": "1.0.0",
    "orientation": "portrait",
    "platforms": ["ios", "android"]
  }
}
```

## 📦 Key Dependencies

- **@expo/vector-icons**: Icon library
- **@react-native-async-storage/async-storage**: Local storage
- **expo-haptics**: Haptic feedback
- **expo-status-bar**: Status bar control
- **react**: UI library
- **react-native**: Mobile framework

## 🐛 Troubleshooting

### Common Issues

1. **Metro Bundler Issues**
   ```bash
   # Clear cache and restart
   npm run start:clear
   ```

2. **Backend Connection Failed**
   - Verify backend is running
   - Check BASE_URL in `garageApi.ts`
   - Ensure device/simulator can reach backend
   - Check firewall settings

3. **AsyncStorage Errors**
   ```bash
   # Reinstall dependencies
   rm -rf node_modules
   npm install
   ```

4. **Build Errors**
   ```bash
   # Clear Expo cache
   expo start -c
   ```

5. **iOS Simulator Not Opening**
   - Ensure Xcode is installed
   - Open Xcode and accept license
   - Run: `sudo xcode-select --switch /Applications/Xcode.app`

6. **Android Emulator Issues**
   - Ensure Android Studio is installed
   - Create AVD in Android Studio
   - Start emulator before running app

## 📱 Platform-Specific Notes

### iOS
- Requires macOS for development
- Xcode required for simulator
- Physical device testing requires Apple Developer account

### Android
- Works on Windows, macOS, Linux
- Android Studio required for emulator
- Physical device testing via USB debugging

## 🚀 Deployment

### Development Build
```bash
# Create development build
expo build:android
expo build:ios
```

### Production Build
```bash
# Android APK
eas build --platform android

# iOS IPA
eas build --platform ios
```

### App Store Submission
1. Configure `app.json` with proper metadata
2. Create production build
3. Submit to App Store / Play Store

## 📝 Development Guidelines

1. **Component Structure**: Keep components small and focused
2. **TypeScript**: Use proper types, avoid `any`
3. **Naming**: Use descriptive names for variables and functions
4. **State Management**: Use Context for global state
5. **API Calls**: Always handle errors and loading states
6. **Styling**: Use theme context for consistent colors
7. **Validation**: Validate all user inputs
8. **Error Handling**: Show user-friendly error messages

## 🔮 Future Enhancements

- [ ] React Navigation integration
- [ ] Redux/Zustand for complex state management
- [ ] Push notifications
- [ ] Offline mode with data sync
- [ ] Camera integration for photos
- [ ] Barcode/QR code scanning
- [ ] PDF generation for invoices
- [ ] Multi-language support (i18n)
- [ ] Analytics integration
- [ ] Crash reporting (Sentry)
- [ ] Deep linking
- [ ] Biometric authentication
- [ ] In-app messaging
- [ ] Advanced search and filters
- [ ] Data export functionality

## 🎯 Performance Optimization

- **Code Splitting**: Lazy load screens
- **Image Optimization**: Use optimized image formats
- **Memoization**: Use `React.memo` for expensive components
- **List Virtualization**: Use `FlatList` for long lists
- **Debouncing**: Debounce search inputs
- **Caching**: Cache API responses locally

## 📄 License

This project is licensed under the MIT License.

## 👥 Support

For issues and questions, please contact the development team or create an issue in the project repository.

---

**Happy Coding! 🚗💨**
