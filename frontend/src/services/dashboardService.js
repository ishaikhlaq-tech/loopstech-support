import { apiRequest } from '../api/client';

export const dashboardService = {
  getSummary: async () => {
    return apiRequest('/dashboard/summary');
  },
};
