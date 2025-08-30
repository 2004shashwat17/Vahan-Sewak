import { ProblemType } from '../types';

export const PROBLEM_TYPES: ProblemType[] = [
  {
    id: 'tyre_puncture',
    name: 'Tyre Puncture',
    icon: 'car',
    description: 'Flat or punctured tyre'
  },
  {
    id: 'unknown_warnings',
    name: 'Unknown Warnings',
    icon: 'warning',
    description: 'Dashboard warning lights'
  },
  {
    id: 'heating_problem',
    name: 'Heating Problem',
    icon: 'thermometer',
    description: 'Engine overheating issues'
  },
  {
    id: 'ac_not_working',
    name: 'AC Not Working',
    icon: 'snowflake',
    description: 'Air conditioning problems'
  },
  {
    id: 'heater_not_working',
    name: 'Heater Not Working',
    icon: 'flame',
    description: 'Heating system issues'
  },
  {
    id: 'engine_oil',
    name: 'Engine Oil',
    icon: 'droplet',
    description: 'Oil level or quality issues'
  },
  {
    id: 'steering_axle',
    name: 'Steering/Axle Problem',
    icon: 'compass',
    description: 'Steering or axle issues'
  },
  {
    id: 'steering_oil',
    name: 'Steering Oil',
    icon: 'refresh',
    description: 'Power steering fluid issues'
  },
  {
    id: 'windshield_change',
    name: 'Windshield Change',
    icon: 'square',
    description: 'Windshield replacement'
  },
  {
    id: 'other',
    name: 'Other / Not Sure',
    icon: 'help-circle',
    description: 'Other problems or unsure'
  }
];

export const SAMPLE_MECHANICS = [
  {
    _id: '1',
    name: 'Rajesh Kumar',
    specialization: 'Engine Expert',
    rating: 4.8,
    reviews: 127,
    distance: 2.3,
    eta: 12,
    serviceCharge: 350,
    isAvailable: true,
    location: {
      latitude: 28.6139,
      longitude: 77.2090
    },
    profileImage: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  {
    _id: '2',
    name: 'Vikram Singh',
    specialization: 'All Repairs',
    rating: 4.9,
    reviews: 89,
    distance: 3.1,
    eta: 15,
    serviceCharge: 400,
    isAvailable: true,
    location: {
      latitude: 28.6139,
      longitude: 77.2090
    },
    profileImage: 'https://randomuser.me/api/portraits/men/2.jpg'
  },
  {
    _id: '3',
    name: 'Mohammed Ali',
    specialization: 'Electrical & AC',
    rating: 4.7,
    reviews: 156,
    distance: 4.2,
    eta: 18,
    serviceCharge: 320,
    isAvailable: true,
    location: {
      latitude: 28.6139,
      longitude: 77.2090
    },
    profileImage: 'https://randomuser.me/api/portraits/men/3.jpg'
  }
];

export const SAMPLE_SERVICE_HISTORY = [
  {
    _id: '1',
    problemType: 'Tyre Puncture',
    status: 'completed',
    mechanic: 'Rajesh Kumar',
    date: '2025-01-15',
    cost: 350
  },
  {
    _id: '2',
    problemType: 'Engine Oil',
    status: 'completed',
    mechanic: 'Vikram Singh',
    date: '2025-01-10',
    cost: 1200
  }
];

export const PAYMENT_METHODS = [
  {
    id: 'upi',
    name: 'UPI Payment',
    icon: 'credit-card',
    recommended: true
  },
  {
    id: 'card',
    name: 'Credit/Debit Card',
    icon: 'card'
  },
  {
    id: 'wallet',
    name: 'Digital Wallet',
    icon: 'wallet'
  }
];
