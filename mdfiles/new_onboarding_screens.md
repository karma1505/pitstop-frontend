# New Onboarding Screens Integration Plan

## Overview
This document outlines the integration of the new onboarding APIs with the existing React Native frontend. The onboarding flow will be updated to match the backend API structure from the ONBOARDING_TEST_SHEET.md.

## Current Frontend Structure Analysis

### Existing Screens
- **SplashScreen** (`src/screens/onboarding/SplashScreen.tsx`) - Entry point
- **SignUpScreen** (`src/screens/auth/SignUpScreen.tsx`) - User registration
- **LoginScreen** (`src/screens/auth/LoginScreen.tsx`) - User login
- **HomeScreen** (`src/screens/main/HomeScreen.tsx`) - Main dashboard
- **SettingsScreen** (`src/screens/settings/SettingsScreen.tsx`) - Settings menu
- **EditProfileSettings** (`src/screens/settings/EditProfileSettings.tsx`) - Profile editing

### Existing API Structure
- **ApiClient** (`src/api/client/index.ts`) - Base HTTP client
- **GarageApi** (`src/api/garageApi.ts`) - Main API wrapper
- **AuthService** (`src/api/services/authService.ts`) - Authentication services
- **AuthContext** (`src/context/AuthContext.tsx`) - Authentication state management

## Required Changes

### 1. API Integration Files

#### A. Update `src/api/garageApi.ts`
**Current State**: Contains basic auth and garage operations
**Required Changes**:
- Add new onboarding API endpoints
- Update request/response interfaces
- Add step-by-step onboarding methods

**New APIs to Add**:
```typescript
// User Registration & Login
- register(userData: RegisterRequest): Promise<AuthResponse>
- login(credentials: LoginRequest): Promise<AuthResponse>

// Garage Management
- createGarage(data: CreateGarageRequest): Promise<GarageResponse>
- getGarage(id: string): Promise<GarageResponse>
- updateGarage(id: string, data: CreateGarageRequest): Promise<GarageResponse>

// Address Management
- createAddress(data: CreateAddressRequest): Promise<AddressResponse>
- getMyAddresses(): Promise<AddressResponse[]>
- updateAddress(id: string, data: UpdateAddressRequest): Promise<AddressResponse>
- deleteAddress(id: string): Promise<void>

// Payment Methods
- createPaymentMethod(data: CreatePaymentMethodRequest): Promise<PaymentMethodResponse>
- getMyPaymentMethods(): Promise<PaymentMethodResponse[]>
- deactivatePaymentMethod(id: string): Promise<PaymentMethodResponse>
- activatePaymentMethod(id: string): Promise<PaymentMethodResponse>

// Staff Management
- createStaff(data: CreateStaffRequest): Promise<StaffResponse>
- getAllStaff(page?: number, size?: number, role?: string): Promise<Page<StaffResponse>>
- getStaffById(id: string): Promise<StaffResponse>
- updateStaff(id: string, data: CreateStaffRequest): Promise<StaffResponse>
- updateStaffStatus(id: string, status: string): Promise<StaffResponse>

// Onboarding Status
- getOnboardingStatus(): Promise<OnboardingStatusResponse>
- getNextStep(): Promise<NextStepResponse>
- completeOnboarding(data: CompleteOnboardingRequest): Promise<OnboardingResponse>
```

#### B. Update `src/api/types/index.ts`
**Current State**: Contains basic auth types
**Required Changes**:
- Add all new DTOs and response types
- Update existing types to match backend structure

**New Types to Add**:
```typescript
// Garage Types
interface CreateGarageRequest {
  garageName: string;
  businessRegistrationNumber: string;
  gstNumber: string;
  logoUrl?: string;
  websiteUrl?: string;
  businessHours?: string;
  hasBranch: boolean;
}

interface GarageResponse {
  id: string;
  garageName: string;
  businessRegistrationNumber: string;
  gstNumber: string;
  logoUrl?: string;
  websiteUrl?: string;
  businessHours?: string;
  hasBranch: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Address Types
interface CreateAddressRequest {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

interface UpdateAddressRequest {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
}

interface AddressResponse {
  id: string;
  garageId: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  createdAt: string;
  updatedAt: string;
}

// Payment Method Types
interface CreatePaymentMethodRequest {
  paymentMethod: 'CASH' | 'UPI' | 'CARD' | 'BANK_TRANSFER';
}

interface PaymentMethodResponse {
  id: string;
  garageId: string;
  paymentMethod: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Staff Types
interface CreateStaffRequest {
  firstName: string;
  lastName: string;
  mobileNumber: string;
  aadharNumber: string;
  role: 'MECHANIC' | 'RECEPTIONIST' | 'MANAGER';
}

interface StaffResponse {
  id: string;
  garageId: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  aadharNumber: string;
  role: string;
  isActive: boolean;
  jobsCompleted?: number;
  createdAt: string;
  updatedAt: string;
}

// Onboarding Types
interface OnboardingStatusResponse {
  userId: string;
  hasGarage: boolean;
  hasAddress: boolean;
  hasPaymentMethods: boolean;
  hasStaff: boolean;
  completionPercentage: number;
}

interface NextStepResponse {
  step: string;
  message: string;
  priority: number;
}

interface CompleteOnboardingRequest {
  garageRequest: CreateGarageRequest;
  addressRequest: CreateAddressRequest;
  paymentMethodRequests: CreatePaymentMethodRequest[];
  staffRequests: CreateStaffRequest[];
}

interface OnboardingResponse {
  success: boolean;
  message: string;
  data?: any;
}

// Pagination Types
interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
```

#### C. Update `src/api/services/`
**Current State**: Basic auth and garage services
**Required Changes**:
- Create new service files for each domain
- Add comprehensive service methods

**New Service Files**:
```typescript
// src/api/services/onboardingService.ts
- getOnboardingStatus()
- getNextStep()
- completeOnboarding()

// src/api/services/garageService.ts (update existing)
- createGarage()
- getGarage()
- updateGarage()

// src/api/services/addressService.ts (new)
- createAddress()
- getMyAddresses()
- updateAddress()
- deleteAddress()

// src/api/services/paymentMethodService.ts (new)
- createPaymentMethod()
- getMyPaymentMethods()
- deactivatePaymentMethod()
- activatePaymentMethod()

// src/api/services/staffService.ts (new)
- createStaff()
- getAllStaff()
- getStaffById()
- updateStaff()
- updateStaffStatus()
```

### 2. Context Updates

#### A. Update `src/context/AuthContext.tsx`
**Current State**: Basic auth state management
**Required Changes**:
- Add onboarding state management
- Add garage, address, payment, staff state
- Add onboarding progress tracking
- Add step-by-step navigation methods

**New State Properties**:
```typescript
interface AuthContextType {
  // Existing properties...
  
  // Onboarding state
  onboardingStatus: OnboardingStatusResponse | null;
  currentStep: string;
  completionPercentage: number;
  
  // Entity states
  garage: GarageResponse | null;
  addresses: AddressResponse[];
  paymentMethods: PaymentMethodResponse[];
  staff: StaffResponse[];
  
  // Onboarding methods
  getOnboardingStatus: () => Promise<void>;
  getNextStep: () => Promise<void>;
  completeOnboarding: (data: CompleteOnboardingRequest) => Promise<void>;
  
  // Entity methods
  createGarage: (data: CreateGarageRequest) => Promise<void>;
  createAddress: (data: CreateAddressRequest) => Promise<void>;
  createPaymentMethod: (data: CreatePaymentMethodRequest) => Promise<void>;
  createStaff: (data: CreateStaffRequest) => Promise<void>;
  
  // Update methods
  updateGarage: (id: string, data: CreateGarageRequest) => Promise<void>;
  updateAddress: (id: string, data: UpdateAddressRequest) => Promise<void>;
  updateStaff: (id: string, data: CreateStaffRequest) => Promise<void>;
  updateStaffStatus: (id: string, status: string) => Promise<void>;
  
  // Delete methods
  deleteAddress: (id: string) => Promise<void>;
  deactivatePaymentMethod: (id: string) => Promise<void>;
  activatePaymentMethod: (id: string) => Promise<void>;
}
```

### 3. Screen Updates

#### A. Update `src/screens/onboarding/SplashScreen.tsx`
**Current State**: Basic splash screen
**Required Changes**:
- Add onboarding status check
- Navigate to appropriate step based on progress
- Add loading states for API calls

#### B. Update `src/screens/auth/SignUpScreen.tsx`
**Current State**: Basic user registration
**Required Changes**:
- Update to match new registration API
- Add validation for new fields
- Handle registration response properly
- Navigate to onboarding flow after registration

#### C. Update `src/screens/auth/LoginScreen.tsx`
**Current State**: Basic login
**Required Changes**:
- Update to match new login API
- Check onboarding status after login
- Navigate to appropriate screen based on onboarding progress

#### D. Update `src/screens/main/HomeScreen.tsx`
**Current State**: Basic dashboard
**Required Changes**:
- Add onboarding progress indicator
- Add quick actions for incomplete steps
- Show garage information if available
- Add navigation to onboarding steps

### 4. New Screens to Create

#### A. Create `src/screens/onboarding/GarageSetupScreen.tsx`
**Purpose**: Garage creation and configuration
**Features**:
- Form for garage details
- Business registration number input
- GST number input
- Logo upload (future)
- Website URL input
- Business hours configuration
- Branch setup option

#### B. Create `src/screens/onboarding/AddressSetupScreen.tsx`
**Purpose**: Address creation and management
**Features**:
- Address form with validation
- City/state/pincode selection
- Multiple address support
- Address editing capabilities

#### C. Create `src/screens/onboarding/PaymentSetupScreen.tsx`
**Purpose**: Payment method configuration
**Features**:
- Payment method selection (CASH, UPI, CARD, BANK_TRANSFER)
- Multiple payment method support
- Activate/deactivate payment methods
- Payment method management

#### D. Create `src/screens/onboarding/StaffSetupScreen.tsx`
**Purpose**: Staff registration and management
**Features**:
- Staff registration form
- Role selection (MECHANIC, RECEPTIONIST, MANAGER)
- Staff list with pagination
- Staff editing and status management
- Staff search and filtering

#### E. Create `src/screens/onboarding/OnboardingProgressScreen.tsx`
**Purpose**: Onboarding progress overview
**Features**:
- Progress indicator
- Step-by-step completion status
- Quick navigation to incomplete steps
- Completion summary

### 5. Navigation Updates

#### A. Update `src/navigation/AppNavigator.tsx`
**Current State**: Basic navigation structure
**Required Changes**:
- Add onboarding flow navigation
- Add conditional navigation based on onboarding status
- Add step-by-step navigation
- Add back navigation support

**New Navigation Structure**:
```typescript
// Onboarding Flow
SplashScreen → LoginScreen/SignUpScreen → OnboardingProgressScreen
OnboardingProgressScreen → {
  GarageSetupScreen,
  AddressSetupScreen,
  PaymentSetupScreen,
  StaffSetupScreen
} → HomeScreen

// Main App Flow
HomeScreen → {
  SettingsScreen,
  EditProfileSettings,
  // Other screens...
}
```

### 6. Component Updates

#### A. Update `src/components/AddressDropdown.tsx`
**Current State**: Basic dropdown component
**Required Changes**:
- Add support for address selection
- Add address creation option
- Add address editing capabilities

#### B. Create `src/components/OnboardingProgress.tsx`
**Purpose**: Visual progress indicator
**Features**:
- Step completion indicators
- Progress percentage
- Step labels and descriptions
- Interactive step navigation

#### C. Create `src/components/EntityCard.tsx`
**Purpose**: Display entity information
**Features**:
- Garage information display
- Address information display
- Payment method display
- Staff information display

### 7. Utility Updates

#### A. Update `src/utils/validators.ts`
**Current State**: Basic validation functions
**Required Changes**:
- Add GST number validation
- Add business registration number validation
- Add Aadhar number validation
- Add enhanced phone number validation

#### B. Update `src/utils/constants.ts`
**Current State**: Basic constants
**Required Changes**:
- Add onboarding step constants
- Add API endpoint constants
- Add validation constants
- Add error message constants

## Implementation Priority

### Phase 1: Core API Integration
1. Update API types and interfaces
2. Update ApiClient and GarageApi
3. Create new service files
4. Update AuthContext with onboarding state

### Phase 2: Basic Onboarding Flow
1. Update SplashScreen with onboarding check
2. Update SignUpScreen and LoginScreen
3. Create OnboardingProgressScreen
4. Update navigation structure

### Phase 3: Entity Setup Screens
1. Create GarageSetupScreen
2. Create AddressSetupScreen
3. Create PaymentSetupScreen
4. Create StaffSetupScreen

### Phase 4: Enhanced Features
1. Add progress indicators
2. Add validation and error handling
3. Add offline support
4. Add data persistence

### Phase 5: Polish and Testing
1. Add loading states
2. Add error boundaries
3. Add comprehensive testing
4. Performance optimization

## File Structure After Changes

```
src/
├── api/
│   ├── client/
│   │   └── index.ts (updated)
│   ├── garageApi.ts (updated)
│   ├── services/
│   │   ├── authService.ts (updated)
│   │   ├── garageService.ts (updated)
│   │   ├── addressService.ts (new)
│   │   ├── paymentMethodService.ts (new)
│   │   ├── staffService.ts (new)
│   │   └── onboardingService.ts (new)
│   └── types/
│       └── index.ts (updated)
├── context/
│   └── AuthContext.tsx (updated)
├── screens/
│   ├── onboarding/
│   │   ├── SplashScreen.tsx (updated)
│   │   ├── OnboardingProgressScreen.tsx (new)
│   │   ├── GarageSetupScreen.tsx (new)
│   │   ├── AddressSetupScreen.tsx (new)
│   │   ├── PaymentSetupScreen.tsx (new)
│   │   └── StaffSetupScreen.tsx (new)
│   ├── auth/
│   │   ├── SignUpScreen.tsx (updated)
│   │   └── LoginScreen.tsx (updated)
│   └── main/
│       └── HomeScreen.tsx (updated)
├── components/
│   ├── AddressDropdown.tsx (updated)
│   ├── OnboardingProgress.tsx (new)
│   └── EntityCard.tsx (new)
├── utils/
│   ├── validators.ts (updated)
│   └── constants.ts (updated)
└── navigation/
    └── AppNavigator.tsx (updated)
```

## Testing Strategy

### Unit Tests
- API service methods
- Validation functions
- Context state management
- Component rendering

### Integration Tests
- API integration
- Navigation flow
- State management
- Error handling

### E2E Tests
- Complete onboarding flow
- User registration and login
- Entity creation and management
- Error scenarios

## Success Criteria

1. ✅ All onboarding APIs are integrated and functional
2. ✅ Step-by-step onboarding flow works correctly
3. ✅ Data persistence and state management work properly
4. ✅ Error handling and validation are comprehensive
5. ✅ UI/UX is consistent with existing design
6. ✅ Performance is optimized for mobile devices
7. ✅ Code follows existing architectural patterns
8. ✅ Comprehensive testing coverage
9. ✅ Documentation is complete and up-to-date
10. ✅ Backward compatibility is maintained
