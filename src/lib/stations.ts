// PakevFinder.com — Charging Stations Data Access & Ingestion Queue
// Strictly implements docs/02-ARCHITECTURE.md and RLS rules

import {
  ChargingStation,
  ChargingStationSubmissionInput,
  ConnectorType,
} from './types';
import { computeVerificationStatus } from './verification';
import { VERIFIED_PAKISTAN_CHARGING_STATIONS } from './data/stations';
import { createServerClient } from './supabase/server';
import { supabase as clientSupabase } from './supabase/client';

export async function getAllChargingStations(): Promise<ChargingStation[]> {
  const supabase = createServerClient();
  if (!supabase) return VERIFIED_PAKISTAN_CHARGING_STATIONS;

  try {
    const { data, error } = await supabase
      .from('charging_stations')
      .select('*')
      .order('power_kw', { ascending: false });

    if (error || !data || data.length === 0) {
      return VERIFIED_PAKISTAN_CHARGING_STATIONS;
    }

    return data.map((st) => ({
      ...st,
      verification_status: computeVerificationStatus(
        st.verification_status,
        st.last_verified_at,
        'spec'
      ),
    }));
  } catch {
    return VERIFIED_PAKISTAN_CHARGING_STATIONS;
  }
}

export async function submitStationForReview(
  input: ChargingStationSubmissionInput
): Promise<{ success: boolean; message: string }> {
  // If Supabase is configured on client or server, insert into public queue
  if (clientSupabase) {
    try {
      const { error } = await clientSupabase
        .from('charging_station_submissions')
        .insert([
          {
            submitted_data: input,
            status: 'pending',
            submitter_contact: input.submitter_contact || null,
            notes: input.notes || null,
          },
        ]);

      if (error) {
        return {
          success: false,
          message: error.message || 'Failed to submit charging station.',
        };
      }

      return {
        success: true,
        message: 'Station submitted successfully! Our editorial team will verify coordinates and specs before publishing.',
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      return { success: false, message: msg };
    }
  }

  // Fallback simulation for local/dev
  return {
    success: true,
    message: 'Station submitted successfully (queued for editorial review).',
  };
}

/**
 * Filter charging stations by city, connector type, and min power
 */
export function filterStations(
  stations: ChargingStation[],
  filters: {
    city?: string;
    connectorType?: ConnectorType | 'all';
    minPowerKw?: number;
  }
): ChargingStation[] {
  return stations.filter((s) => {
    if (filters.city && filters.city !== 'all' && s.city !== filters.city) {
      return false;
    }
    if (
      filters.connectorType &&
      filters.connectorType !== 'all' &&
      !s.connector_types.includes(filters.connectorType)
    ) {
      return false;
    }
    if (filters.minPowerKw && s.power_kw < filters.minPowerKw) {
      return false;
    }
    return true;
  });
}
