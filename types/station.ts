export type ConnectorType = 'CCS2' | 'GB/T' | 'Type 2';
export type StationStatus = 'Operational' | 'Maintenance' | 'Coming Soon';

export interface StationConnector {
  type: ConnectorType;
  count: number;
}

export interface ChargingStation {
  id: string;
  name: string;
  network: string; // e.g. "PSO / Dewan", "ChargeUp", "Hubco", "Tesla Pak"
  city: string;
  address: string;
  lat: number;
  lng: number;
  connectors: StationConnector[];
  maxPowerKw: number;
  pricePerKwh: number; // PKR rate per kWh
  isMotorway: boolean;
  motorwayName?: string; // e.g. "M-2", "M-9", "M-5"
  status: StationStatus;
}
