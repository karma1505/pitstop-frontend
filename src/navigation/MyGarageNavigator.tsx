import React from 'react';
import { useTabNavigation } from '../context/TabNavigationContext';
import MyGarageDashboardScreen from '../screens/myGarage/MyGarageDashboardScreen';
import {
  CustomerListScreen,
  CustomerFormScreen,
  CustomerDetailScreen,
} from '../screens/customer';

interface MyGarageNavigatorProps {
  selectedCustomerId?: string | null;
  onSetSelectedCustomerId?: (id: string | null) => void;
}

export default function MyGarageNavigator({
  selectedCustomerId,
  onSetSelectedCustomerId,
}: MyGarageNavigatorProps) {
  const {
    myGarageScreen,
    goBackInMyGarage,
    myGarageParams,
    navigateInMyGarage,
  } = useTabNavigation();

  const handleNavigateBack = () => {
    goBackInMyGarage();
  };

  const handleNavigateToCustomerDetail = (customerId: string) => {
    if (onSetSelectedCustomerId) {
      onSetSelectedCustomerId(customerId);
    }
    navigateInMyGarage('customerDetail', { customerId });
  };

  const handleNavigateToAddCustomer = () => {
    if (onSetSelectedCustomerId) {
      onSetSelectedCustomerId(null);
    }
    navigateInMyGarage('customerForm');
  };

  const handleNavigateToEditCustomer = (customerId: string) => {
    if (onSetSelectedCustomerId) {
      onSetSelectedCustomerId(customerId);
    }
    navigateInMyGarage('customerForm', { customerId });
  };

  const handleCustomerFormBack = () => {
    goBackInMyGarage();
  };

  const handleCustomerFormSuccess = () => {
    if (onSetSelectedCustomerId) {
      onSetSelectedCustomerId(null);
    }
    navigateInMyGarage('customers');
  };

  const handleCustomerDetailBack = () => {
    goBackInMyGarage();
  };

  const handleCustomerDetailEdit = (customerId: string) => {
    if (onSetSelectedCustomerId) {
      onSetSelectedCustomerId(customerId);
    }
    navigateInMyGarage('customerForm', { customerId });
  };

  switch (myGarageScreen) {
    case 'dashboard':
      return <MyGarageDashboardScreen onNavigateBack={handleNavigateBack} />;

    case 'customers':
      return (
        <CustomerListScreen
          onNavigateBack={handleNavigateBack}
          onNavigateToCustomerDetail={handleNavigateToCustomerDetail}
          onNavigateToAddCustomer={handleNavigateToAddCustomer}
          onNavigateToEditCustomer={handleNavigateToEditCustomer}
        />
      );

    case 'customerForm':
      return (
        <CustomerFormScreen
          customerId={selectedCustomerId || myGarageParams?.customerId || undefined}
          onNavigateBack={handleCustomerFormBack}
          onSaveSuccess={handleCustomerFormSuccess}
        />
      );

    case 'customerDetail':
      return (
        <CustomerDetailScreen
          customerId={selectedCustomerId || myGarageParams?.customerId || ''}
          onNavigateBack={handleCustomerDetailBack}
          onNavigateToEdit={handleCustomerDetailEdit}
        />
      );

    // Placeholder screens for future implementation
    case 'vehicles':
    case 'jobcards':
    case 'inventory':
    case 'financial':
    case 'revenue':
    case 'staff':
    case 'appointments':
    case 'reports':
      return (
        <MyGarageDashboardScreen
          onNavigateBack={handleNavigateBack}
        />
      );

    default:
      return <MyGarageDashboardScreen onNavigateBack={handleNavigateBack} />;
  }
}

