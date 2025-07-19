// API service exports
export { AuthService } from './services/authService';
export { GarageService } from './services/garageService';
export { ProfileService } from './services/profileService';
export * from './types';
export { ApiClient } from './client';

// Legacy compatibility - export the old GarageApi for backward compatibility
export { AuthService as GarageApi } from './services/authService'; 