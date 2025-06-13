export interface STPSite {
  id: string;
  name: string;
  location: string;
  capacity: number; // Now in m³/hr
  status: 'active' | 'maintenance' | 'offline';
  lastReading?: number;
  lastUpdate?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface Operator {
  id: string;
  name: string;
  email: string;
  siteId: string;
  siteName: string;
  status: 'active' | 'inactive';
  lastActive?: string;
}

export interface FlowmeterReading {
  id: string;
  siteId: string;
  siteName: string;
  value: number; // Now in m³/hr
  unit: string;
  timestamp: string;
  imageUrl: string;
  status: 'normal' | 'warning' | 'critical';
  operatorId: string;
  operatorName: string;
}

export interface WaterQualityReading {
  id: string;
  siteId: string;
  siteName: string;
  classification: 'healthy' | 'unhealthy';
  confidence: number;
  timestamp: string;
  imageUrl: string;
  operatorId: string;
  operatorName: string;
}

export interface Alert {
  id: string;
  type: 'flow' | 'quality' | 'system';
  siteId: string;
  siteName: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: string;
  acknowledged: boolean;
  reading?: number;
}