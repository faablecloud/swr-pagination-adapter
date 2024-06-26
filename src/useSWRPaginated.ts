import { BareFetcher, Middleware, SWRHook } from "swr";
import useSWRInfinite, {
  SWRInfiniteConfiguration,
  SWRInfiniteKeyLoader,
  SWRInfiniteResponse,
} from "swr/infinite";

interface PaginationParams {
  pageSize?: number;
}

type Page<T = any> = { next: string | null; results: T[] };

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

type SWRPaginatedResponse<T> = SWRInfiniteResponse<T> & {
  items: T[];
  isEmpty: boolean;
  isReachingEnd: boolean;
};

export function useSWRPaginated<T, P extends Page<T> = Page<T>>(
  getKey: SWRInfiniteKeyLoader<P>,
  config?: SWRInfiniteConfiguration<P, Error, BareFetcher<P>>
): SWRPaginatedResponse<P> {
  const swr = useSWRInfinite<P>(getKey, config);

  Object.defineProperty(swr, "items", {
    get: function () {
      return this.data?.map((p) => p?.results).flat();
    },
  });

  Object.defineProperty(swr, "isEmpty", {
    get: function () {
      return this.data?.[0]?.results?.length === 0;
    },
  });

  Object.defineProperty(swr, "isReachingEnd", {
    get: function () {
      const empty = this.data?.[0]?.results?.length === 0;
      return empty
        ? true
        : this.data
        ? this.data[this.data?.length - 1]?.next == null
        : false;
    },
  });

  return swr as any;
}
