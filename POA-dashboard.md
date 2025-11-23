# Plan of Action: My Garage Dashboard Implementation

## Overview
Transform "My Garage" into a comprehensive dashboard/menu system where users can access all garage management features. When clicking cards on the Home screen, users should navigate to the My Garage tab with the relevant screen, and the bottom navigation bar should remain visible with "My Garage" highlighted as active.

## Current State Analysis

### Existing Components
- **HomeScreen**: Contains data cards (Money Data, Garage Data, Inventory, Jobcard, Revenue Analytics, Customer Data)
- **BottomTab**: 4 tabs - Home, My Garage, Marketplace, Settings
- **Customer Screens**: CustomerListScreen, CustomerFormScreen, CustomerDetailScreen
- **Navigation**: State-based navigation in App.tsx

### Current Issues
1. "My Garage" tab doesn't navigate anywhere (just logs)
2. Clicking cards navigates to full-screen views, hiding the bottom tab
3. No centralized menu/dashboard for accessing all features
4. Bottom tab state is not preserved when navigating from cards

## Vision

### User Flow
1. **Home Screen** → User clicks "Customer Data" card
2. **Navigation** → Switches to "My Garage" tab (bottom tab shows active)
3. **My Garage Dashboard** → Shows Customer Management screen
4. **Bottom Tab** → Remains visible, "My Garage" is highlighted
5. **Navigation** → User can navigate within My Garage or switch tabs

### My Garage Dashboard Structure
```
My Garage Dashboard
├── Header (Garage Name, Quick Stats)
├── Menu Grid (2 columns)
│   ├── Customer Management
│   ├── Vehicle Management
│   ├── Job Cards
│   ├── Inventory
│   ├── Financial Transactions
│   ├── Revenue Analytics
│   ├── Staff Management
│   ├── Appointments
│   └── Reports
└── Bottom Tab (always visible)
```

## Implementation Plan

### Phase 1: Navigation Architecture Refactoring

#### 1.1 Create Tab-Based Navigation System
**Goal**: Implement a tab-based navigation where each tab maintains its own navigation stack

**Changes Required**:
- Create a `TabNavigator` component that manages tab state
- Each tab (Home, My Garage, Marketplace, Settings) has its own navigation context
- Bottom tab remains visible across all screens within a tab

**Files to Create/Modify**:
- `src/navigation/TabNavigator.tsx` - Main tab navigation wrapper
- `src/navigation/MyGarageNavigator.tsx` - Navigation stack for My Garage tab
- `src/context/TabNavigationContext.tsx` - Context for managing active tab and navigation state

#### 1.2 Update App.tsx Navigation Structure
**Current**: Flat screen-based navigation
**New**: Tab-based navigation with nested stacks

**Structure**:
```
App.tsx
├── TabNavigator
    ├── Home Tab → HomeScreen
    ├── My Garage Tab → MyGarageNavigator
    │   ├── MyGarageDashboardScreen (default)
    │   ├── CustomerListScreen
    │   ├── CustomerFormScreen
    │   ├── CustomerDetailScreen
    │   └── [Future screens]
    ├── Marketplace Tab → MarketplaceScreen (placeholder)
    └── Settings Tab → SettingsScreen
```

### Phase 2: My Garage Dashboard Screen

#### 2.1 Create MyGarageDashboardScreen
**Location**: `src/screens/myGarage/MyGarageDashboardScreen.tsx`

**Features**:
- Header with garage name and quick stats
- Grid layout menu (2 columns)
- Each menu item is a card with icon, title, and description
- Clicking a menu item navigates to the corresponding screen
- Bottom tab always visible

**Menu Items** (Initial Implementation):
1. **Customer Management** → Navigate to CustomerListScreen
2. **Vehicle Management** → Navigate to VehicleListScreen (to be created)
3. **Job Cards** → Navigate to JobCardListScreen (to be created)
4. **Inventory** → Navigate to InventoryScreen (to be created)
5. **Financial Transactions** → Navigate to FinancialTransactionScreen (to be created)
6. **Revenue Analytics** → Navigate to RevenueAnalyticsScreen (to be created)
7. **Staff Management** → Navigate to StaffListScreen (to be created)
8. **Appointments** → Navigate to AppointmentsScreen (to be created)
9. **Reports** → Navigate to ReportsScreen (to be created)

**Design**:
- Modern card-based grid layout
- Icons for each menu item
- Quick stats in header (total customers, active jobs, etc.)
- Search functionality (optional, for future)

#### 2.2 Menu Item Component
**Location**: `src/components/myGarage/MenuItemCard.tsx`

**Props**:
- `title`: Menu item title
- `icon`: Icon name
- `description`: Short description
- `onPress`: Navigation handler
- `badge`: Optional notification badge

### Phase 3: Navigation Flow Updates

#### 3.1 HomeScreen Card Navigation
**Current**: Cards navigate directly to screens, hiding bottom tab
**New**: Cards navigate to My Garage tab with specific screen

**Implementation**:
- Update `handleCardPress` in HomeScreen
- Instead of direct navigation, trigger tab switch to "My Garage"
- Pass screen identifier to MyGarageNavigator
- MyGarageNavigator handles routing to the correct screen

**Card → Screen Mapping**:
- Customer Data → My Garage → CustomerListScreen
- Money Data → My Garage → FinancialTransactionScreen
- Garage Data → My Garage → MyGarageDashboardScreen (overview)
- Inventory Data → My Garage → InventoryScreen
- Jobcard Data → My Garage → JobCardListScreen
- Revenue Analytics → My Garage → RevenueAnalyticsScreen

#### 3.2 Bottom Tab State Management
**Requirements**:
- Bottom tab always visible (except during onboarding/auth)
- Active tab highlighted based on current screen
- Tab state persists when navigating within a tab
- Tab switching maintains navigation stack for each tab

**Implementation**:
- Create `TabNavigationContext` to manage:
  - Active tab state
  - Navigation stacks for each tab
  - Tab switching logic
- Update BottomTab component to:
  - Receive active tab from context
  - Handle tab switching
  - Show active state correctly

### Phase 4: Screen Organization

#### 4.1 Create Screen Directories
```
src/screens/
├── main/
│   └── HomeScreen.tsx
├── myGarage/
│   ├── MyGarageDashboardScreen.tsx
│   ├── index.ts
│   └── [Future screens]
├── customer/
│   └── [Existing screens]
├── vehicle/
│   └── [To be created]
├── jobcard/
│   └── [To be created]
└── ...
```

#### 4.2 Update Screen Exports
- Update `src/screens/index.ts` to export all My Garage screens
- Ensure proper organization for future scalability

### Phase 5: Back Navigation Handling

#### 5.1 Back Button Behavior
**Within My Garage Tab**:
- Back button navigates within My Garage stack
- If at root (MyGarageDashboardScreen), back button could:
  - Switch to Home tab, OR
  - Show exit confirmation (optional)

**From Home Screen Cards**:
- User clicks card → Navigate to My Garage tab → Show specific screen
- Back button → Returns to MyGarageDashboardScreen (not Home)
- User can manually switch to Home tab if needed

### Phase 6: Additional Enhancements (Future)

#### 6.1 Quick Actions
- Add floating action button (FAB) on MyGarageDashboardScreen
- Quick actions: Add Customer, Create Job Card, Add Transaction

#### 6.2 Recent Activity
- Show recent items (last 5 customers, recent job cards, etc.)
- Quick access to frequently used items

#### 6.3 Search Functionality
- Global search in My Garage dashboard
- Search across customers, vehicles, job cards

#### 6.4 Favorites/Shortcuts
- Allow users to pin favorite menu items
- Customizable dashboard layout

## Technical Implementation Details

### Navigation Architecture

```typescript
// TabNavigationContext.tsx
interface TabNavigationContextType {
  activeTab: 'home' | 'myGarage' | 'marketplace' | 'settings';
  setActiveTab: (tab: string) => void;
  navigateInMyGarage: (screen: string, params?: any) => void;
  myGarageStack: string[]; // Track navigation stack
}

// MyGarageNavigator.tsx
const MyGarageNavigator = () => {
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [screenParams, setScreenParams] = useState<any>({});
  
  // Handle navigation within My Garage tab
  // Render appropriate screen based on currentScreen state
};
```

### Screen Routing Map

```typescript
const MY_GARAGE_ROUTES = {
  dashboard: MyGarageDashboardScreen,
  customers: CustomerListScreen,
  customerDetail: CustomerDetailScreen,
  customerForm: CustomerFormScreen,
  vehicles: VehicleListScreen, // To be created
  jobcards: JobCardListScreen, // To be created
  inventory: InventoryScreen, // To be created
  financial: FinancialTransactionScreen, // To be created
  revenue: RevenueAnalyticsScreen, // To be created
  staff: StaffListScreen, // To be created
  appointments: AppointmentsScreen, // To be created
  reports: ReportsScreen, // To be created
};
```

### HomeScreen Card Navigation Update

```typescript
const handleCardPress = (cardType: string) => {
  const routeMap = {
    customer: 'customers',
    money: 'financial',
    garage: 'dashboard',
    inventory: 'inventory',
    jobcard: 'jobcards',
    revenue: 'revenue',
  };
  
  const route = routeMap[cardType];
  if (route) {
    // Switch to My Garage tab
    setActiveTab('myGarage');
    // Navigate to specific screen
    navigateInMyGarage(route);
  }
};
```

## File Structure After Implementation

```
pitstop-frontend/src/
├── App.tsx (updated)
├── navigation/
│   ├── TabNavigator.tsx (new)
│   ├── MyGarageNavigator.tsx (new)
│   └── AppNavigator.tsx (existing, may update)
├── context/
│   ├── TabNavigationContext.tsx (new)
│   └── [existing contexts]
├── screens/
│   ├── main/
│   │   └── HomeScreen.tsx (updated)
│   ├── myGarage/
│   │   ├── MyGarageDashboardScreen.tsx (new)
│   │   └── index.ts (new)
│   ├── customer/
│   │   └── [existing screens]
│   └── [other screens]
└── components/
    ├── myGarage/
    │   └── MenuItemCard.tsx (new)
    └── [existing components]
```

## Implementation Steps

### Step 1: Create Tab Navigation Context
- Create `TabNavigationContext.tsx`
- Implement tab state management
- Implement My Garage navigation stack management

### Step 2: Create MyGarageNavigator
- Create `MyGarageNavigator.tsx`
- Implement screen routing logic
- Handle navigation within My Garage tab

### Step 3: Create MyGarageDashboardScreen
- Create dashboard screen with menu grid
- Implement menu items for existing features (Customer Management)
- Add placeholders for future features
- Style with modern card-based layout

### Step 4: Create MenuItemCard Component
- Reusable card component for menu items
- Support for icons, titles, descriptions, badges

### Step 5: Update App.tsx
- Integrate TabNavigator
- Update navigation structure
- Ensure bottom tab is always visible

### Step 6: Update HomeScreen
- Modify `handleCardPress` to navigate to My Garage tab
- Update card navigation logic
- Ensure proper tab switching

### Step 7: Update BottomTab Component
- Make it receive active tab from context
- Ensure it's always rendered (except auth/onboarding)
- Update styling for active state

### Step 8: Update Customer Screens
- Ensure customer screens work within My Garage tab
- Update back navigation to return to MyGarageDashboardScreen
- Test navigation flow

## Design Considerations

### Visual Design
- **My Garage Dashboard**: 
  - Clean, modern grid layout
  - 2-column menu grid for better mobile UX
  - Card-based menu items with icons
  - Header with garage info and quick stats
  - Consistent with existing design system

### User Experience
- **Smooth Transitions**: Tab switching should be smooth
- **State Preservation**: Navigation stack preserved when switching tabs
- **Clear Hierarchy**: Users understand they're in "My Garage" section
- **Easy Access**: All features accessible from one place

### Performance
- **Lazy Loading**: Load screens only when needed
- **State Management**: Efficient state management for tab navigation
- **Memory Management**: Proper cleanup when switching tabs

## Testing Checklist

- [ ] Tab switching works correctly
- [ ] Bottom tab remains visible on all My Garage screens
- [ ] Active tab is highlighted correctly
- [ ] Card clicks from Home navigate to My Garage correctly
- [ ] Back navigation works within My Garage tab
- [ ] Customer screens work within My Garage tab
- [ ] Tab state persists when navigating
- [ ] No navigation stack issues
- [ ] Bottom tab doesn't fade away
- [ ] All menu items navigate correctly

## Future Enhancements

1. **Customizable Dashboard**: Allow users to reorder/hide menu items
2. **Widgets**: Add dashboard widgets (charts, quick stats)
3. **Notifications**: Show notification badges on menu items
4. **Shortcuts**: Quick actions for common tasks
5. **Search**: Global search across all My Garage features
6. **Recent Items**: Show recently accessed items
7. **Favorites**: Pin frequently used features

## Notes

- This implementation maintains the existing design system
- All existing screens (Customer screens) will work within the new navigation
- Bottom tab will be a shared component across all tabs
- Navigation is state-based (no external navigation library required initially)
- Can be extended to use React Navigation in the future if needed

## Questions for Review

1. Should back button from MyGarageDashboardScreen go to Home tab or do nothing? - It should go back to home screen.
2. Should we add a "Home" button in My Garage dashboard header? - No Need as the bottom navigation bar handles it. But if you mean if im deeply nested in some menus, then pressing the MyGarage button again should act like one
3. Do we want quick stats in the My Garage dashboard header? - no quick stats are on Home. We want the whole workflow to be inside My Garage. From Creating Jobcards, managing customers, vehicles all the business needs should be in MyGarage. For quick stats we already have the cards in the Home Page
4. Should menu items show notification badges (e.g., pending job cards count)? - fd thrw./6' ;l
5. Do we want search functionality in the initial implementation?

