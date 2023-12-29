import { renderHook } from "@testing-library/react-hooks";
import { useSWRPaginated } from "./useSWRPaginated";

test("should use counter", () => {
  const { result } = renderHook(() => useSWRPaginated("/demo?q=124"));

  expect(result.current.data).toBe(undefined);
  expect(result.current.pages).toBe([]);

  expect(typeof result.current.setSize).toBe("function");
});
