// Indian States Data - Simplified
// Only states are needed for dropdown functionality

export interface IndianState {
  name: string;
}

// List of all Indian states
export const INDIAN_STATES: IndianState[] = [
  { name: "Andhra Pradesh" },
  { name: "Arunachal Pradesh" },
  { name: "Assam" },
  { name: "Bihar" },
  { name: "Chhattisgarh" },
  { name: "Delhi" },
  { name: "Goa" },
  { name: "Gujarat" },
  { name: "Haryana" },
  { name: "Himachal Pradesh" },
  { name: "Jharkhand" },
  { name: "Karnataka" },
  { name: "Kerala" },
  { name: "Madhya Pradesh" },
  { name: "Maharashtra" },
  { name: "Manipur" },
  { name: "Meghalaya" },
  { name: "Mizoram" },
  { name: "Nagaland" },
  { name: "Odisha" },
  { name: "Punjab" },
  { name: "Rajasthan" },
  { name: "Sikkim" },
  { name: "Tamil Nadu" },
  { name: "Telangana" },
  { name: "Tripura" },
  { name: "Uttar Pradesh" },
  { name: "Uttarakhand" },
  { name: "West Bengal" }
];

// Helper functions for state data
export const getStates = (): string[] => {
  return INDIAN_STATES.map(state => state.name);
};

export const filterStatesByQuery = (query: string): string[] => {
  const lowercaseQuery = query.toLowerCase();
  return INDIAN_STATES
    .map(state => state.name)
    .filter(state => state.toLowerCase().includes(lowercaseQuery));
}; 