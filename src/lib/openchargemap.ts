// PakevFinder.com — Open Charge Map (OCM) Seed Sourcing Utility
// Implements docs/02-ARCHITECTURE.md §1 & §3
// Provides ODbL/CC BY-SA 4.0 compliant ingestion and mapping for Pakistan EV charging stations

import { ChargingStation, ConnectorType, StationStatus } from './types';

export const OPEN_CHARGE_MAP_ATTRIBUTION = {
  name: 'Open Charge Map',
  url: 'https://openchargemap.org',
  license: 'Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0) / ODbL',
  notice:
    'Data sourced from Open Charge Map (openchargemap.org) community database. Licensed under CC BY-SA 4.0. Independent verification required before publication.',
};

export interface OcmConnection {
  ConnectionTypeID?: number;
  ConnectionType?: {
    Title?: string;
    FormalName?: string;
  };
  PowerKW?: number;
  CurrentTypeID?: number;
  Quantity?: number;
}

export interface OcmPoi {
  ID: number;
  UUID?: string;
  DataProviderID?: number;
  OperatorInfo?: {
    Title?: string;
    WebsiteURL?: string;
  };
  UsageType?: {
    Title?: string;
    IsPayAtLocation?: boolean;
  };
  StatusType?: {
    IsOperational?: boolean;
    Title?: string;
  };
  AddressInfo: {
    Title: string;
    AddressLine1?: string;
    Town?: string;
    StateOrProvince?: string;
    Postcode?: string;
    Latitude: number;
    Longitude: number;
    ContactTelephone1?: string;
    RelatedURL?: string;
  };
  Connections?: OcmConnection[];
  DateLastStatusUpdate?: string;
}

/**
 * Maps OCM connection types to PakevFinder ConnectorType
 */
export function mapOcmConnectorType(title?: string): ConnectorType {
  const t = (title || '').toLowerCase();
  if (t.includes('ccs') || t.includes('combo')) return 'CCS2';
  if (t.includes('gbt') || t.includes('gb/t')) return 'GB/T';
  if (t.includes('type 2') || t.includes('mennekes')) return 'Type 2';
  if (t.includes('chademo')) return 'CHAdeMO';
  if (t.includes('tesla')) return 'Tesla Supercharger';
  return 'CCS2'; // Modern DC default in Pakistan
}

/**
 * Transforms an Open Charge Map POI record into PakevFinder ChargingStation domain model
 */
export function transformOcmPoiToStation(poi: OcmPoi): ChargingStation {
  const connectors: ConnectorType[] = [];
  let maxPowerKw = 22; // default standard AC

  if (poi.Connections && poi.Connections.length > 0) {
    poi.Connections.forEach((conn) => {
      const connTitle = conn.ConnectionType?.Title || conn.ConnectionType?.FormalName;
      const mapped = mapOcmConnectorType(connTitle);
      if (!connectors.includes(mapped)) {
        connectors.push(mapped);
      }
      if (conn.PowerKW && conn.PowerKW > maxPowerKw) {
        maxPowerKw = Math.round(conn.PowerKW);
      }
    });
  }

  if (connectors.length === 0) {
    connectors.push('CCS2');
  }

  const isOperational = poi.StatusType?.IsOperational ?? true;
  const status: StationStatus = isOperational ? 'active' : 'inactive';

  return {
    id: `ocm-${poi.ID}`,
    name: poi.AddressInfo.Title || `Station #${poi.ID}`,
    network_operator: poi.OperatorInfo?.Title || 'Independent',
    latitude: poi.AddressInfo.Latitude,
    longitude: poi.AddressInfo.Longitude,
    city: poi.AddressInfo.Town || poi.AddressInfo.StateOrProvince || 'Pakistan',
    address: poi.AddressInfo.AddressLine1 || null,
    connector_types: connectors,
    power_kw: maxPowerKw,
    status,
    submitted_by: 'Open Charge Map Import',
    verification_status: 'unverified',
    source_url: `https://openchargemap.org/poi/details/${poi.ID}`,
    last_verified_at: poi.DateLastStatusUpdate || null,
  };
}

/**
 * Fetches candidate charging stations in Pakistan from Open Charge Map API
 * API documentation: https://openchargemap.org/site/develop/api
 */
export async function fetchPakistanStationsFromOcm(apiKey?: string): Promise<ChargingStation[]> {
  const key = apiKey || process.env.OCM_API_KEY;
  const url = `https://api.openchargemap.io/v3/poi/?countrycode=PK&compact=true&verbose=false&output=json&maxresults=100${
    key ? `&key=${key}` : ''
  }`;

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'PakEVFinder/1.0 (pakevfinder.com)',
      },
      next: { revalidate: 86400 * 7 }, // Cache for 7 days
    });

    if (!res.ok) {
      return [];
    }

    const pois: OcmPoi[] = await res.json();
    if (!Array.isArray(pois)) return [];

    return pois.map(transformOcmPoiToStation);
  } catch {
    return [];
  }
}
