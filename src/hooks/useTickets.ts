import { useState, useEffect, useCallback } from 'react';
import { ticketService } from '@/services/ticketService';
import type { Ticket, TicketFilters, SortConfig, PaginationConfig } from '@/types';

export function useTickets(
  initialFilters?: TicketFilters,
  initialSort?: SortConfig,
  initialPagination: PaginationConfig = { page: 1, pageSize: 10, total: 0 }
) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<TicketFilters | undefined>(initialFilters);
  const [sort, setSort] = useState<SortConfig | undefined>(initialSort);
  const [pagination, setPagination] = useState<PaginationConfig>(initialPagination);

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await ticketService.getTickets(filters, sort, pagination);
      setTickets(result.data);
      setPagination(prev => ({ ...prev, total: result.total }));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch tickets'));
    } finally {
      setLoading(false);
    }
  }, [filters, sort, pagination.page, pagination.pageSize]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const updateFilters = (newFilters: TicketFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 })); // reset page on filter change
  };

  const updateSort = (newSort: SortConfig) => {
    setSort(newSort);
  };

  const updatePage = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  return {
    tickets,
    loading,
    error,
    filters,
    sort,
    pagination,
    setFilters: updateFilters,
    setSort: updateSort,
    setPage: updatePage,
    refetch: fetchTickets,
  };
}
