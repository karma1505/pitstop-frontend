# 🚀 Onboarding Integration Plan

## 📋 Overview

This document outlines the comprehensive plan for integrating the onboarding flow into the PitStop React Native application. The onboarding flow consists of 4 main steps as defined in the backend documentation: User Registration, Garage Registration, Payment Configurations, and Staff Registration.

## 🎯 Objectives

- Implement a seamless onboarding experience for new garage owners
- Follow existing code architecture and design patterns
- Ensure proper state management and navigation flow
- Integrate with all backend APIs as specified in the test sheet
- Maintain code quality and reusability

---     

## 🔧 Components to Reuse

### **Existing Components**
1. **Button.tsx** - Primary and secondary button components
2. **BackButton.tsx** - Navigation back button
3. **OTPInput.tsx** - OTP verification input (if needed for staff verification)
4. **AddressDropdown.tsx** - Address selection components
5. **OTPTimer.tsx** - Timer component for OTP resend functionality

### **New Components to Create**
1. **OnboardingProgress.tsx** - Progress indicator for onboarding steps
2. **PaymentMethodCard.tsx** - Toggle card for payment method selection
3. **StaffRoleCard.tsx** - Card component for staff role selection
4. **FormInput.tsx** - Reusable form input component with validation
5. **StepIndicator.tsx** - Visual step indicator for onboarding flow
6. **OnboardingHeader.tsx** - Header component with step title and progress

---

## 📱 Screens to Create/Reuse

### **Existing Screens to Reuse**
1. **SplashScreen.tsx** - Already exists, will be used for initial loading
2. **LoginScreen.tsx** - For user authentication (Step 1)
3. **SignUpScreen.tsx** - For user registration (Step 1)

### **New Onboarding Screens to Create**
1. **GarageRegistrationScreen.tsx** - Step 2: Garage details and address
2. **PaymentConfigurationScreen.tsx** - Step 3: Payment method selection
3. **StaffRegistrationScreen.tsx** - Step 4: Staff member registration
4. **OnboardingCompleteScreen.tsx** - Final success screen
5. **OnboardingWelcomeScreen.tsx** - Welcome and flow introduction

### **Screen Flow Architecture**
```
SplashScreen → LoginScreen/SignUpScreen → OnboardingWelcomeScreen → 
GarageRegistrationScreen → PaymentConfigurationScreen → 
StaffRegistrationScreen → OnboardingCompleteScreen → HomeScreen
```

---

## 🎨 Theme Guidelines

### **Color Scheme**
- **Primary**: `#007AFF` (iOS Blue) - Main actions and highlights
- **Secondary**: `#6C757D` - Secondary actions and text
- **Success**: `#28A745` - Success states and completion
- **Warning**: `#FFC107` - Warnings and important notices
- **Error**: `#DC3545` - Error states and validation
- **Background**: `#FFFFFF` (Light) / `#121212` (Dark)
- **Surface**: `#F5F5F5` (Light) / `#1E1E1E` (Dark)

### **Typography**
- **Headings**: System font, bold, 24px-32px
- **Body Text**: System font, regular, 16px-18px
- **Labels**: System font, medium, 14px-16px
- **Captions**: System font, regular, 12px-14px

### **Spacing**
- **Container Padding**: 20px
- **Component Spacing**: 16px
- **Input Spacing**: 12px
- **Button Spacing**: 8px

### **Design Principles**
- Clean, minimal interface
- Clear visual hierarchy
- Consistent spacing and alignment
- Accessible color contrast
- Smooth transitions and animations

---

## 🔌 API Integration Requirements

### **Step 1: User Registration**
```typescript
// POST /admin/register
interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  mobileNumber?: string;
}

// POST /admin/login
interface LoginRequest {
  email: string;
  password: string;
}
```

### **Step 2: Garage Registration**
```typescript
// POST /admin/garage
interface GarageRequest {
  garageName: string;
  businessRegistrationNumber?: string;
  gstNumber?: string;
  logoUrl?: string;
  websiteUrl?: string;
  businessHours: string;
  hasBranch: boolean;
}

// POST /admin/addresses
interface AddressRequest {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

// GET /admin/garage/{id}
// PATCH /admin/garage/{id}
// GET /admin/addresses/my-addresses
// PATCH /admin/addresses/{id}
```

### **Step 3: Payment Configurations**
```typescript
// POST /admin/payment-methods
interface PaymentMethodRequest {
  paymentMethod: 'CASH' | 'UPI' | 'CARD' | 'BANK_TRANSFER';
}

// GET /admin/payment-methods/my-payment-methods
// PATCH /admin/payment-methods/{id}/activate
// PATCH /admin/payment-methods/{id}/deactivate
```

### **Step 4: Staff Registration**
```typescript
// POST /admin/staff
interface StaffRequest {
  firstName: string;
  lastName?: string;
  mobileNumber: string;
  aadharNumber?: string;
  role: 'MECHANIC' | 'RECEPTIONIST' | 'MANAGER';
}

// GET /admin/staff
// GET /admin/staff?role=MECHANIC,MANAGER
// PATCH /admin/staff/{id}
// PATCH /admin/staff/{id}/status?status=ACTIVATE|DEACTIVATE
```

### **Onboarding Service APIs**
```typescript
// POST /admin/onboarding/complete
interface CompleteOnboardingRequest {
  garageRequest: GarageRequest;
  addressRequest: AddressRequest;
  paymentMethodRequests: PaymentMethodRequest[];
  staffRequests: StaffRequest[];
}

// GET /admin/onboarding/status
interface OnboardingStatus {
  userId: string;
  hasGarage: boolean;
  hasAddress: boolean;
  hasPaymentMethods: boolean;
  hasStaff: boolean;
  completionPercentage: number;
}

// GET /admin/onboarding/next-step
interface NextStepResponse {
  step: 'GARAGE_REGISTRATION' | 'PAYMENT_CONFIGURATION' | 'STAFF_REGISTRATION' | 'COMPLETED';
  message: string;
  priority: number;
}
```

---

## 🗂️ File Structure Changes

### **New Directories**
```
src/
├── screens/
│   └── onboarding/
│       ├── GarageRegistrationScreen.tsx
│       ├── PaymentConfigurationScreen.tsx
│       ├── StaffRegistrationScreen.tsx
│       ├── OnboardingCompleteScreen.tsx
│       ├── OnboardingWelcomeScreen.tsx
│       └── index.ts
├── components/
│   ├── onboarding/
│   │   ├── OnboardingProgress.tsx
│   │   ├── PaymentMethodCard.tsx
│   │   ├── StaffRoleCard.tsx
│   │   ├── StepIndicator.tsx
│   │   └── OnboardingHeader.tsx
│   └── forms/
│       ├── FormInput.tsx
│       ├── FormValidation.tsx
│       └── FormSubmitButton.tsx
├── services/
│   ├── onboardingService.ts
│   ├── garageService.ts (update existing)
│   ├── paymentService.ts
│   └── staffService.ts
├── types/
│   ├── onboarding.ts
│   ├── garage.ts
│   ├── payment.ts
│   └── staff.ts
└── utils/
    ├── validation.ts
    ├── formatters.ts
    └── constants.ts
```

---

## 🔄 State Management

### **Onboarding Context**
```typescript
interface OnboardingContextType {
  currentStep: number;
  totalSteps: number;
  onboardingData: OnboardingData;
  isComplete: boolean;
  setCurrentStep: (step: number) => void;
  updateOnboardingData: (data: Partial<OnboardingData>) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

interface OnboardingData {
  user: UserData;
  garage: GarageData;
  address: AddressData;
  paymentMethods: PaymentMethodData[];
  staff: StaffData[];
}
```

### **Navigation State**
- Track current onboarding step
- Store form data between steps
- Handle back navigation with data preservation
- Validate step completion before proceeding

---

## 🧹 Redundant/Removable Parts

### **Current App.tsx Changes**
- Remove direct navigation to `HomeScreen` after login
- Add onboarding flow check after authentication
- Update navigation logic to include onboarding steps

### **Existing API Methods**
- **garageService.ts**: Update to match new API structure
- **garageApi.ts**: Refactor to separate concerns (auth vs garage management)
- Remove hardcoded garage creation in registration

### **Screen Modifications**
- **SignUpScreen.tsx**: Remove garage creation logic
- **LoginScreen.tsx**: Add onboarding status check
- **HomeScreen.tsx**: Add onboarding completion check

### **Context Updates**
- **AuthContext.tsx**: Add onboarding status tracking
- Update authentication flow to include onboarding completion

---

## 🚀 Implementation Priority

### **Phase 1: Foundation**
1. Create onboarding context and state management
2. Implement basic navigation flow
3. Create reusable form components
4. Set up API service structure

### **Phase 2: Core Screens**
1. GarageRegistrationScreen
2. PaymentConfigurationScreen
3. StaffRegistrationScreen
4. OnboardingCompleteScreen

### **Phase 3: Integration**
1. Connect with backend APIs
2. Implement form validation
3. Add error handling
4. Test complete flow

### **Phase 4: Polish**
1. Add animations and transitions
2. Implement progress indicators
3. Add offline support
4. Performance optimization

---

## 🧪 Testing Strategy

### **Unit Tests**
- Form validation logic
- API service methods
- Context state management
- Component rendering

### **Integration Tests**
- Complete onboarding flow
- API integration
- Navigation between steps
- Data persistence

### **User Acceptance Tests**
- End-to-end onboarding flow
- Error scenarios
- Edge cases
- Performance testing

---

## 📊 Success Metrics

### **Technical Metrics**
- 100% API integration success rate
- < 2 second screen transition time
- < 5 second API response time
- 0 critical bugs in production

### **User Experience Metrics**
- < 5 minutes to complete onboarding
- > 90% completion rate
- < 3% error rate
- > 4.5/5 user satisfaction score

---

## 🔒 Security Considerations

### **Data Protection**
- Secure storage of sensitive information
- Token-based authentication
- Input validation and sanitization
- HTTPS for all API communications

### **Privacy Compliance**
- GDPR compliance for data collection
- User consent for data processing
- Data retention policies
- Right to data deletion

---

## 📱 Platform Considerations

### **iOS Specific**
- Safe area handling
- iOS-specific UI components
- App Store guidelines compliance
- iOS accessibility features

### **Android Specific**
- Material Design guidelines
- Android-specific UI components
- Back button handling
- Android accessibility features

### **Cross-Platform**
- Responsive design
- Platform-agnostic components
- Consistent user experience
- Performance optimization

---

## 🎯 Next Steps

1. **Review and approve this plan**
2. **Set up development environment**
3. **Create project timeline and milestones**
4. **Begin Phase 1 implementation**
5. **Regular progress reviews and adjustments**

---

*This document serves as the comprehensive guide for implementing the onboarding flow. All development should follow this plan to ensure consistency and quality.*
