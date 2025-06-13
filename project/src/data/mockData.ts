import { STPSite, Operator, FlowmeterReading, WaterQualityReading, Alert } from '../types';

// Helper function to convert L/min to m³/hr
const convertToM3Hr = (value: number): number => {
  return Number((value * 0.06).toFixed(2));
};

// Helper to generate dates in the past
const getPastDate = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

// Convert m³/hr to m³/day
const calculateDailyFlow = (currentReading: number, previousReading: number): number => {
  return Number((currentReading - previousReading).toFixed(1));
};

// Mock data generation for flow readings
const generateFlowReadings = () => {
  let lastReading = 46000;
  const readings = [];
  
  for (let i = 7; i >= 0; i--) {
    const currentReading = lastReading + Math.random() * 150;
    lastReading = currentReading;
    readings.push({
      date: getPastDate(i),
      value: Number(currentReading.toFixed(2))
    });
  }
  
  return readings;
};

// Generate historical flow data for charts (7 days)
export const generateHistoricalFlowData = (siteId: string) => {
  const readings = generateFlowReadings();
  const dailyFlows = [];
  
  for (let i = 1; i < readings.length; i++) {
    dailyFlows.push({
      date: readings[i].date,
      value: calculateDailyFlow(readings[i].value, readings[i-1].value)
    });
  }
  
  return dailyFlows;
};

// Mock STP Sites
export const mockSites: STPSite[] = [
  {
    id: 'site1',
    name: 'North Plant STP',
    location: 'Industrial Zone, North City',
    capacity: convertToM3Hr(500), // 30 m³/hr
    status: 'active',
    lastReading: convertToM3Hr(435.2),
    lastUpdate: getPastDate(0),
    coordinates: { lat: 28.6139, lng: 77.2090 }
  },
  {
    id: 'site2',
    name: 'South Basin Treatment',
    location: 'South Ridge, Industrial Area',
    capacity: convertToM3Hr(750), // 45 m³/hr
    status: 'active',
    lastReading: convertToM3Hr(612.5),
    lastUpdate: getPastDate(0),
    coordinates: { lat: 28.5455, lng: 77.1928 }
  },
  {
    id: 'site3',
    name: 'East River Facility',
    location: 'East River Bank, Sector 15',
    capacity: convertToM3Hr(350), // 21 m³/hr
    status: 'maintenance',
    lastReading: 0,
    lastUpdate: getPastDate(3),
    coordinates: { lat: 28.6304, lng: 77.2177 }
  },
  {
    id: 'site4',
    name: 'West Zone Complex',
    location: 'West Industrial Complex',
    capacity: convertToM3Hr(625), // 37.5 m³/hr
    status: 'active',
    lastReading: convertToM3Hr(521.8),
    lastUpdate: getPastDate(0),
    coordinates: { lat: 28.5985, lng: 77.1712 }
  },
  {
    id: 'site5',
    name: 'Central City Plant',
    location: 'Central Business District',
    capacity: convertToM3Hr(850), // 51 m³/hr
    status: 'offline',
    lastReading: 0,
    lastUpdate: getPastDate(7),
    coordinates: { lat: 28.6129, lng: 77.2295 }
  }
];

// Mock Operators
export const mockOperators: Operator[] = [
  {
    id: 'op1',
    name: 'John Operator',
    email: 'operator@aquaguard.com',
    siteId: 'site1',
    siteName: 'North Plant STP',
    status: 'active',
    lastActive: getPastDate(0)
  },
  {
    id: 'op2',
    name: 'Sarah Engineer',
    email: 'sarah.e@aquaguard.com',
    siteId: 'site2',
    siteName: 'South Basin Treatment',
    status: 'active',
    lastActive: getPastDate(0)
  },
  {
    id: 'op3',
    name: 'Michael Technician',
    email: 'michael.t@aquaguard.com',
    siteId: 'site3',
    siteName: 'East River Facility',
    status: 'inactive',
    lastActive: getPastDate(3)
  },
  {
    id: 'op4',
    name: 'Lisa Supervisor',
    email: 'lisa.s@aquaguard.com',
    siteId: 'site4',
    siteName: 'West Zone Complex',
    status: 'active',
    lastActive: getPastDate(1)
  }
];

// Mock Flowmeter Readings
export const mockFlowmeterReadings: FlowmeterReading[] = [
  {
    id: 'fr1',
    siteId: 'site1',
    siteName: 'North Plant STP',
    value: convertToM3Hr(435.2),
    unit: 'm³/hr',
    timestamp: getPastDate(0),
    imageUrl: 'https://images.pexels.com/photos/3846338/pexels-photo-3846338.jpeg?auto=compress&cs=tinysrgb&w=800',
    status: 'normal',
    operatorId: 'op1',
    operatorName: 'John Operator'
  },
  {
    id: 'fr2',
    siteId: 'site1',
    siteName: 'North Plant STP',
    value: convertToM3Hr(420.8),
    unit: 'm³/hr',
    timestamp: getPastDate(1),
    imageUrl: 'https://images.pexels.com/photos/3846338/pexels-photo-3846338.jpeg?auto=compress&cs=tinysrgb&w=800',
    status: 'normal',
    operatorId: 'op1',
    operatorName: 'John Operator'
  },
  {
    id: 'fr3',
    siteId: 'site1',
    siteName: 'North Plant STP',
    value: convertToM3Hr(390.5),
    unit: 'm³/hr',
    timestamp: getPastDate(2),
    imageUrl: 'https://images.pexels.com/photos/3846338/pexels-photo-3846338.jpeg?auto=compress&cs=tinysrgb&w=800',
    status: 'warning',
    operatorId: 'op1',
    operatorName: 'John Operator'
  },
  {
    id: 'fr4',
    siteId: 'site2',
    siteName: 'South Basin Treatment',
    value: convertToM3Hr(612.5),
    unit: 'm³/hr',
    timestamp: getPastDate(0),
    imageUrl: 'https://images.pexels.com/photos/3846338/pexels-photo-3846338.jpeg?auto=compress&cs=tinysrgb&w=800',
    status: 'normal',
    operatorId: 'op2',
    operatorName: 'Sarah Engineer'
  },
  {
    id: 'fr5',
    siteId: 'site4',
    siteName: 'West Zone Complex',
    value: convertToM3Hr(521.8),
    unit: 'm³/hr',
    timestamp: getPastDate(0),
    imageUrl: 'https://images.pexels.com/photos/3846338/pexels-photo-3846338.jpeg?auto=compress&cs=tinysrgb&w=800',
    status: 'normal',
    operatorId: 'op4',
    operatorName: 'Lisa Supervisor'
  }
];

// Mock Water Quality Readings
export const mockWaterQualityReadings: WaterQualityReading[] = [
  {
    id: 'wq1',
    siteId: 'site1',
    siteName: 'North Plant STP',
    classification: 'healthy',
    confidence: 0.94,
    timestamp: getPastDate(0),
    imageUrl: 'https://images.pexels.com/photos/5975866/pexels-photo-5975866.jpeg?auto=compress&cs=tinysrgb&w=800',
    operatorId: 'op1',
    operatorName: 'John Operator'
  },
  {
    id: 'wq2',
    siteId: 'site1',
    siteName: 'North Plant STP',
    classification: 'healthy',
    confidence: 0.89,
    timestamp: getPastDate(2),
    imageUrl: 'https://images.pexels.com/photos/5975866/pexels-photo-5975866.jpeg?auto=compress&cs=tinysrgb&w=800',
    operatorId: 'op1',
    operatorName: 'John Operator'
  },
  {
    id: 'wq3',
    siteId: 'site2',
    siteName: 'South Basin Treatment',
    classification: 'unhealthy',
    confidence: 0.78,
    timestamp: getPastDate(1),
    imageUrl: 'https://images.pexels.com/photos/1108701/pexels-photo-1108701.jpeg?auto=compress&cs=tinysrgb&w=800',
    operatorId: 'op2',
    operatorName: 'Sarah Engineer'
  },
  {
    id: 'wq4',
    siteId: 'site4',
    siteName: 'West Zone Complex',
    classification: 'healthy',
    confidence: 0.92,
    timestamp: getPastDate(0),
    imageUrl: 'https://images.pexels.com/photos/5975866/pexels-photo-5975866.jpeg?auto=compress&cs=tinysrgb&w=800',
    operatorId: 'op4',
    operatorName: 'Lisa Supervisor'
  }
];

// Mock Alerts
export const mockAlerts: Alert[] = [
  {
    id: 'al1',
    type: 'flow',
    siteId: 'site1',
    siteName: 'North Plant STP',
    severity: 'warning',
    message: `Flow rate below ${convertToM3Hr(400)} m³/hr`,
    timestamp: getPastDate(2),
    acknowledged: true,
    reading: convertToM3Hr(390.5)
  },
  {
    id: 'al2',
    type: 'quality',
    siteId: 'site2',
    siteName: 'South Basin Treatment',
    severity: 'critical',
    message: 'Water quality classified as unhealthy',
    timestamp: getPastDate(1),
    acknowledged: true
  },
  {
    id: 'al3',
    type: 'system',
    siteId: 'site3',
    siteName: 'East River Facility',
    severity: 'info',
    message: 'Scheduled maintenance started',
    timestamp: getPastDate(3),
    acknowledged: true
  },
  {
    id: 'al4',
    type: 'flow',
    siteId: 'site5',
    siteName: 'Central City Plant',
    severity: 'critical',
    message: 'Zero flow detected - system offline',
    timestamp: getPastDate(7),
    acknowledged: false,
    reading: 0
  },
  {
    id: 'al5',
    type: 'system',
    siteId: 'site1',
    siteName: 'North Plant STP',
    severity: 'warning',
    message: 'Sensor calibration required',
    timestamp: getPastDate(0),
    acknowledged: false
  }
];