/**
 * @jest-environment jsdom
 */

import { act, renderHook, waitFor } from "@testing-library/react";
import { generateGetKey, useSWRPaginated } from "./useSWRPaginated";
import axios from "axios";
import { SWRConfig } from "swr";
import React from "react";
import useSWRInfinite, { unstable_serialize } from "swr/infinite";

const testapi = axios.create({ baseURL: "https://api-content.faable.link" });
const fetcher = async (key) => {
  const res = await testapi.get(key);
  return res.data;
};

const setupWrapper =
  (fallback?: any) =>
  ({ children }) =>
    (
      <SWRConfig
        value={{
          fetcher,
          fallback,
        }}
      >
        {children}
      </SWRConfig>
    );

// test("without fallback data", async () => {
//   const wrapper = setupWrapper();
//   const { result, waitForNextUpdate } = renderHook(
//     () => useSWRPaginated(generateGetKey("/content")),
//     { wrapper }
//   );

//   expect(result.current.items).toEqual(undefined);
//   await waitForNextUpdate({ timeout: 5000 });
//   expect(result.current.items.length).toEqual(29);
// });

test("with fallback data", async () => {
  const key = "/content";
  const data = await fetcher(key);
  const fallback = {
    [unstable_serialize(generateGetKey(key))]: [data],
  };
  const wrapper = setupWrapper(fallback);
  const { result } = renderHook(() => useSWRPaginated(generateGetKey(key)), {
    wrapper,
    hydrate: true,
  });
  // await act(async () => {});
  // await waitFor(() => {
  //   const swr = result.current;
  //   expect(swr.data?.length).toEqual(1);
  //   expect(swr.items?.length).toEqual(30);
  // });
  expect(result.current.data[0].results.length).toEqual(30);
  expect(result.current.items.length).toEqual(30);
  // console.log(result.current.data);
  // console.log(result.current.items);
});

// test("should use counter", () => {
//   let a = "hola";
//   const { result } = renderHook(() =>
//     useSWRPaginated(a ? generateGetKey("/demo?q=124") : null)
//   );

//   expect(result.current.items).toStrictEqual([]);

//   expect(typeof result.current.setSize).toBe("function");
// });

// test("should use counter", () => {
//   let a = "hola";
//   const { result } = renderHook(() =>
//     useSWRPaginated<{ name: string }>(
//       a ? generateGetKey("/demo?q=124") : null,
//       {
//         refreshInterval: 3000,
//       }
//     )
//   );

//   expect(result.current.items).toStrictEqual([]);

//   expect(typeof result.current.setSize).toBe("function");
// });
