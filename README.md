<p align="center">
  <a href="https://faable.com">
    <h1 align="center">SWR Pagination Adapter</h1>
  </a>
  <p align="center">Pagination adapter to Vercel `SWR` data fetching</p>
</p>

<p align="center">
  <a aria-label="NPM version" href="https://www.npmjs.com/package/@faable/swr-pagination-adapter">
    <img alt="" src="https://img.shields.io/npm/v/@faable/swr-pagination-adapter.svg?style=for-the-badge&labelColor=000000">
  </a>
</p>

## Install

```bash
 npm install @faable/swr-pagination-adapter
```

## Usage:

```tsx
import { useSWRPaginated } from "@faable/swr-pagination-adapter";

interface DataType {
  name: string;
  color: string;
}

const ListComponent = () => {
  const { data, isReachingEnd, setSize } = useSWRPaginated<DataType>(
    `/recipes?query=label:babies`,
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

Another example:

```tsx
const ListComponent = () => {
  const params = new URLSearchParams({ query: "label:babies" });

  /*
  const params2 = new URLSearchParams({
    query:["label:babies","label:freeze"].join(" "),
    category:"tag_XXXX"
  });
  */

  const { data, isReachingEnd, setSize } = useSWRPaginated<DataType>(
    `/recipes?${params}`,
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

## React Native and Expo

> [!IMPORTANT]
> You have to polyfill `URL()` module from `node:url` to use this package in react native.

Locate your JavaScript entry-point file, commonly called index.js at the root of your React Native project.

```js
import "react-native-url-polyfill/auto";
```

- https://www.npmjs.com/package/react-native-url-polyfill

## Links

- https://swr.vercel.app
