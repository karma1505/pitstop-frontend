// API service exports
export { AuthService } from './services/authService';
export { GarageService } from './services/garageService';
export { ProfileService } from './services/profileService';
export { CustomerService } from './services/customerService';
export { StaffService } from './services/staffService';
export { VehicleService } from './services/vehicleService';
export { InventoryService } from './services/inventoryService';
export * from './types';
export * from './types/customer';
export * from './types/staff';
export * from './types/vehicle';
export * from './types/inventory';
export { ApiClient } from './client';

// Legacy compatibility - export the old GarageApi for backward compatibility
export { AuthService as GarageApi } from './services/authService';