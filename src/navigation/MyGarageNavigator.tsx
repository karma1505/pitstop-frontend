import React from 'react';
import { useTabNavigation } from '../context/TabNavigationContext';
import MyGarageDashboardScreen from '../screens/myGarage/MyGarageDashboardScreen';
import {
  CustomerListScreen,
  CustomerFormScreen,
  CustomerDetailScreen,
} from '../screens/customer';
import {
  StaffListScreen,
  StaffDetailScreen,
  StaffFormScreen,
} from '../screens/staff';
import {
  VehicleListScreen,
  VehicleDetailScreen,
  VehicleFormScreen,
} from '../screens/vehicle';

interface MyGarageNavigatorProps {
  selectedCustomerId?: string | null;
  onSetSelectedCustomerId?: (id: string | null) => void;
  selectedStaffId?: string | null;
  onSetSelectedStaffId?: (id: string | null) => void;
  selectedVehicleId?: string | null;
  onSetSelectedVehicleId?: (id: string | null) => void;
}

export default function MyGarageNavigator({
  selectedCustomerId,
  onSetSelectedCustomerId,
  selectedStaffId,
  onSetSelectedStaffId,
  selectedVehicleId,
  onSetSelectedVehicleId,
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

  const handleNavigateToStaffDetail = (staffId: string) => {
    if (onSetSelectedStaffId) {
      onSetSelectedStaffId(staffId);
    }
    navigateInMyGarage('staffDetail', { staffId });
  };

  const handleNavigateToAddStaff = () => {
    if (onSetSelectedStaffId) {
      onSetSelectedStaffId(null);
    }
    navigateInMyGarage('staffForm');
  };

  const handleNavigateToEditStaff = (staffId: string) => {
    if (onSetSelectedStaffId) {
      onSetSelectedStaffId(staffId);
    }
    navigateInMyGarage('staffForm', { staffId });
  };

  const handleStaffDetailBack = () => {
    goBackInMyGarage();
  };

  const handleStaffDetailEdit = (staffId: string) => {
    if (onSetSelectedStaffId) {
      onSetSelectedStaffId(staffId);
    }
    navigateInMyGarage('staffForm', { staffId });
  };

  const handleStaffFormBack = () => {
    goBackInMyGarage();
  };

  const handleStaffFormSuccess = () => {
    if (onSetSelectedStaffId) {
      onSetSelectedStaffId(null);
    }
    navigateInMyGarage('staff');
  };

  const handleNavigateToVehicleDetail = (vehicleId: string) => {
    if (onSetSelectedVehicleId) {
      onSetSelectedVehicleId(vehicleId);
    }
    navigateInMyGarage('vehicleDetail', { vehicleId });
  };

  const handleNavigateToAddVehicle = () => {
    if (onSetSelectedVehicleId) {
      onSetSelectedVehicleId(null);
    }
    navigateInMyGarage('vehicleForm');
  };

  const handleNavigateToEditVehicle = (vehicleId: string) => {
    if (onSetSelectedVehicleId) {
      onSetSelectedVehicleId(vehicleId);
    }
    navigateInMyGarage('vehicleForm', { vehicleId });
  };

  const handleVehicleDetailBack = () => {
    goBackInMyGarage();
  };

  const handleVehicleDetailEdit = (vehicleId: string) => {
    if (onSetSelectedVehicleId) {
      onSetSelectedVehicleId(vehicleId);
    }
    navigateInMyGarage('vehicleForm', { vehicleId });
  };

  const handleVehicleFormBack = () => {
    goBackInMyGarage();
  };

  const handleVehicleFormSuccess = () => {
    if (onSetSelectedVehicleId) {
      onSetSelectedVehicleId(null);
    }
    navigateInMyGarage('vehicles');
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

    case 'staff':
      return (
        <StaffListScreen
          onNavigateBack={handleNavigateBack}
          onNavigateToStaffDetail={handleNavigateToStaffDetail}
          onNavigateToAddStaff={handleNavigateToAddStaff}
          onNavigateToEditStaff={handleNavigateToEditStaff}
        />
      );

    case 'staffDetail':
      return (
        <StaffDetailScreen
          staffId={selectedStaffId || myGarageParams?.staffId || ''}
          onNavigateBack={handleStaffDetailBack}
          onNavigateToEdit={handleStaffDetailEdit}
        />
      );

    case 'staffForm':
      return (
        <StaffFormScreen
          staffId={selectedStaffId || myGarageParams?.staffId || undefined}
          onNavigateBack={handleStaffFormBack}
          onSaveSuccess={handleStaffFormSuccess}
        />
      );

    case 'vehicles':
      return (
        <VehicleListScreen
          onNavigateBack={handleNavigateBack}
          onNavigateToVehicleDetail={handleNavigateToVehicleDetail}
          onNavigateToAddVehicle={handleNavigateToAddVehicle}
          onNavigateToEditVehicle={handleNavigateToEditVehicle}
        />
      );

    case 'vehicleDetail':
      return (
        <VehicleDetailScreen
          vehicleId={selectedVehicleId || myGarageParams?.vehicleId || ''}
          onNavigateBack={handleVehicleDetailBack}
          onNavigateToEdit={handleVehicleDetailEdit}
        />
      );

    case 'vehicleForm':
      return (
        <VehicleFormScreen
          vehicleId={selectedVehicleId || myGarageParams?.vehicleId || undefined}
          onNavigateBack={handleVehicleFormBack}
          onSaveSuccess={handleVehicleFormSuccess}
        />
      );

    // Placeholder screens for future implementation
    case 'jobcards':
    case 'inventory':
    case 'financial':
    case 'revenue':
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

