import { useState, useCallback, useEffect } from 'react';
import { apiRequest } from '../api/client';
import toast from 'react-hot-toast';

/**
 * useSLA
 *
 * Manages SLA tier state by connecting to the backend API.
 */
const useSLA = () => {
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch from backend on mount
  useEffect(() => {
    const loadPolicies = async () => {
      try {
        const data = await apiRequest('/sla');
        
        // Map backend names to UI-friendly structure if needed, or just use as is.
        // Backend returns: id, label, dot_color, first_response_hours, resolution_hours
        const formattedTiers = (data.policies || []).map(p => ({
          id: p.id,
          tier: p.id.toUpperCase(),
          label: p.label,
          subtitle: `${p.id.toUpperCase()} Priority SLA`,
          dotColor: p.dot_color,
          firstResponse: p.first_response_hours,
          resolution: p.resolution_hours
        }));
        
        setTiers(formattedTiers);
      } catch (err) {
        toast.error('Failed to load SLA policies: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadPolicies();
  }, []);

  /** Increment or decrement a numeric field by 1, minimum 1 */
  const updateField = useCallback((id, field, delta) => {
    setTiers((prev) =>
      prev.map((tier) =>
        tier.id === id
          ? { ...tier, [field]: Math.max(1, tier[field] + delta) }
          : tier
      )
    );
  }, []);

  /**
   * Directly set a numeric field value (for typed input in future)
   */
  const setFieldValue = useCallback((id, field, value) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 1) {
      setTiers((prev) =>
        prev.map((tier) => (tier.id === id ? { ...tier, [field]: num } : tier))
      );
    }
  }, []);

  /**
   * Save handler — updates the backend via API
   */
  const saveTier = useCallback(async (id) => {
    const tier = tiers.find((t) => t.id === id);
    if (!tier) return;
    
    try {
      await apiRequest(`/sla/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          first_response_hours: tier.firstResponse,
          resolution_hours: tier.resolution
        })
      });
      toast.success(`${tier.tier} SLA policy saved successfully`);
    } catch (err) {
      toast.error('Failed to save policy: ' + err.message);
    }
  }, [tiers]);

  return { tiers, loading, updateField, setFieldValue, saveTier };
};

export default useSLA;
