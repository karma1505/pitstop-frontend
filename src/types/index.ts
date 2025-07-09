// Global TypeScript interfaces and types

export interface Garage {
  id: string;
  name: string;
  address: string;
  services: Service[];
  rating: number;
  isOpen: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  createdAt: Date;
}

export interface Appointment {
  id: string;
  userId: string;
  garageId: string;
  serviceId: string;
  scheduledAt: Date;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
}

// Navigation types
export type RootStackParamList = {
  Home: undefined;
  GarageDetails: { garageId: string };
  BookAppointment: { garageId: string; serviceId: string };
  Profile: undefined;
};

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
} 