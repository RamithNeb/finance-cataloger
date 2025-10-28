import { useState, useEffect, useRef } from 'react';
import { fetchPapers, type PapersResponse, ApiError } from '@/lib/api';
import axios from 'axios';

export interface FilterParams {
  search: string;
  functionFilter: string;
  techniqueFilter: string;
  industryFilter: string;
  stageFilter: string;
  yearFrom: string;
  yearTo: string;
  page: number;
  limit: number;
  order: string;
}

export function usePapers(filters: FilterParams) {
  const [data, setData] = useState<PapersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Cancel previous request if it exists
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    // Create new AbortController for this request
    const controller = new AbortController();
    controllerRef.current = controller;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const params: Record<string, any> = {
          page: filters.page,
          limit: filters.limit,
          order: filters.order,
          q: filters.search || undefined,
          function: filters.functionFilter !== 'All' ? filters.functionFilter : undefined,
          technique: filters.techniqueFilter !== 'All' ? filters.techniqueFilter : undefined,
          industry: filters.industryFilter !== 'All' ? filters.industryFilter : undefined,
          stage: filters.stageFilter !== 'All' ? filters.stageFilter : undefined,
          year_from: filters.yearFrom ? parseInt(filters.yearFrom) : undefined,
          year_to: filters.yearTo ? parseInt(filters.yearTo) : undefined,
        };

        const result = await fetchPapers(params, controller.signal);
        
        // Only update state if request wasn't cancelled
        if (!controller.signal.aborted) {
          setData(result);
        }
      } catch (err) {
        // Only update error state if request wasn't cancelled
        if (!axios.isCancel(err) && !controller.signal.aborted) {
          if (err instanceof ApiError) {
            setError(err);
          } else if (err instanceof Error) {
            setError(err);
          } else {
            setError(new Error('An unknown error occurred'));
          }
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    // Cleanup: abort request when dependencies change or component unmounts
    return () => {
      controller.abort();
    };
  }, [
    filters.page,
    filters.search,
    filters.functionFilter,
    filters.techniqueFilter,
    filters.industryFilter,
    filters.stageFilter,
    filters.yearFrom,
    filters.yearTo,
    filters.limit,
    filters.order,
  ]);

  const refetch = () => {
    // Trigger refetch by updating a dependency (or force update)
    setLoading(true);
  };

  return { data, loading, error, refetch };
}

