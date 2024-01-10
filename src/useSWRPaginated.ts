import { useSWRConfig } from "swr";
import useSWRInfinite from "swr/infinite";
import { useState, useMemo, useEffect } from "react";

interface PaginationParams {
  pageSize?: number;
}

export function useSWRPaginated<T>(
  base: string,
  options: PaginationParams = {}
) {
  const [pageSize, setPageSize] = useState(options?.pageSize || 40);

  const getKey = useMemo(
    () => (pageIndex, previousPageData) => {
      // reached the end
      // console.log(previousPageData);
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
    [pageSize]
  );

  const swr = useSWRInfinite<{ next: string | null; results: T[] }>(getKey);

  useEffect(() => {
    swr.mutate();
  }, [pageSize]);

  const isEmpty = swr.data?.[0]?.results?.length === 0;
  const isReachingEnd = isEmpty
    ? true
    : swr.data
    ? swr.data[swr.data?.length - 1]?.next == null
    : false;

  // Array of pages
  const pages = swr.data;

  // All pages flattened
  const data = swr.data && swr.data.map((p) => p?.results).flat();

  return {
    ...swr,
    isReachingEnd: data ? isReachingEnd : true,
    isEmpty,
    data,
    pages,
    setPageSize,
    pageSize,
  };
}
