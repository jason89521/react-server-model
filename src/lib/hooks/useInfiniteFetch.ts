import { useCallback } from 'react';
import type { InfiniteModelAccessor } from '../model';
import { useModelAccessor } from './useModelAccessor';
import type { FetchOptions, InfiniteHookReturn } from './types';
import { isNull } from '../utils/isNull';

export function useInfiniteFetch<M, Arg, RD, D = any, E = unknown>(
  accessor: InfiniteModelAccessor<M, Arg, RD, E>,
  getSnapshot: (model: M) => D,
  options?: FetchOptions<D>
): InfiniteHookReturn<D, E>;
export function useInfiniteFetch<M, Arg, RD, D = any, E = unknown>(
  accessor: InfiniteModelAccessor<M, Arg, RD, E> | null,
  getSnapshot: (model: M) => D,
  options?: FetchOptions<D>
): InfiniteHookReturn<D | undefined, E>;
export function useInfiniteFetch<M, Arg, RD, D = any, E = unknown>(
  accessor: InfiniteModelAccessor<M, Arg, RD, E> | null,
  getSnapshot: (model: M) => D,
  options: FetchOptions<D> = {}
) {
  const { stateDeps, status, data } = useModelAccessor(accessor, getSnapshot, options);
  const { isFetching, error } = status;

  const fetchNextPage = useCallback(() => {
    if (isNull(accessor)) return;
    accessor.fetchNext();
  }, [accessor]);

  return {
    fetchNextPage,
    get data() {
      return data;
    },
    get isFetching() {
      stateDeps.isFetching = true;
      return isFetching;
    },
    get error() {
      stateDeps.error = true;
      return error;
    },
  };
}
