/**
 * slaData.js
 * Static placeholder SLA tier data.
 * Replace with Supabase fetch when backend is ready.
 */

export const SLA_TIERS = [
  {
    id: 'low',
    tier: 'LOW',
    label: 'LOW Tier',
    subtitle: 'LOW Priority SLA',
    dotColor: '#22C55E',   // green
    firstResponse: 12,
    resolution: 48,
  },
  {
    id: 'medium',
    tier: 'MEDIUM',
    label: 'MEDIUM Tier',
    subtitle: 'MEDIUM Priority SLA',
    dotColor: '#3B82F6',   // blue
    firstResponse: 8,
    resolution: 16,
  },
  {
    id: 'high',
    tier: 'HIGH',
    label: 'HIGH Tier',
    subtitle: 'HIGH Priority SLA',
    dotColor: '#F59E0B',   // amber
    firstResponse: 2,
    resolution: 4,
  },
  {
    id: 'critical',
    tier: 'CRITICAL',
    label: 'CRITICAL Tier',
    subtitle: 'CRITICAL Priority SLA',
    dotColor: '#EF4444',   // red
    firstResponse: 1,
    resolution: 2,
  },
];
