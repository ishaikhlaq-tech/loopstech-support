import { useState } from 'react';

export const useTicketFilters = () => {
  const [filters, setFilters] = useState({});

  return {
    filters,
    setFilters
  };
};
