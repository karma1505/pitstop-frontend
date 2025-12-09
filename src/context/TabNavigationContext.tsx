import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type TabType = 'home' | 'myGarage' | 'marketplace' | 'settings';

export type MyGarageScreenType =
  | 'dashboard'
  | 'customers'
  | 'customerDetail'
  | 'customerForm'
  | 'vehicles'
  | 'vehicleDetail'
  | 'vehicleForm'
  | 'jobcards'
  | 'inventory'
  | 'inventoryDetail'
  | 'inventoryForm'
  | 'financial'
  | 'revenue'
  | 'staff'
  | 'staffDetail'
  | 'staffForm'
  | 'reports';

interface TabNavigationContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  myGarageScreen: MyGarageScreenType;
  myGarageStack: MyGarageScreenType[];
  navigateInMyGarage: (screen: MyGarageScreenType, params?: any) => void;
  goBackInMyGarage: () => void;
  resetMyGarageStack: () => void;
  myGarageParams: any;
}

const TabNavigationContext = createContext<TabNavigationContextType | undefined>(undefined);

interface TabNavigationProviderProps {
  children: ReactNode;
}

export function TabNavigationProvider({ children }: TabNavigationProviderProps) {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [myGarageScreen, setMyGarageScreen] = useState<MyGarageScreenType>('dashboard');
  const [myGarageStack, setMyGarageStack] = useState<MyGarageScreenType[]>(['dashboard']);
  const [myGarageParams, setMyGarageParams] = useState<any>({});

  const navigateInMyGarage = useCallback((screen: MyGarageScreenType, params?: any) => {
    setMyGarageScreen(screen);
    setMyGarageStack(prev => [...prev, screen]);
    if (params) {
      setMyGarageParams(params);
    }
    // Switch to My Garage tab if not already active
    setActiveTab('myGarage');
  }, []);

  const goBackInMyGarage = useCallback(() => {
    setMyGarageStack(prev => {
      if (prev.length > 1) {
        const newStack = prev.slice(0, -1);
        const previousScreen = newStack[newStack.length - 1];
        setMyGarageScreen(previousScreen);
        return newStack;
      }
      // If at root, switch to home tab
      setActiveTab('home');
      return ['dashboard'];
    });
  }, []);

  const resetMyGarageStack = useCallback(() => {
    setMyGarageScreen('dashboard');
    setMyGarageStack(['dashboard']);
    setMyGarageParams({});
  }, []);

  const handleSetActiveTab = useCallback((tab: TabType) => {
    setActiveTab(tab);
    // If switching to My Garage tab and already in My Garage, reset to dashboard if deeply nested
    if (tab === 'myGarage' && myGarageStack.length > 1) {
      resetMyGarageStack();
    }
  }, [myGarageStack.length, resetMyGarageStack]);

  return (
    <TabNavigationContext.Provider
      value={{
        activeTab,
        setActiveTab: handleSetActiveTab,
        myGarageScreen,
        myGarageStack,
        navigateInMyGarage,
        goBackInMyGarage,
        resetMyGarageStack,
        myGarageParams,
      }}
    >
      {children}
    </TabNavigationContext.Provider>
  );
}

export function useTabNavigation() {
  const context = useContext(TabNavigationContext);
  if (context === undefined) {
    throw new Error('useTabNavigation must be used within a TabNavigationProvider');
  }
  return context;
}

