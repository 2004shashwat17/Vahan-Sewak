export interface User {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  vehicles?: Vehicle[];
  createdAt: Date;
}

export interface Vehicle {
  _id: string;
  make: string;
  model: string;
  year: string;
  registrationNumber: string;
  userId: string;
}

export interface Mechanic {
  _id: string;
  name: string;
  specialization: string;
  rating: number;
  reviews: number;
  distance: number;
  eta: number;
  serviceCharge: number;
  isAvailable: boolean;
  location: {
    latitude: number;
    longitude: number;
  };
  profileImage?: string;
}

export interface ServiceRequest {
  _id: string;
  userId: string;
  problemType: string;
  problemDescription: string;
  photos?: string[];
  video?: string;
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  mechanicId?: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  inspectionFee: number;
  totalAmount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  _id: string;
  serviceRequestId: string;
  amount: number;
  method: 'upi' | 'card' | 'wallet';
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
  createdAt: Date;
}

export interface ProblemType {
  id: string;
  name: string;
  icon: string;
  description?: string;
}
