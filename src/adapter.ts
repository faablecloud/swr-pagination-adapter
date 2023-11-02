import useSWRInfinite from "swr/infinite";

interface PaginationParams {
  pageSize: number;
}

export function useSWRPaginated<T>(
  base: string,
  _params: {} = {},
  options: PaginationParams = { pageSize: 40 }
) {
  const getKey = (pageIndex, previousPageData) => {
    // reached the end
    // console.log(previousPageData);
    if (previousPageData && !previousPageData.next) return null;

    let params = new URLSearchParams(_params);

    // page size
    params.set("pageSize", options.pageSize.toString());

    // first page, we don't have `previousPageData`
    if (pageIndex === 0) return base + "?" + params.toString();

    // add the cursor to the API endpoint
    params.set("cursor", previousPageData.next);
    return base + "?" + params.toString();
  };

  const swr = useSWRInfinite<{ next: string | null; results: T[] }>(getKey);
  const data = swr.data;
  const isEmpty = data?.[0]?.results.length === 0;
  const isReachingEnd = isEmpty
    ? true
    : data
    ? data[data.length - 1]?.next == null
    : false;
  return {
    ...swr,
    isReachingEnd: data ? isReachingEnd : true,
    isEmpty,
    data: swr.data && swr.data.map((p) => p.results).flat(),
  };
}
