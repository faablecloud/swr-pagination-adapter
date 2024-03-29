import { useSWRConfig, BareFetcher } from "swr";
import useSWRInfinite, { SWRInfiniteConfiguration } from "swr/infinite";
import { useState, useMemo, useEffect } from "react";

interface PaginationParams {
  pageSize?: number;
}

type Page<T> = { next: string | null; results: T[] };

export function useSWRPaginated<T, P extends Page<T> = Page<T>>(
  base: string | null,
  config?: PaginationParams & SWRInfiniteConfiguration<P, Error, BareFetcher<P>>
) {
  const pageSize = useMemo(() => config?.pageSize || 40, [config?.pageSize]);

  const getKey = useMemo(
    () => (pageIndex, previousPageData) => {
      // Null key if base is null to use SWR conditinal fetching
      if (base == null) return null;

      // reached the end
      if (previousPageData && !previousPageData.next) return null;

      const url = new URL(base, "https://dummy.com");

      // page size
      url.searchParams.set("pageSize", pageSize.toString());

      // first page, we don't have `previousPageData`
      if (pageIndex != 0) {
        // add the cursor to the API endpoint
        url.searchParams.set("cursor", previousPageData.next);
      }
      return url.pathname + "?" + url.searchParams.toString();
    },
    [pageSize, base, config]
  );

  const swr = useSWRInfinite<P>(getKey, config);

  useEffect(() => {
    swr.mutate();
  }, [pageSize]);

  const isEmpty = useMemo(
    () => swr.data?.[0]?.results?.length === 0,
    [swr.data]
  );

  const isReachingEnd = useMemo(
    () =>
      isEmpty
        ? true
        : swr.data
        ? swr.data[swr.data?.length - 1]?.next == null
        : false,
    [swr.data, isEmpty]
  );

  // All pages flattened on each data change
  const data = useMemo(() => {
    if (swr.data) {
      return swr.data.map((p) => p?.results).flat();
    }
    return;
  }, [swr.data]);
  return {
    ...swr,
    //isReachingEnd: data ? isReachingEnd : true,
    isReachingEnd,
    isEmpty,
    data,
    pages: swr.data, // Raw array of pages
    pageSize,
  };
}
