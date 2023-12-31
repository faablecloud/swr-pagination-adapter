<p align="center">
  <a href="https://faable.com">
    <h1 align="center">SWR Pagination Adapter</h1>
  </a>
  <p align="center">Pagination adapter to Vercel `SWR` data fetching</p>
</p>

<p align="center">
  <a aria-label="NPM version" href="https://www.npmjs.com/package/@faable/faableql">
    <img alt="" src="https://img.shields.io/npm/v/@faable/swr-pagination-adapter.svg?style=for-the-badge&labelColor=000000">
  </a>
</p>

## Install

With NPM:

```bash
 npm install @faablecloud/swr-pagination-adapter
```

## Usage:

```tsx
import { useSWRPaginated } from "@faablecloud/swr-pagination-adapter";

interface DataType {
  name: string;
  color: string;
}

const ListComponent = () => {
  const { data, isReachingEnd, setSize } = useSWRPaginated<DataType>(
    `/database`,
    {},
    { pageSize: 5 }
  );

  return (
    <>
      {!data && <p>No Data</p>}
      {data.map((obj) => (
        <Item {...obj} />
      ))}
      {!isReachingEnd && (
        <button onClick={() => setSize(size + 1)}>Load more</button>
      )}
    </>
  );
};
```

## Links

- https://swr.vercel.app
