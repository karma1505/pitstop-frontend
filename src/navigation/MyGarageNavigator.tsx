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
import {
  InventoryListScreen,
  InventoryDetailScreen,
  InventoryFormScreen,
} from '../screens/inventory';
import {
  ServiceCategoryListScreen,
  ServiceCategoryDetailScreen,
  ServiceCategoryFormScreen,
} from '../screens/serviceCategory';

interface MyGarageNavigatorProps {
  selectedCustomerId?: string | null;
  onSetSelectedCustomerId?: (id: string | null) => void;
  selectedStaffId?: string | null;
  onSetSelectedStaffId?: (id: string | null) => void;
  selectedVehicleId?: string | null;
  onSetSelectedVehicleId?: (id: string | null) => void;
  selectedInventoryId?: string | null;
  onSetSelectedInventoryId?: (id: string | null) => void;
  selectedServiceCategoryId?: string | null;
  onSetSelectedServiceCategoryId?: (id: string | null) => void;
}

export default function MyGarageNavigator({
  selectedCustomerId,
  onSetSelectedCustomerId,
  selectedStaffId,
  onSetSelectedStaffId,
  selectedVehicleId,
  onSetSelectedVehicleId,
  selectedInventoryId,
  onSetSelectedInventoryId,
  selectedServiceCategoryId,
  onSetSelectedServiceCategoryId,
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

  const handleNavigateToInventoryDetail = (itemId: string) => {
    if (onSetSelectedInventoryId) {
      onSetSelectedInventoryId(itemId);
    }
    navigateInMyGarage('inventoryDetail', { itemId });
  };

  const handleNavigateToAddInventory = () => {
    if (onSetSelectedInventoryId) {
      onSetSelectedInventoryId(null);
    }
    navigateInMyGarage('inventoryForm');
  };

  const handleNavigateToEditInventory = (itemId: string) => {
    if (onSetSelectedInventoryId) {
      onSetSelectedInventoryId(itemId);
    }
    navigateInMyGarage('inventoryForm', { itemId });
  };

  const handleInventoryDetailBack = () => {
    goBackInMyGarage();
  };

  const handleInventoryDetailEdit = (itemId: string) => {
    if (onSetSelectedInventoryId) {
      onSetSelectedInventoryId(itemId);
    }
    navigateInMyGarage('inventoryForm', { itemId });
  };

  const handleInventoryFormBack = () => {
    goBackInMyGarage();
  };

  const handleInventoryFormSuccess = () => {
    if (onSetSelectedInventoryId) {
      onSetSelectedInventoryId(null);
    }
    navigateInMyGarage('inventory');
  };

  const handleNavigateToServiceCategoryDetail = (categoryId: string) => {
    if (onSetSelectedServiceCategoryId) {
      onSetSelectedServiceCategoryId(categoryId);
    }
    navigateInMyGarage('serviceCategoryDetail', { categoryId });
  };

  const handleNavigateToAddServiceCategory = () => {
    if (onSetSelectedServiceCategoryId) {
      onSetSelectedServiceCategoryId(null);
    }
    navigateInMyGarage('serviceCategoryForm');
  };

  const handleNavigateToEditServiceCategory = (categoryId: string) => {
    if (onSetSelectedServiceCategoryId) {
      onSetSelectedServiceCategoryId(categoryId);
    }
    navigateInMyGarage('serviceCategoryForm', { categoryId });
  };

  const handleServiceCategoryDetailBack = () => {
    goBackInMyGarage();
  };

  const handleServiceCategoryDetailEdit = (categoryId: string) => {
    if (onSetSelectedServiceCategoryId) {
      onSetSelectedServiceCategoryId(categoryId);
    }
    navigateInMyGarage('serviceCategoryForm', { categoryId });
  };

  const handleServiceCategoryFormBack = () => {
    goBackInMyGarage();
  };

  const handleServiceCategoryFormSuccess = () => {
    if (onSetSelectedServiceCategoryId) {
      onSetSelectedServiceCategoryId(null);
    }
    navigateInMyGarage('serviceCategories');
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

    case 'inventory':
      return (
        <InventoryListScreen
          onNavigateBack={handleNavigateBack}
          onNavigateToInventoryDetail={handleNavigateToInventoryDetail}
          onNavigateToAddInventory={handleNavigateToAddInventory}
          onNavigateToEditInventory={handleNavigateToEditInventory}
        />
      );

    case 'inventoryDetail':
      return (
        <InventoryDetailScreen
          itemId={selectedInventoryId || myGarageParams?.itemId || ''}
          onNavigateBack={handleInventoryDetailBack}
          onNavigateToEdit={handleInventoryDetailEdit}
        />
      );

    case 'inventoryForm':
      return (
        <InventoryFormScreen
          itemId={selectedInventoryId || myGarageParams?.itemId || undefined}
          onNavigateBack={handleInventoryFormBack}
          onSaveSuccess={handleInventoryFormSuccess}
        />
      );

    case 'serviceCategories':
      return (
        <ServiceCategoryListScreen
          onNavigateBack={handleNavigateBack}
          onNavigateToDetail={handleNavigateToServiceCategoryDetail}
          onNavigateToAdd={handleNavigateToAddServiceCategory}
          onNavigateToEdit={handleNavigateToEditServiceCategory}
        />
      );

    case 'serviceCategoryDetail':
      return (
        <ServiceCategoryDetailScreen
          categoryId={selectedServiceCategoryId || myGarageParams?.categoryId || ''}
          onNavigateBack={handleServiceCategoryDetailBack}
          onNavigateToEdit={handleServiceCategoryDetailEdit}
        />
      );

    case 'serviceCategoryForm':
      return (
        <ServiceCategoryFormScreen
          categoryId={selectedServiceCategoryId || myGarageParams?.categoryId || undefined}
          onNavigateBack={handleServiceCategoryFormBack}
          onSaveSuccess={handleServiceCategoryFormSuccess}
        />
      );

    // Placeholder screens for future implementation
    case 'jobcards':
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

