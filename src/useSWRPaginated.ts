import { BareFetcher } from "swr";
import useSWRInfinite, {
  SWRInfiniteConfiguration,
  SWRInfiniteKeyLoader,
} from "swr/infinite";
import { useMemo } from "react";

interface PaginationParams {
  pageSize?: number;
}

type Page<T> = { next: string | null; results: T[] };

export const generateGetKey = <T>(
  base: string,
  config: PaginationParams = {}
): SWRInfiniteKeyLoader<Page<T>> => {
  const { pageSize } = config;
  return (pageIndex, previousPageData) => {
    // Null key if base is null to use SWR conditinal fetching
    if (base == null) return null;

    // reached the end
    if (previousPageData && !previousPageData.next) return null;

    const url = new URL(base, "https://dummy.com");

    // page size
    if (pageSize) {
      url.searchParams.set("pageSize", pageSize.toString());
    }

    // first page, we don't have `previousPageData`
    if (pageIndex != 0) {
      // add the cursor to the API endpoint
      url.searchParams.set("cursor", previousPageData.next);
    }
    return url.pathname + "?" + url.searchParams.toString();
  };
};

export function useSWRPaginated<T, P extends Page<T> = Page<T>>(
  getKey: SWRInfiniteKeyLoader<P>,
  config?: SWRInfiniteConfiguration<P, Error, BareFetcher<P>>
) {
  const swr = useSWRInfinite<P>(getKey, config);

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
  const items = useMemo(() => {
    if (swr.data) {
      return swr.data.map((p) => p?.results).flat();
    }
    return;
  }, [swr.data]);

  return Object.assign(swr, {
    isReachingEnd,
    isEmpty,
    items,
  });
}
