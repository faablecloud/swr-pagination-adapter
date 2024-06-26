import { renderHook } from "@testing-library/react-hooks";
import { generateGetKey, useSWRPaginated } from "./useSWRPaginated";

test("should use counter", () => {
  const { result } = renderHook(() =>
    useSWRPaginated<{ id: string }>(generateGetKey("/demo?q=124"))
  );

  expect(result.current.items).toStrictEqual([]);

  expect(typeof result.current.setSize).toBe("function");
});

test("should use counter", () => {
  let a = "hola";
  const { result } = renderHook(() =>
    useSWRPaginated(a ? generateGetKey("/demo?q=124") : null)
  );

  expect(result.current.items).toStrictEqual([]);

  expect(typeof result.current.setSize).toBe("function");
});

test("should use counter", () => {
  let a = "hola";
  const { result } = renderHook(() =>
    useSWRPaginated<{ name: string }>(
      a ? generateGetKey("/demo?q=124") : null,
      {
        refreshInterval: 3000,
      }
    )
  );

  expect(result.current.items).toStrictEqual([]);

  expect(typeof result.current.setSize).toBe("function");
});
