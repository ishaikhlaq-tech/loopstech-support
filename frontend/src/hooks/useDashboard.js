import { useState, useEffect } from 'react';
import { dashboardService } from '@services/dashboardService';

export const useDashboard = () => {
  const [data, setData] = useState({
    metrics: { total: 0, open: 0, inProgress: 0, resolved: 0, closed: 0, urgent: 0 },
    recentQueue: [],
    priorityBreakdown: { urgent: 0, high: 0, medium: 0, low: 0 },
    statusBreakdown: { open: 0, inProgress: 0, closed: 0, resolved: 0 },
    weeklyChartData: [],
    weeklyCreated: 0,
    weeklyResolved: 0,
    userRole: 'customer',
    categoryDistribution: {},
    avgVelocity: '0h 0m',
    slaStats: { total: 0, breaches: 0 },
    teamAllocation: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const result = await dashboardService.getSummary();
        setData(result);
      } catch (err) {
        setError(err.message || 'Failed to fetch dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { ...data, loading, error };
};
